export function traverseNodes(node: any): string {
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
