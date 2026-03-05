#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from '@aws-cdk/core'
import { DraftCdkStack } from '../lib/draft_cdk-stack'

const app = new cdk.App()
new DraftCdkStack(app, 'DraftCdkStack', {
  env: {
    account: '863826160893',
    region: 'us-east-1',
  },
})
