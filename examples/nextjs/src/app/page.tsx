'use client';

import {useSearchParams} from 'next/navigation';
import SMSForm from '@/components/SMSForm';
import Toast from '@/components/Toast';
import Tabs from '@/components/Tabs';
import {useAtom, useStore, Provider} from 'jotai';
import {apiKeyAtom, apiSecretAtom, tabAtom} from '@/atoms/CommonAtom';
import AlimtalkForm from '@/components/AlimtalkForm';
import {useEffect} from 'react';
import {getApiKeys} from '@/app/actions';

export default function Home() {
  const searchParams = useSearchParams();
  const isSuccess = !!searchParams.get('success');
  const [activeTab] = useAtom(tabAtom);
  const store = useStore();
  const [, setApiKey] = useAtom(apiKeyAtom);
  const [, setApiSecret] = useAtom(apiSecretAtom);

  useEffect(() => {
    getApiKeys().then(keys => {
      setApiKey(keys[0] ?? '');
      setApiSecret(keys[1] ?? '');
    });
  }, []);

  return (
    <Provider store={store}>
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
        <Tabs />
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
          <div className="flex justify-center flex-auto w-full">
            <h1 className="text-4xl font-black text-center">
              Next.js + SOLAPI {activeTab === 'sms' ? '문자' : '알림톡'} 발송
              예제
            </h1>
          </div>
          {activeTab === 'sms' ? <SMSForm /> : <AlimtalkForm />}
        </main>
        <Toast isSuccess={isSuccess} />
      </div>
    </Provider>
  );
}
