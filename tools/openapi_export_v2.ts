import { ApiGatewayV2Client, ExportApiCommand } from "@aws-sdk/client-apigatewayv2";
import { promises as fs } from "fs";
import * as yaml from "js-yaml";

const client = new ApiGatewayV2Client({ region: "ap-northeast-1" });

// apiIDを実行時の引数から取得
const apiID = process.argv[2] ?? "";
// 出力ファイル名を実行時の引数から取得
const outputFile = process.argv[3] ?? "openapi.yaml";


async function exportOpenApi(apiId: string, outputFile: string) {
  const command = new ExportApiCommand({
    ApiId: apiId,
    OutputType: "YAML",
    Specification: "OAS30",
  });

  try {
    const response = await client.send(command);
    const openApiDocument = response.body;
    const yamlDocument = (new TextDecoder()).decode(openApiDocument);
    // yamlファイルに書き出す
    await fs.writeFile(outputFile, yamlDocument);
    console.log("OpenAPI document exported successfully.");
  } catch (error) {
    console.error(error);
  }
}

exportOpenApi(apiID, outputFile);