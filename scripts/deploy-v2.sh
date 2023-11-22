#!/bin/sh

# プロファイルを-pオプションで指定する
# CDKのスタック名を-sオプションで指定する
while getopts p:s: OPT
do
  case $OPT in
    p) PROFILE="$OPTARG" ;;
    s) STACK="$OPTARG" ;;
  esac
done
# プロファイルが指定されていない場合は、デフォルトのプロファイルを使用する
if [ -z $PROFILE ]; then
  PROFILE="default"
fi
# スタック名が指定されていない場合はエラー
if [ -z $STACK ]; then
  echo "usage: deploy.sh -s <stack name> -p <profile name>"
  exit 1
fi

# CDKのoutputを出力するファイル名を定義
CDK_OUTPUT="./cdk-output/output-v2.json"
# YAML形式でOpenAPIドキュメントを出力するファイル名を定義
OPENAPI_DIR="./openAPI"
OPENAPI_DOC="${OPENAPI_DIR}/openapi-v2.yaml"

# 各種設定値を表示
echo "PROFILE: $PROFILE"
echo "STACK: $STACK"
echo "CDK_OUTPUT: $CDK_OUTPUT"
echo "OPENAPI_DOC: $OPENAPI_DOC"

# 一時停止
echo ""
echo "Press any key to continue..."
read -n 1

# プロファイルを指定してデプロイ
cdk deploy $STACK -O $CDK_OUTPUT --profile $PROFILE

# output-v2.jsonからAPI GatewayのIDを取得
API_ID=$(cat $CDK_OUTPUT | jq -r ".${STACK}.ApiId")

# OpenAPIドキュメントを出力するディレクトリを作成
mkdir -p $OPENAPI_DIR

# API GatewayからOpenAPIドキュメントを取得
aws apigatewayv2 export-api \
  --api-id $API_ID \
  --output-type YAML \
  --specification OAS30 \
  $OPENAPI_DOC \
  --profile=$PROFILE
