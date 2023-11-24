import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigw2 from '@aws-cdk/aws-apigatewayv2-alpha';
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';

export class IbarakiCdkSampleApiV2Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Lambda 関数を作成
    const ibarakiSampleLambda = new lambda.Function(this, 'ibarakiSampleLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset('lambda/ibaraki-sample-lambda'),
      handler: 'src/index.handler',
    });

    // API Gateway を作成
    const api = new apigw2.HttpApi(this, 'IbarakiCdkSampleApi', {
      apiName: 'Ibaraki CDK Sample API v2',
      corsPreflight: {
        allowHeaders: ['*'],
        allowOrigins: ['*'],
        allowMethods: [apigw2.CorsHttpMethod.ANY],
      },
    });

    // Lambda を API Gateway に統合
    const helloApi = api.addRoutes({
      path: '/{param}/hello',
      methods: [apigw2.HttpMethod.GET],
      integration: new HttpLambdaIntegration("ibarakiSampleIntegration",
        ibarakiSampleLambda,
      ),
    });

    // API Gateway の ID を出力
    new cdk.CfnOutput(this, 'ApiId', {
      value: api.httpApiId
    });
  }
}