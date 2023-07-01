import {AppStackProps} from './props';
import {Duration, RemovalPolicy, Stack} from 'aws-cdk-lib';
import {Bucket} from 'aws-cdk-lib/aws-s3';
import {Chain, LogLevel, Parallel, StateMachine} from 'aws-cdk-lib/aws-stepfunctions';
import {LambdaInvoke} from 'aws-cdk-lib/aws-stepfunctions-tasks';
import {Construct} from 'constructs';
import {Rule, Schedule} from "aws-cdk-lib/aws-events";
import {SfnStateMachine} from "aws-cdk-lib/aws-events-targets";
import {LogGroup, RetentionDays} from "aws-cdk-lib/aws-logs";
import {Queue} from "aws-cdk-lib/aws-sqs";

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
    }).branch(extract1LambdaInvoke, extract2LambdaInvoke, extract3LambdaInvoke.addRetry({
      errors: ['States.ALL'],
      interval: Duration.seconds(1),
      maxAttempts: 3,
    }));
    const chain = Chain.start(startLambdaInvoke).next(parallel).next(aggregateLambdaInvoke);

    const logGroup = new LogGroup(this, 'LogGroup', {
      logGroupName: '/aws/stepfunctions/step-functions-sample',
      removalPolicy: RemovalPolicy.DESTROY,
      retention: RetentionDays.ONE_DAY,
    })
    const stateMachine = new StateMachine(this, 'StateMachine', {
      definition: chain,
      logs: {
        destination: logGroup,
        level: LogLevel.ALL,
        includeExecutionData: true,
      }
    });

    bucket.grantReadWrite(stateMachine);

    const dlq = new Queue(this, 'DLQ', {
      queueName: 'step-functions-sample-dlq',
      retentionPeriod: Duration.days(1),
    });
    new Rule(this, 'Rule', {
      schedule: Schedule.rate(Duration.minutes(5)),
      targets: [
        new SfnStateMachine(stateMachine, {
          deadLetterQueue: dlq,
          retryAttempts: 3,
          maxEventAge: Duration.seconds(60)
        })
      ],
    });
  }
}
