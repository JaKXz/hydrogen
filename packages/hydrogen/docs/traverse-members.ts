import {ApiDocumentedItem, ApiItem} from '@microsoft/api-extractor-model';
import {traverseNodes} from './traverse-nodes';

export function traverseMembers(acc, apiItem: ApiItem) {
  const name: string =
    apiItem.getScopedNameWithinPackage() ||
    apiItem.displayName ||
    apiItem.getAssociatedPackage().name;
  if (apiItem.members) {
    if (!acc[name]) {
      acc[name] = {};
    }

    if (apiItem instanceof ApiDocumentedItem && apiItem.tsdocComment) {
      return {
        ...acc,
        [name]: Object.values(apiItem.tsdocComment)
          .filter((section) => section?.kind || section?.nodes)
          .map(traverseNodes)
          .join(''),
      };
    }

    return {
      ...acc,
      [name]: [...apiItem.members].reduce(traverseMembers, acc[name]),
    };
  }

  return acc;
}

/*
{
  "hydrogen": {
    "AddToCart": {

    },
  }
}
 */
