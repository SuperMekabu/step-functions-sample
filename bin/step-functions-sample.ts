#!/usr/bin/env node
import { LambdaLayerStack } from '../lib/LambdaLayerStack';
import { LambdaStack } from '../lib/LambdaStack';
import { S3Stack } from '../lib/S3Stack';
import { StepFunctionsStack } from '../lib/StepFunctionsStack';
import * as cdk from 'aws-cdk-lib';
import 'source-map-support/register';

const app = new cdk.App();
const { bucket } = new S3Stack(app, 'StepFunctionsSampleS3Stack', {});
const { layer } = new LambdaLayerStack(app, 'StepFunctionsSampleLambdaLayerStack', {});
const { startLambdaInvoke, extract1LambdaInvoke, extract2LambdaInvoke, extract3LambdaInvoke, aggregateLambdaInvoke } =
  new LambdaStack(app, 'StepFunctionsSampleLambdaStack', { bucket, layer });
new StepFunctionsStack(app, 'StepFunctionsSampleStepFunctionsStack', {
  bucket,
  startLambdaInvoke,
  extract1LambdaInvoke,
  extract2LambdaInvoke,
  extract3LambdaInvoke,
  aggregateLambdaInvoke,
});
