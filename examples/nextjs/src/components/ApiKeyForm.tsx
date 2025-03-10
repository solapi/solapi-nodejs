'use client';

import {useAtom} from 'jotai/index';
import {apiKeyAtom, apiSecretAtom} from '@/atoms/CommonAtom';

export default function ApiKeyForm() {
  const [apiKey, setApiKey] = useAtom(apiKeyAtom);
  const [apiSecret, setApiSecret] = useAtom(apiSecretAtom);

  return (
    <div className="w-full flex space-x-2 text-right items-center justify-center">
      <div className="flex flex-auto w-full">
        <label
          className="block text-gray-700 text-sm mb-2 pr-2"
          htmlFor="apiKey">
          API Key
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="apiKey"
          type="text"
          name="apiKey"
          placeholder="API Key"
          required={true}
          value={apiKey}
          onChange={e => setApiKey(e.target.value)}
        />
      </div>
      <div className="flex flex-auto w-full">
        <label
          className="block text-gray-700 text-sm mb-2 pr-2"
          htmlFor="apiSecret">
          API Secret Key
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="apiSecret"
          type="text"
          name="apiSecret"
          placeholder="API Secret Key"
          required={true}
          value={apiSecret}
          onChange={e => setApiSecret(e.target.value)}
        />
      </div>
    </div>
  );
}
