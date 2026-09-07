import { sanitizeRetrievedContent } from "../security/prompt.injection.js";

export function buildContext(documents) {
  return documents
    .map((document) => {
      const content = sanitizeRetrievedContent(document.content);

      return `
<document>
<document_id>
${document.documentId}
</document_id>

<title>
${document.title}
</title>

<content>
${content}
</content>
</document>
`;
    })
    .join("\n");
}
