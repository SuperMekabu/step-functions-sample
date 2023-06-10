#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { S3Stack } from '../lib/S3Stack';
import { LambdaStack } from '../lib/LambdaStack';
import { StepFunctionsStack } from '../lib/StepFunctionsStack';
import { LambdaLayerStack } from '../lib/LambdaLayerStack';

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
