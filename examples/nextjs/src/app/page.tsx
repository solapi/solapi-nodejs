'use client';

import Form from 'next/form';
import {sendMessage} from '@/app/actions';
import {useSearchParams} from 'next/navigation';
import {useRouter} from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isSuccess = !!searchParams.get('success');

  const handleCloseEvent = async () => {
    router.replace('/');
  };

  return (
    <>
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
          <Form
            action={sendMessage}
            formMethod="POST"
            className="flex flex-col gap-6 row-start-2 items-center sm:items-start">
            <div className="flex justify-center flex-auto w-full">
              <h1 className="text-4xl font-black text-center">
                Next.js + SOLAPI 발송 예제
              </h1>
            </div>
            <p className="flex flex-auto justify-center w-full">
              발신번호, 수신번호, 텍스트만 입력해서 문자 발송 테스트를
              진행해보실 수 있습니다!
            </p>
            <div className="w-full">
              <label
                className="block text-gray-700 text-sm mb-2"
                htmlFor="from">
                발신번호 /{' '}
                <b>
                  반드시 사용할 API Key 계정 내 등록된 발신번호를 입력해주세요!
                  예) 15771603
                </b>
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="from"
                type="text"
                name="from"
                placeholder="발신번호"
                required={true}
              />
            </div>
            <div className="w-full">
              <label className="block text-gray-700 text-sm mb-2" htmlFor="to">
                수신번호 /{' '}
                <b>
                  실제 발송 테스트 시, 반드시 올바른 수신번호를 입력해주세요!
                  예) 01012345678
                </b>
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="to"
                type="text"
                name="to"
                placeholder="수신번호"
                required={true}
              />
            </div>
            <div className="w-full">
              <label className="block text-gray-700 text-sm mb-2" htmlFor="to">
                발송내용 /{' '}
                <b>
                  한글 45자, 영자 90자 이하 입력되면 자동으로 SMS 타입의
                  메시지가 발송됩니다, 그 이상을 입력하면 LMS 타입의 메시지가
                  발송됩니다!
                </b>
              </label>
              <textarea
                className="resize-none shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="text"
                name="text"
                draggable={false}
                rows={8}
                inputMode="text"
                placeholder="발송할 문자내용 입력"
                required={true}
              />
            </div>
            <div className="flex flex-auto w-full gap-4 items-center justify-center flex-col sm:flex-row">
              <button
                type="submit"
                className="w-40 rounded-full border cursor-pointer border-solid border-transparent transition-colors flex items-center justify-center bg-[#4541FF] hover:bg-[#0035ef] text-background gap-2 dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5">
                발송하기
              </button>
            </div>
          </Form>
        </main>
      </div>
      <div
        id="toast-default"
        className={`flex items-center w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow-sm dark:text-gray-400 dark:bg-gray-800 fixed top-5 inset-x-0 max-w mx-auto transition-opacity duration-500 ${isSuccess ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        role="alert">
        <div className="inline-flex items-center justify-center shrink-0 w-8 h-8 text-blue-500 bg-blue-100 rounded-lg dark:bg-blue-800 dark:text-blue-200">
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
          </svg>
          <span className="sr-only">Check icon</span>
        </div>
        <div className="ms-3 text-sm font-normal">
          발송 완료되었습니다!
          <br />
          <a
            href="https://console.solapi.com/message-log"
            className="text-sky-500"
            target="_blank"
            rel="noreferrer noopener">
            콘솔
          </a>
          에서 확인해보세요!
        </div>
        <button
          type="button"
          className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700 cursor-pointer"
          data-dismiss-target="#toast-default"
          aria-label="Close"
          onClick={handleCloseEvent}>
          <span className="sr-only">Close</span>
          <svg
            className="w-3 h-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14">
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
        </button>
      </div>
    </>
  );
}
