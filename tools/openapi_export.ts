import { APIGatewayClient, GetExportCommand } from "@aws-sdk/client-api-gateway";
import { promises as fs } from "fs";
import * as yaml from "js-yaml";

const client = new APIGatewayClient({ region: "ap-northeast-1" });

// apiIDを実行時の引数から取得
const apiID = process.argv[2] ?? "";
// 出力ファイル名を実行時の引数から取得
const outputFile = process.argv[3] ?? "openapi.yaml";


async function exportOpenApi(apiId: string, outputFile: string) {
  const command = new GetExportCommand({
    restApiId: apiId,
    stageName: "prod",
    exportType: "oas30",
    parameters: {
      extensions: "integrations",
    },
  });

  try {
    const response = await client.send(command);
    // yamlを指定してもjsonで返ってくるので、諦めてjsonからyamlに変換する
    const openApiDocument = response.body;
    const jsonDocument = (new TextDecoder()).decode(openApiDocument);
    const yamlDocument = yaml.dump(JSON.parse(jsonDocument));
    // yamlファイルに書き出す
    await fs.writeFile(outputFile, yamlDocument);
    console.log("OpenAPI document exported successfully.");
  } catch (error) {
    console.error(error);
  }
}

exportOpenApi(apiID, outputFile);