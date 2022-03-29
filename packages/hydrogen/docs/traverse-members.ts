import {ApiDocumentedItem, ApiItem} from '@microsoft/api-extractor-model';
import {traverseNodes} from "./traverse-nodes";

export function traverseMembers(member: ApiItem, depth = 0): any {
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

function formatDepth(depth: number): string {
  return Array.from({length: depth})
    .map(() => '\t')
    .join('');
}
