#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { S3Stack } from '../lib/S3Stack';

const app = new cdk.App();
new S3Stack(app, 'S3Stack', {});
