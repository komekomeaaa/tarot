import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigatewayv2 from 'aws-cdk-lib/aws-apigatewayv2';
import * as apigatewayv2Integrations from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class TarotStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // ===== Phase 1: 静的ホスティング =====

        const websiteBucket = new s3.Bucket(this, 'TarotWebsiteBucket', {
            bucketName: `tarot-app-${this.account}`,
            publicReadAccess: false,
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
            removalPolicy: cdk.RemovalPolicy.RETAIN,
            autoDeleteObjects: false,
            versioned: true,
            encryption: s3.BucketEncryption.S3_MANAGED,
            cors: [
                {
                    allowedMethods: [s3.HttpMethods.GET],
                    allowedOrigins: ['*'],
                    allowedHeaders: ['*'],
                },
            ],
        });

        const originAccessIdentity = new cloudfront.OriginAccessIdentity(
            this,
            'TarotOAI',
            { comment: 'OAI for Tarot App' }
        );

        websiteBucket.grantRead(originAccessIdentity);

        const distribution = new cloudfront.Distribution(this, 'TarotDistribution', {
            defaultBehavior: {
                origin: new origins.S3Origin(websiteBucket, { originAccessIdentity }),
                viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
                cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
                compress: true,
            },
            defaultRootObject: 'index.html',
            errorResponses: [
                { httpStatus: 404, responseHttpStatus: 200, responsePagePath: '/index.html', ttl: cdk.Duration.minutes(5) },
                { httpStatus: 403, responseHttpStatus: 200, responsePagePath: '/index.html', ttl: cdk.Duration.minutes(5) },
            ],
            priceClass: cloudfront.PriceClass.PRICE_CLASS_200,
            enabled: true,
            comment: 'Tarot App Distribution',
        });

        // ===== Phase 2: バックエンド（3 Lambda関数） =====

        const USER_POOL_ID = 'ap-northeast-1_MOJHUBPa9';
        const CLIENT_ID = '7cjts68qb47nt5k3mkia30lbmd';

        // Lambda実行ロール
        const lambdaRole = new iam.Role(this, 'TarotLambdaRole', {
            assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
            managedPolicies: [
                iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
            ],
        });

        // DynamoDBアクセス権限
        lambdaRole.addToPolicy(new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: ['dynamodb:GetItem', 'dynamodb:PutItem', 'dynamodb:UpdateItem'],
            resources: [`arn:aws:dynamodb:${this.region}:${this.account}:table/tarot-users`],
        }));

        // Cognitoアクセス権限
        lambdaRole.addToPolicy(new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: ['cognito-idp:SignUp', 'cognito-idp:InitiateAuth', 'cognito-idp:AdminConfirmSignUp'],
            resources: [`arn:aws:cognito-idp:${this.region}:${this.account}:userpool/${USER_POOL_ID}`],
        }));

        // Lambda関数共通設定
        const lambdaCommon = {
            runtime: lambda.Runtime.NODEJS_20_X,
            code: lambda.Code.fromAsset('../backend/dist'),
            role: lambdaRole,
            timeout: cdk.Duration.seconds(30),
            environment: { USER_POOL_ID, CLIENT_ID, TABLE_NAME: 'tarot-users' },
        };

        // Lambda関数 x3
        const signUpFn = new lambda.Function(this, 'SignUpFunction', {
            ...lambdaCommon,
            functionName: 'tarot-signUp',
            handler: 'handlers/auth.signUp',
            description: 'ユーザー登録',
        });

        const signInFn = new lambda.Function(this, 'SignInFunction', {
            ...lambdaCommon,
            functionName: 'tarot-signIn',
            handler: 'handlers/auth.signIn',
            description: 'ログイン',
        });

        const checkAndRecordFn = new lambda.Function(this, 'CheckAndRecordFunction', {
            ...lambdaCommon,
            functionName: 'tarot-checkAndRecord',
            handler: 'handlers/auth.checkAndRecord',
            description: '月1回チェック＆記録',
        });

        // HTTP API Gateway
        const httpApi = new apigatewayv2.HttpApi(this, 'TarotHttpApi', {
            apiName: 'tarot-api',
            description: 'Tarot App HTTP API',
            corsPreflight: {
                allowOrigins: ['*'],
                allowMethods: [apigatewayv2.CorsHttpMethod.GET, apigatewayv2.CorsHttpMethod.POST, apigatewayv2.CorsHttpMethod.OPTIONS],
                allowHeaders: ['Content-Type', 'Authorization'],
            },
        });

        // ルート追加（認証なしでシンプルに）
        httpApi.addRoutes({
            path: '/auth/signup',
            methods: [apigatewayv2.HttpMethod.POST],
            integration: new apigatewayv2Integrations.HttpLambdaIntegration('SignUpInt', signUpFn),
        });

        httpApi.addRoutes({
            path: '/auth/signin',
            methods: [apigatewayv2.HttpMethod.POST],
            integration: new apigatewayv2Integrations.HttpLambdaIntegration('SignInInt', signInFn),
        });

        httpApi.addRoutes({
            path: '/reading/check-and-record',
            methods: [apigatewayv2.HttpMethod.POST],
            integration: new apigatewayv2Integrations.HttpLambdaIntegration('CheckRecordInt', checkAndRecordFn),
        });

        // 出力
        new cdk.CfnOutput(this, 'BucketName', { value: websiteBucket.bucketName, description: 'S3 Bucket Name' });
        new cdk.CfnOutput(this, 'DistributionDomain', { value: distribution.distributionDomainName, description: 'CloudFront Domain' });
        new cdk.CfnOutput(this, 'DistributionId', { value: distribution.distributionId, description: 'CloudFront Distribution ID' });
        new cdk.CfnOutput(this, 'WebsiteURL', { value: `https://${distribution.distributionDomainName}`, description: 'Website URL' });
        new cdk.CfnOutput(this, 'ApiUrl', { value: httpApi.url || '', description: 'HTTP API Gateway URL' });
    }
}
