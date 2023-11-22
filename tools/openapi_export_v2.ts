import { ApiGatewayV2Client, ExportApiCommand } from "@aws-sdk/client-apigatewayv2";
import { fromIni } from "@aws-sdk/credential-providers";
import { promises as fs } from "fs";
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
const outputFile = options.output ?? "openAPI/openapi_v2.yaml";
// profileを実行時の引数から取得
const profile = options.profile ?? "default";

const client = new ApiGatewayV2Client({
  credentials: fromIni({ profile: profile }),
});

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