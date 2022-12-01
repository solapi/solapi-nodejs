import {URL, URLSearchParams} from 'url';

/**
 * @deprecated
 * @param url API URl
 * @param data object data
 */
export default function queryParameterGenerator<T extends object>(
  url: string,
  data?: T,
): string {
  const apiUrl = new URL(url);
  if (data) {
    const urlSearchParams = new URLSearchParams();
    Object.keys(data).forEach(key => {
      // eslint-disable-next-line
      const reflectedValue: any = Reflect.get(data, key);
      if (reflectedValue) {
        urlSearchParams.append(key, reflectedValue);
      }
    });
    apiUrl.search = urlSearchParams.toString();
  }
  return apiUrl.toString();
}
