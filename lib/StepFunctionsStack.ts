import { Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AppStackProps } from './props';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { LambdaInvoke } from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { Chain, Parallel, StateMachine } from 'aws-cdk-lib/aws-stepfunctions';

interface StepFunctionsStackProps extends AppStackProps {
  bucket: Bucket;
  startLambdaInvoke: LambdaInvoke;
  extract1LambdaInvoke: LambdaInvoke;
  extract2LambdaInvoke: LambdaInvoke;
  extract3LambdaInvoke: LambdaInvoke;
  aggregateLambdaInvoke: LambdaInvoke;
}

export class StepFunctionsStack extends Stack {
  constructor(scope: Construct, id: string, props: StepFunctionsStackProps) {
    super(scope, id, props);

    const {
      bucket,
      startLambdaInvoke,
      extract1LambdaInvoke,
      extract2LambdaInvoke,
      extract3LambdaInvoke,
      aggregateLambdaInvoke,
    } = props;

    const parallel = new Parallel(this, 'Parallel', {
      outputPath: '$',
    }).branch(extract1LambdaInvoke, extract2LambdaInvoke, extract3LambdaInvoke);
    const chain = Chain.start(startLambdaInvoke).next(parallel).next(aggregateLambdaInvoke);

    const stateMachine = new StateMachine(this, 'StateMachine', {
      definition: chain,
    });

    bucket.grantReadWrite(stateMachine);
  }
}
