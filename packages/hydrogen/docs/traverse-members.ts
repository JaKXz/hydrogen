import {
  ApiDocumentedItem,
  ApiItem,
  ApiItemKind,
} from '@microsoft/api-extractor-model';

import {traverseNodes} from './traverse-nodes';

export function traverseMembers(acc, apiItem: ApiItem) {
  const name: string =
    apiItem.getScopedNameWithinPackage() || apiItem.getAssociatedPackage().name;

  const title: string = getTitle(apiItem);

  if (!acc[name]) {
    acc[name] = {};
  }

  if (apiItem instanceof ApiDocumentedItem && apiItem.tsdocComment) {
    return {
      ...acc,
      [name]: {
        ...acc[name],
        title,
        content: Object.values(apiItem.tsdocComment)
          .filter((section) => section?.kind || section?.nodes)
          .map(traverseNodes)
          .join(''),
      },
    };
  }

  if (apiItem.members) {
    return {
      ...acc,
      [name]: [...apiItem.members].reduce(traverseMembers, acc[name]),
    };
  }

  return acc;
}

function getTitle(apiItem) {
  const scopedName = apiItem.getScopedNameWithinPackage();
  switch (apiItem.kind) {
    case ApiItemKind.Class:
      return `${scopedName} class`;
    case ApiItemKind.Enum:
      return `${scopedName} enum`;
    case ApiItemKind.Interface:
      return `${scopedName} interface`;
    case ApiItemKind.Constructor:
    case ApiItemKind.ConstructSignature:
      return scopedName;
    case ApiItemKind.Method:
    case ApiItemKind.MethodSignature:
      return `${scopedName} method`;
    case ApiItemKind.Function:
      return `${scopedName} function`;
    case ApiItemKind.Model:
      return `API Reference`;
    case ApiItemKind.Namespace:
      return `${scopedName} namespace`;
    case ApiItemKind.Package:
      console.log(`Writing ${apiItem.displayName} package`);
      return `${apiItem.displayName} package`;
    case ApiItemKind.Property:
    case ApiItemKind.PropertySignature:
      return `${scopedName} property`;
    case ApiItemKind.TypeAlias:
      return `${scopedName} type`;
    case ApiItemKind.Variable:
      return `${scopedName} variable`;
    default:
      return apiItem.kind + 'XXX';
  }
}
