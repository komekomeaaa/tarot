# Phase 2 AWS リソース情報

## Cognito

### User Pool v2（メール不要版）
- **User Pool ID**: `ap-northeast-1_MOJHUBPa9`
- **User Pool ARN**: `arn:aws:cognito-idp:ap-northeast-1:698109621952:userpool/ap-northeast-1_MOJHUBPa9`
- **リージョン**: `ap-northeast-1`

### App Client v2
- **Client ID**: `7cjts68qb47nt5k3mkia30lbmd`
- **Client Name**: `tarot-app-client-v2`

### 設定
- ユーザー名: 任意の文字列（メールアドレス不要）
- 自動検証: なし
- パスワードポリシー: 最小8文字（大文字・数字・記号不要）
- 認証フロー: USER_PASSWORD_AUTH, USER_SRP_AUTH, REFRESH_TOKEN_AUTH

---

## DynamoDB

### テーブル

#### tarot-users
- **テーブル名**: `tarot-users`
- **プライマリキー**: `userId` (String)
- **請求モード**: PAY_PER_REQUEST（オンデマンド）

#### tarot-readings
- **テーブル名**: `tarot-readings`
- **プライマリキー**: `readingId` (String)
- **GSI**: `UserIdIndex`
  - パーティションキー: `userId` (String)
  - ソートキー: `createdAt` (String)
- **請求モード**: PAY_PER_REQUEST（オンデマンド）

---

## フロントエンド設定用

### src/config/aws-config.ts
```typescript
export const awsConfig = {
  region: 'ap-northeast-1',
  userPoolId: 'ap-northeast-1_MOJHUBPa9',
  userPoolWebClientId: '7cjts68qb47nt5k3mkia30lbmd',
  apiGatewayUrl: '', // 後で追加
};
```

---

## できたこと

### ✅ Phase 2A: 基盤作成完了
- Cognito User Pool v2（メール不要）
- DynamoDB テーブル（users, readings）
- note連携ファイル（note-links.ts, NoteLinkCTA.tsx, note-cta.css）

### ✅ Phase 2B: バックエンドデプロイ完了
- Lambda関数 x3（signUp, signIn, checkAndRecord）
- HTTP API Gateway

**API URL**: `https://pvcljyqd70.execute-api.ap-northeast-1.amazonaws.com/`

**エンドポイント**:
- `POST /auth/signup` - ユーザー登録
- `POST /auth/signin` - ログイン
- `POST /reading/check-and-record` - 月1回チェック＆記録

### 🔜 Phase 2C: 次のステップ
1. フロントエンド統合（ログイン画面、月1回チェック）

---

**作成日時**: 2025-12-19 11:01 JST
**更新日時**: 2025-12-19 13:16 JST
