import {ApiDocumentedItem, ApiItem} from '@microsoft/api-extractor-model';
import {traverseNodes} from './traverse-nodes';

export function traverseMembers(acc, member: ApiItem) {
  const name = member.getScopedNameWithinPackage() || member.displayName;
  if (member.members) {
    if (!acc[name]) {
      acc[name] = {};
    }

    if (member instanceof ApiDocumentedItem && member.tsdocComment) {
      return {
        ...acc,
        [name]: Object.values(member.tsdocComment)
          .filter((section) => section?.kind || section?.nodes)
          .map(traverseNodes)
          .join(''),
      };
    }

    return {
      ...acc,
      [name]: [...member.members].reduce(traverseMembers, acc[name]),
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
