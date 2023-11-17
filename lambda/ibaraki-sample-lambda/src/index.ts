import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const param = event?.pathParameters?.param ?? "param";
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Hello, CDK!! ${param}`,
    }),
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": '*'
    },
  };
}
