'use client';

import {useRouter} from 'next/navigation';

export default function Toast({isSuccess}: {isSuccess: boolean}) {
  const router = useRouter();
  const handleCloseEvent = async () => {
    router.replace('/');
  };

  return (
    <div
      id="toast-default"
      className={`flex items-center w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow-sm dark:text-gray-400 dark:bg-gray-800 fixed top-5 inset-x-0 max-w mx-auto transition-opacity duration-500 ${isSuccess ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      role="alert"
    >
      <div className="inline-flex items-center justify-center shrink-0 w-8 h-8 text-blue-500 bg-blue-100 rounded-lg dark:bg-blue-800 dark:text-blue-200">
        <svg
          className="w-5 h-5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
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
          rel="noreferrer noopener"
        >
          콘솔
        </a>
        에서 확인해보세요!
      </div>
      <button
        type="button"
        className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700 cursor-pointer"
        data-dismiss-target="#toast-default"
        aria-label="Close"
        onClick={handleCloseEvent}
      >
        <span className="sr-only">Close</span>
        <svg
          className="w-3 h-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 14"
        >
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
  );
}
