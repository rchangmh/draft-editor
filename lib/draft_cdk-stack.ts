import * as cdk from '@aws-cdk/core'
import * as s3 from '@aws-cdk/aws-s3'
import * as s3deploy from '@aws-cdk/aws-s3-deployment'

export class DraftCdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const draftBucket = new s3.Bucket(this, 'DraftBucket', {
      websiteIndexDocument: 'index.html',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      publicReadAccess: true,
    })

    const deployment = new s3deploy.BucketDeployment(this, 'DeployDraft', {
      sources: [s3deploy.Source.asset('./svelte-draft-editor/public')],
      destinationBucket: draftBucket,
      retainOnDelete: false,
    })

    new cdk.CfnOutput(this, 'URL', {
      description: 'Draft Editor URL',
      value: draftBucket.urlForObject('index.html'),
    })

  }
}
