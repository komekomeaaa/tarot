# Phase 2 AWS リソース情報 (変更: バックエンド削除済み)

## フロントエンドホスティング
- **S3 Bucket**: `tarot-app-{account-id}`
- **CloudFront**: Enabled (HTTPS)

---

## 削除されたリソース
以下のリソースは削除されました（ログイン不要・ブラウザ制限への移行のため）
- Cognito User Pool & Client
- DynamoDB Tables (users, readings)
- API Gateway & Lambda Functions
- `src/config/aws-config.ts` などの関連コード
- `backend/` ディレクトリ（Lambdaコード）

---

**更新日時**: 2025-12-21 15:00 JST
