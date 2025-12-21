import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import { Construct } from 'constructs';

export class TarotStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // ===== Phase 1: 静的ホスティング =====

        const websiteBucket = new s3.Bucket(this, 'TarotWebsiteBucket', {
            bucketName: `tarot-app-v2-${this.account}`,
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

        // 出力
        new cdk.CfnOutput(this, 'BucketName', { value: websiteBucket.bucketName, description: 'S3 Bucket Name' });
        new cdk.CfnOutput(this, 'DistributionDomain', { value: distribution.distributionDomainName, description: 'CloudFront Domain' });
        new cdk.CfnOutput(this, 'DistributionId', { value: distribution.distributionId, description: 'CloudFront Distribution ID' });
        new cdk.CfnOutput(this, 'WebsiteURL', { value: `https://${distribution.distributionDomainName}`, description: 'Website URL' });
    }
}
