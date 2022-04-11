import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment'
import * as r53 from 'aws-cdk-lib/aws-route53'
import * as acm from 'aws-cdk-lib/aws-certificatemanager'
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront'
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins'

interface StaticStackProps extends cdk.StackProps {
  staticAssetsPath: string
  hostedZoneId: string
  zoneName: string
  subdomainName: string
}

export class StaticStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: StaticStackProps) {
    super(scope, id, props)

    const bucket = new s3.Bucket(this, 'bucket', {
      websiteIndexDocument: 'index.html',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      publicReadAccess: true,
    })

    const deployment = new s3deploy.BucketDeployment(this, 'deployment', {
      sources: [s3deploy.Source.asset(props.staticAssetsPath)],
      destinationBucket: bucket,
      retainOnDelete: false,
    })

    const domainZone = r53.HostedZone.fromHostedZoneAttributes(this, 'zone', {
      hostedZoneId: props.hostedZoneId,
      zoneName: props.zoneName,
    })

    const domainName = `${props.subdomainName}.${props.zoneName}`

    const certificate = new acm.Certificate(this, 'certificate', {
      domainName,
      validation: acm.CertificateValidation.fromDns(domainZone),
    })

    const distribution = new cloudfront.CloudFrontWebDistribution(this, 'distribution', {
      viewerCertificate: {
        aliases: [domainName],
        props: {
          acmCertificateArn: certificate.certificateArn,
          sslSupportMethod: cloudfront.SSLMethod.SNI,
        },
      },
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: bucket,
          },
          behaviors: [
            {
              isDefaultBehavior: true,
              viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            },
          ],
        },
      ],
    })

    const cname = new r53.CnameRecord(this, 'cname', {
      domainName: distribution.distributionDomainName,
      zone: domainZone,
      recordName: domainName,
    })

    new cdk.CfnOutput(this, 'url', {
      description: 'url',
      value: cname.domainName,
    })
  }
}
