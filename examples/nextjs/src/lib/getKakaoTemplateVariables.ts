export default function getKakaoTemplateVariables(
  content?: string,
): Array<string> {
  if (content == null || typeof content === 'undefined') {
    return [];
  }
  const regex = /#\{([^}]+)}/g;
  const results: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = regex.exec(content)) !== null) {
    results.push(match[1]);
  }
  return [...new Set(results)];
}
