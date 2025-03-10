export function formDataToObject(formData: FormData): Record<string, string> {
  return Object.fromEntries(formData.entries()) as Record<string, string>;
}

export const variablesInputPattern = /^#\{.+}$/;

export function extractVariablesFields(
  data: Record<string, string>,
): Record<string, string> {
  return Object.keys(data)
    .filter(key => variablesInputPattern.test(key))
    .reduce(
      (acc, key) => {
        acc[key] = data[key];
        return acc;
      },
      {} as Record<string, string>,
    );
}
