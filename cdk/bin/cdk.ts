#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { StaticStack } from '../lib/static-stack'
import * as path from 'path'

const app = new cdk.App()
const draftStack = new StaticStack(app, 'draftStack', {
  staticAssetsPath: path.join(__dirname, '..', '..', 'svelte', 'public'),
  hostedZoneId: 'Z03304211EX845FJI16N9',
  subdomainName: 'draft',
  zoneName: 'cdk.link',
})
