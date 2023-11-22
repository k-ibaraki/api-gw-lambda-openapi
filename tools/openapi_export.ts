import { APIGatewayClient, GetExportCommand } from "@aws-sdk/client-api-gateway";
import { fromIni } from "@aws-sdk/credential-providers";
import { promises as fs } from "fs";
import * as yaml from "js-yaml";
import { program } from "commander";

// 引数のパース
program
  .option("-a, --api <api-id>", "API ID")
  .option("-o, --output <filename>", "Output YAML file path")
  .option("--profile <aws-profile>", "AWS profile name")
  .parse(process.argv);
const options = program.opts();

// apiIDを実行時の引数から取得
const apiID = options.api ?? undefined;
// 出力ファイル名を実行時の引数から取得
const outputFile = options.output ?? "openAPI/openapi.yaml";
// profileを実行時の引数から取得
const profile = options.profile ?? "default";

const client = new APIGatewayClient({
  credentials: fromIni({ profile: profile }),
});


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