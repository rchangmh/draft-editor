import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as sqs from 'aws-cdk-lib/aws-sqs'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment'

interface StaticStackProps extends cdk.StackProps {
  staticAssetsPath: string
}

export class StaticStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: StaticStackProps) {
    super(scope, id, props)

    const destinationBucket = new s3.Bucket(this, 'destinationBucket', {
      websiteIndexDocument: 'index.html',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      publicReadAccess: true,
    })

    const deployment = new s3deploy.BucketDeployment(this, 'deployment', {
      sources: [s3deploy.Source.asset(props.staticAssetsPath)],
      destinationBucket,
      retainOnDelete: false,
    })

    new cdk.CfnOutput(this, 'url', {
      description: 'url',
      value: destinationBucket.urlForObject('index.html'),
    })
  }
}
