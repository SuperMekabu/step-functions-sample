import { Stack } from 'aws-cdk-lib';
import { AppStackProps } from './props';
import { Construct } from 'constructs';
import { PythonLayerVersion } from '@aws-cdk/aws-lambda-python-alpha';
import { Runtime } from 'aws-cdk-lib/aws-lambda';

export class LambdaLayerStack extends Stack {
  layer: PythonLayerVersion;

  constructor(scope: Construct, id: string, props: AppStackProps) {
    super(scope, id, props);

    this.layer = new PythonLayerVersion(this, 'PythonLayer', {
      layerVersionName: 'PythonLayer',
      entry: `${__dirname}/src/layer`,
      compatibleRuntimes: [Runtime.PYTHON_3_9],
    });
  }
}
