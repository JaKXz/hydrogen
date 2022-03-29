import {
  ApiDocumentedItem,
  ApiItem,
  ApiModel,
  ApiPackage,
  ApiItemKind,
} from '@microsoft/api-extractor-model';
import * as path from 'path';
import {
  Extractor,
  ExtractorConfig,
  ExtractorResult,
} from '@microsoft/api-extractor';

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

function traverseMembers(member: ApiItem, depth = 0): any {
  const name = member.getScopedNameWithinPackage();
  console.log(formatDepth(depth) + name);

  if (member instanceof ApiDocumentedItem && member.tsdocComment) {
    Object.values(member.tsdocComment).forEach((section) => {
      if (section?.kind || section?.nodes) {
        console.log(formatDepth(depth) + traverseNodes(section));
      }
    });
  }

  for (const deepMember of member.members) {
    traverseMembers(deepMember, depth + 1);
  }
}

function traverseNodes(node: any): string {
  if (node.nodes) {
    return node.nodes.map(traverseNodes).join('');
  }
  switch (node.kind) {
    case 'EntryPoint':
      return node.members.map(traverseNodes).join('');
    case 'BlockTag':
      if (node.tagValue) {
        return `${node.tagName}: ${node.tagValue}`;
      }
      return node.tagName;
    case 'Excerpt':
      return node.content;
    case 'PlainText':
      return node.text;
    case 'SoftBreak':
      return ' ';
    case 'ParamCollection':
      return Object.values(node.blocks).map(traverseNodes).join('');
    case 'ParamBlock':
    case 'Block':
    case 'IndexSignature':
    case 'PropertySignature':
    case 'CodeSpan':
    case 'Content':
    case 'Reference':
      return Object.values(node)
        .filter((m) => !!m)
        .map(traverseNodes)
        .join('');
    case undefined:
      return parseUnknown(node);
    case 'Function':
    case 'Interface':
    case 'TypeAlias':
    case 'Variable':
      if (node.tsdocComment) {
        return Object.values(node.tsdocComment)
          .filter((c) => !!c)
          .map(traverseNodes)
          .join('');
      }
      return getUsefulKeys(node);
    default:
      return `XXX ${node.kind} XXX\n`;
  }
}

function formatDepth(depth: number): string {
  return Array.from({length: depth})
    .map(() => '\t')
    .join('');
}

function parseUnknown(node: any): string {
  if (Array.isArray(node)) {
    return node.map(traverseNodes).join('');
  }
  if (node.text) {
    return node.text;
  }
  if (typeof node === 'string' && node !== 'Content') {
    return node;
  }
  return getUsefulKeys(node) || '';
}

function getUsefulKeys(
  node: any,
  keys = [
    'typeExcerpt',
    'variableTypeExcerpt',
    'extendsTypes',
    'tokens',
    'contentTokens',
    'excerptTokens',
  ]
): string {
  return keys
    .map((key) => deepGet(node, key))
    .filter((m) => !!m)
    .map(traverseNodes)
    .join('');
}

function deepGet(obj: any, path: any): any {
  return path
    .split('.')
    .reduce((acc: {[x: string]: any}, part: string) => acc[part], obj);
}
