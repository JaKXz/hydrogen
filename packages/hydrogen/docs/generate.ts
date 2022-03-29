import {ApiModel, ApiPackage} from '@microsoft/api-extractor-model';
import * as path from 'path';
import {
  Extractor,
  ExtractorConfig,
  ExtractorResult,
} from '@microsoft/api-extractor';
import {traverseMembers} from './traverse-members';
import {traverseNodes} from './traverse-nodes';

const apiExtractorConfig: string = path.join(__dirname, 'api-extractor.json');
// Load and parse the api-extractor.json file
const extractorConfig: ExtractorConfig =
  ExtractorConfig.loadFileAndPrepare(apiExtractorConfig);
// Invoke API Extractor
const extractorResult: ExtractorResult = Extractor.invoke(extractorConfig, {
  // Equivalent to the "--local" command-line parameter
  localBuild: true,
  // Equivalent to the "--verbose" command-line parameter
  // showVerboseMessages: true,
  messageCallback: (message) => {
    // delete message;
    if (message.messageId.includes('ae')) {
      console.log(message);
    }
  },
});

if (!extractorResult.succeeded) {
  console.error(
    `API Extractor completed with ${extractorResult.errorCount} errors` +
      ` and ${extractorResult.warningCount} warnings`
  );
  process.exitCode = 1;
}

const apiModel: ApiModel = new ApiModel();
const apiPackage: ApiPackage = apiModel.loadPackage(
  path.join(__dirname, 'temp', 'hydrogen.api.json')
);

for (const apiItem of apiPackage.members) {
  traverseMembers(apiItem);
}
