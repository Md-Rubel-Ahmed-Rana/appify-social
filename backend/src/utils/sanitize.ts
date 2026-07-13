import sanitizeHtml from "sanitize-html";

export const sanitizePostContent = (content: string) => {
  return sanitizeHtml(content, {
    allowedTags: [],
    allowedAttributes: {},
    disallowedTagsMode: "discard",
  })
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};
