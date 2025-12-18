# Tarot App - AWS CDK Infrastructure

AWS CDKを使用したタロット占いアプリのインフラストラクチャコードです。

## Phase 1: 静的ホスティング

現在実装中のフェーズです。S3 + CloudFrontで静的サイトをホスティングします。

### 構成

- **S3 Bucket**: 静的ファイル保存
  - バージョニング有効化
  - CloudFrontからのみアクセス可能
  - 暗号化有効

- **CloudFront Distribution**: CDN配信
  - HTTPS強制
  - カスタムエラーページ（SPA対応）
  - グローバル配信（アジア・北米・ヨーロッパ）

### セットアップ

```bash
# 依存関係インストール
cd infra
npm install

# AWSアカウント設定（初回のみ）
aws configure

# ビルド
npm run build

# CDKブートストラップ（初回のみ）
npx cdk bootstrap

# デプロイ前確認
npx cdk diff

# デプロイ
npx cdk deploy
```

### デプロイ後

```bash
# 出力されたURLにアクセス
# https://xxxxx.cloudfront.net
```

### 更新デプロイ

```bash
# アプリをビルド
cd ..
npm run build

# インフラ更新
cd infra
npx cdk deploy
```

### リソース削除

```bash
npx cdk destroy
```

## 環境変数

不要（Phase 1では環境変数なし）

## コスト

- S3: ~$0.50/月（10GB以下）
- CloudFront: 無料枠あり、超過時~$2/月
- 合計: ~$1-3/月

## 次のフェーズ

Phase 2でAPI Gateway、Lambda、DynamoDB、Cognitoを追加予定。
