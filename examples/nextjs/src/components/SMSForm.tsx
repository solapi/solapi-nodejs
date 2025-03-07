'use client';

import Form from 'next/form';
import {sendMessage} from '@/app/actions';
import ApiKeyForm from '@/components/ApiKeyForm';

export default function SMSForm() {
  return (
    <Form
      action={sendMessage}
      formMethod="POST"
      className="flex flex-col gap-6 row-start-2 items-center sm:items-start">
      <p className="flex flex-auto justify-center w-full">
        발신번호, 수신번호, 텍스트만 입력해서 문자 발송 테스트를 진행해보실 수
        있습니다!
      </p>
      <ApiKeyForm />
      <div className="w-full">
        <label className="block text-gray-700 text-sm mb-2" htmlFor="from">
          발신번호 /{' '}
          <b>
            반드시 사용할 API Key 계정 내 등록된 발신번호를 입력해주세요! 예)
            15771603
          </b>
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="from"
          type="tel"
          name="from"
          pattern="^(?:\d{8}|\d{9}|\d{10}|\d{11})$"
          placeholder="발신번호"
          required={true}
        />
      </div>
      <div className="w-full">
        <label className="block text-gray-700 text-sm mb-2" htmlFor="to">
          수신번호 /{' '}
          <b>
            실제 발송 테스트 시, 반드시 올바른 수신번호를 입력해주세요! 예)
            01012345678
          </b>
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="to"
          type="tel"
          name="to"
          pattern="^(?:\d{8}|\d{9}|\d{10}|\d{11})$"
          placeholder="수신번호"
          required={true}
        />
      </div>
      <div className="w-full">
        <label className="block text-gray-700 text-sm mb-2" htmlFor="to">
          발송내용 /{' '}
          <b>
            한글 45자, 영자 90자 이하 입력되면 자동으로 SMS 타입의 메시지가
            발송됩니다, 그 이상을 입력하면 LMS 타입의 메시지가 발송됩니다!
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
  );
}
