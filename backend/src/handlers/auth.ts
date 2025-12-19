import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  InitiateAuthCommand,
  AdminConfirmSignUpCommand
} from '@aws-sdk/client-cognito-identity-provider';
import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

const cognito = new CognitoIdentityProviderClient({ region: 'ap-northeast-1' });
const dynamodb = new DynamoDBClient({ region: 'ap-northeast-1' });

const USER_POOL_ID = process.env.USER_POOL_ID || 'ap-northeast-1_MOJHUBPa9';
const CLIENT_ID = process.env.CLIENT_ID || '7cjts68qb47nt5k3mkia30lbmd';
const TABLE_NAME = 'tarot-users';

/**
 * CORS headers
 */
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Content-Type': 'application/json'
};

/**
 * ユーザー登録
 */
export async function signUp(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    const { username, password } = JSON.parse(event.body || '{}');

    if (!username || !password) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'ユーザー名とパスワードが必要です' })
      };
    }

    if (password.length < 8) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'パスワードは8文字以上必要です' })
      };
    }

    // Cognitoでユーザー作成
    await cognito.send(new SignUpCommand({
      ClientId: CLIENT_ID,
      Username: username,
      Password: password
    }));

    // ユーザーを自動確認（メール確認スキップ）
    await cognito.send(new AdminConfirmSignUpCommand({
      UserPoolId: USER_POOL_ID,
      Username: username
    }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: '登録成功！ログインしてください。', success: true })
    };
  } catch (error: any) {
    console.error('SignUp error:', error);

    // ユーザー名重複エラー
    if (error.name === 'UsernameExistsException') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'このユーザー名は既に使われています', code: 'USERNAME_EXISTS' })
      };
    }

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message || '登録エラー' })
    };
  }
}

/**
 * ログイン
 */
export async function signIn(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    const { username, password } = JSON.parse(event.body || '{}');

    if (!username || !password) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'ユーザー名とパスワードが必要です' })
      };
    }

    // Cognito認証
    const result = await cognito.send(new InitiateAuthCommand({
      ClientId: CLIENT_ID,
      AuthFlow: 'USER_PASSWORD_AUTH',
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password
      }
    }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        token: result.AuthenticationResult?.IdToken,
        refreshToken: result.AuthenticationResult?.RefreshToken,
        expiresIn: result.AuthenticationResult?.ExpiresIn
      })
    };
  } catch (error: any) {
    console.error('SignIn error:', error);
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: 'ユーザー名またはパスワードが正しくありません' })
    };
  }
}

/**
 * 月1回チェック＆記録（統合版）
 * - 今月すでに占ったかチェック
 * - OKなら記録して続行許可
 */
export async function checkAndRecord(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    // Cognito Authorizerから取得
    const userId = event.requestContext.authorizer?.claims?.sub;
    const username = event.requestContext.authorizer?.claims?.['cognito:username'];

    if (!userId) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: '認証が必要です' })
      };
    }

    const { sigilType, action } = JSON.parse(event.body || '{}');

    // ユーザー情報取得
    const result = await dynamodb.send(new GetItemCommand({
      TableName: TABLE_NAME,
      Key: marshall({ userId })
    }));

    const user = result.Item ? unmarshall(result.Item) : null;

    // 今月すでに占ったかチェック
    const today = new Date().toISOString().split('T')[0]; // 2025-12-19
    const thisMonth = today.substring(0, 7); // 2025-12
    const lastMonth = user?.lastReadingDate?.substring(0, 7);

    const canRead = !user || thisMonth !== lastMonth;

    // action === 'check' の場合はチェックのみ
    if (action === 'check') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          canRead,
          sigilType: user?.sigilType,
          lastReadingDate: user?.lastReadingDate,
          username: user?.username || username
        })
      };
    }

    // action === 'record' の場合は記録
    if (action === 'record') {
      if (!canRead) {
        return {
          statusCode: 403,
          headers,
          body: JSON.stringify({
            error: '今月はすでに占いを行いました。来月またお越しください。',
            lastReadingDate: user?.lastReadingDate
          })
        };
      }

      if (!sigilType) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'シジルタイプが必要です' })
        };
      }

      // ユーザー情報を更新（初回の場合は作成）
      await dynamodb.send(new PutItemCommand({
        TableName: TABLE_NAME,
        Item: marshall({
          userId,
          username: user?.username || username,
          sigilType,
          lastReadingDate: today,
          updatedAt: new Date().toISOString()
        })
      }));

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          message: '記録成功',
          sigilType,
          lastReadingDate: today
        })
      };
    }

    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'action は "check" または "record" を指定してください' })
    };
  } catch (error: any) {
    console.error('CheckAndRecord error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message || 'エラー' })
    };
  }
}
