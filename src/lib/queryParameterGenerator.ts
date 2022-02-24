import {URL, URLSearchParams} from 'url';

export default function queryParameterGenerator<T extends object>(url: string, data?: T): string {
    const apiUrl = new URL(url);
    if (data) {
        const urlSearchParams = new URLSearchParams();
        Object.keys(data).forEach(key => {
            const reflectedValue = Reflect.get(data, key);
            if (reflectedValue) {
                urlSearchParams.append(key, reflectedValue);
            }
        });
        apiUrl.search = urlSearchParams.toString();
    }
    return apiUrl.toString();
}
