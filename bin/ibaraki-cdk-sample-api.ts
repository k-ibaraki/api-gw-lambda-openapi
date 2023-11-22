#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { IbarakiCdkSampleApiStack } from '../lib/ibaraki-cdk-sample-api-stack';
import { IbarakiCdkSampleApiV2Stack } from '../lib/ibaraki-cdk-sample-api-v2-stack';

const app = new cdk.App();
new IbarakiCdkSampleApiStack(app, 'IbarakiCdkSampleApiStack', {});
new IbarakiCdkSampleApiV2Stack(app, 'IbarakiCdkSampleApiV2Stack', {});