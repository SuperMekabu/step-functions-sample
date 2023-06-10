import { AppStackProps } from './props';
import { PythonFunction, PythonLayerVersion } from '@aws-cdk/aws-lambda-python-alpha';
import { Duration, Stack } from 'aws-cdk-lib';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { LambdaInvoke } from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { Construct } from 'constructs';

interface LambdaStackProps extends AppStackProps {
  bucket: Bucket;
  layer: PythonLayerVersion;
}

export class LambdaStack extends Stack {
  startLambdaInvoke: LambdaInvoke;
  extract1LambdaInvoke: LambdaInvoke;
  extract2LambdaInvoke: LambdaInvoke;
  extract3LambdaInvoke: LambdaInvoke;
  aggregateLambdaInvoke: LambdaInvoke;

  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props);

    const { bucket, layer } = props;

    const pythonEntry = `${__dirname}/src`;
    const startLambda = new PythonFunction(this, 'StartLambda', {
      entry: pythonEntry,
      index: 'get_records.py',
      handler: 'handler',
      runtime: Runtime.PYTHON_3_9,
      layers: [layer],
      timeout: Duration.seconds(30),
      environment: {
        BUCKET_NAME: bucket.bucketName,
      },
    });
    bucket.grantWrite(startLambda);
    this.startLambdaInvoke = new LambdaInvoke(this, 'StartLambdaInvoke', {
      lambdaFunction: startLambda,
      timeout: Duration.seconds(30),
      outputPath: '$.Payload',
    });

    const extract1Lambda = new PythonFunction(this, 'Extract1Lambda', {
      entry: pythonEntry,
      index: 'extract_1.py',
      handler: 'handler',
      runtime: Runtime.PYTHON_3_9,
      layers: [layer],
      timeout: Duration.seconds(30),
      environment: {
        BUCKET_NAME: bucket.bucketName,
      },
    });
    bucket.grantRead(extract1Lambda);
    this.extract1LambdaInvoke = new LambdaInvoke(this, 'Extract1LambdaInvoke', {
      lambdaFunction: extract1Lambda,
      timeout: Duration.seconds(30),
      outputPath: '$.Payload',
    });

    const extract2Lambda = new PythonFunction(this, 'Extract2Lambda', {
      entry: pythonEntry,
      index: 'extract_2.py',
      handler: 'handler',
      runtime: Runtime.PYTHON_3_9,
      layers: [layer],
      timeout: Duration.seconds(30),
      environment: {
        BUCKET_NAME: bucket.bucketName,
      },
    });
    bucket.grantRead(extract2Lambda);
    this.extract2LambdaInvoke = new LambdaInvoke(this, 'Extract2LambdaInvoke', {
      lambdaFunction: extract2Lambda,
      timeout: Duration.seconds(30),
      outputPath: '$.Payload',
    });

    const extract3Lambda = new PythonFunction(this, 'Extract3Lambda', {
      entry: pythonEntry,
      index: 'extract_3.py',
      handler: 'handler',
      runtime: Runtime.PYTHON_3_9,
      layers: [layer],
      timeout: Duration.seconds(30),
      environment: {
        BUCKET_NAME: bucket.bucketName,
      },
    });
    bucket.grantRead(extract3Lambda);
    this.extract3LambdaInvoke = new LambdaInvoke(this, 'Extract3LambdaInvoke', {
      lambdaFunction: extract3Lambda,
      timeout: Duration.seconds(30),
      outputPath: '$.Payload',
    });

    const aggregateLambda = new PythonFunction(this, 'AggregateLambda', {
      entry: pythonEntry,
      index: 'aggregator.py',
      handler: 'handler',
      runtime: Runtime.PYTHON_3_9,
      layers: [layer],
      timeout: Duration.seconds(30),
      environment: {
        BUCKET_NAME: bucket.bucketName,
      },
    });
    bucket.grantWrite(aggregateLambda);
    this.aggregateLambdaInvoke = new LambdaInvoke(this, 'AggregateLambdaInvoke', {
      lambdaFunction: aggregateLambda,
      timeout: Duration.seconds(30),
      outputPath: '$.Payload',
    });
  }
}
