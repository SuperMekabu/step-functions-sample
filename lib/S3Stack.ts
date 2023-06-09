import {Construct} from "constructs";
import {AppStackProps} from "./props";
import {RemovalPolicy, Stack} from "aws-cdk-lib";
import {BlockPublicAccess, Bucket} from "aws-cdk-lib/aws-s3";

export class S3Stack extends Stack{
  readonly bucket: Bucket
  constructor(app: Construct, id: string, props: AppStackProps) {
    super(app, id, props);

    this.bucket = new Bucket(this, 'S3Bucket', {
      bucketName: 'step-functions-sample-bucket',
      removalPolicy: RemovalPolicy.DESTROY,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      publicReadAccess: false
    });
  }

}