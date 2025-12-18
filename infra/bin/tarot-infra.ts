#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { TarotStack } from '../lib/tarot-stack';

const app = new cdk.App();

new TarotStack(app, 'TarotAppStack', {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: 'ap-northeast-1' // 東京リージョン
    },
    description: 'Tarot App - Static Hosting (Phase 1)'
});

app.synth();
