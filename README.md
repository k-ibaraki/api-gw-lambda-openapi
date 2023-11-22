# API Gateway - Lambda - OpenAPI

CDKでAPI GatewayとLambdaを作成し、
その後、OpenAPIドキュメントを出力するサンプルです。

## install
```
npm i
```

## build
```
npm run build
```

## deploy

### RestAPI(ApiGateway v1)
```
npm run deploy -- -p {aws-profile}
```

### HttpAPI(ApiGateway v2)
```
npm run deploy-v2 -- -p {aws-profile}
```

## destroy
```
npm run cdk -- destroy --all --profile {profile} 
```
