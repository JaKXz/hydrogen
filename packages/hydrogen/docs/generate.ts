import {ApiModel, ApiPackage} from '@microsoft/api-extractor-model';
import {join} from 'path';
import {
  Extractor,
  ExtractorConfig,
  ExtractorResult,
} from '@microsoft/api-extractor';
import {traverseMembers} from './traverse-members';

const apiExtractorConfig: string = join(__dirname, 'api-extractor.json');
const extractorConfig: ExtractorConfig =
  ExtractorConfig.loadFileAndPrepare(apiExtractorConfig);
const extractorResult: ExtractorResult = Extractor.invoke(extractorConfig, {
  localBuild: true,
  messageCallback: (message) => {
    message = undefined;
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
  join(__dirname, 'temp', 'hydrogen.api.json')
);

console.log([...apiPackage.members].reduce(traverseMembers, {}));
