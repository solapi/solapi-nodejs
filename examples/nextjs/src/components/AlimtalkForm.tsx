'use client';

import {MouseEvent, useEffect, useState} from 'react';
import {
  getKakaoAlimtalkTemplate,
  getKakaoAlimtalkTemplates,
  getKakaoChannels,
  sendAlimtalk,
} from '@/app/actions';
import {type KakaoAlimtalkTemplate, type KakaoChannel} from 'solapi';
import Form from 'next/form';
import getKakaoTemplateVariables from '@/lib/getKakaoTemplateVariables';
import ApiKeyForm from '@/components/ApiKeyForm';
import {useAtom} from 'jotai';
import {apiKeyAtom, apiSecretAtom} from '@/atoms/CommonAtom';

export default function AlimtalkForm() {
  const [channels, setChannels] = useState<Array<KakaoChannel>>([]);
  const [channel, setChannel] = useState<string>('');
  const [templates, setTemplates] = useState<Array<KakaoAlimtalkTemplate>>([]);
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [template, setTemplate] = useState<KakaoAlimtalkTemplate | null>(null);
  const [variables, setVariables] = useState<Array<string>>([]);
  const [apiKey] = useAtom(apiKeyAtom);
  const [apiSecret] = useAtom(apiSecretAtom);

  const handleGetKakaoChannels = (e: MouseEvent<HTMLSelectElement>) => {
    e.preventDefault();
    if (apiKey != '' && apiSecret != '') {
      getKakaoChannels({apiKey, apiSecret}).then(kc => setChannels(kc));
    }
  };

  useEffect(() => {
    if (apiKey != '' && apiSecret != '') {
      getKakaoChannels({apiKey, apiSecret}).then(kc => setChannels(kc));
    }
  }, []);

  useEffect(() => {
    if (channel != '') {
      getKakaoAlimtalkTemplates({apiKey, apiSecret}, channel).then(templates =>
        setTemplates(templates),
      );
    } else {
      setTemplates([]);
    }
  }, [channel]);

  useEffect(() => {
    if (templateId != null) {
      getKakaoAlimtalkTemplate({apiKey, apiSecret}, templateId).then(tpl =>
        setTemplate(tpl),
      );
    } else {
      setTemplate(null);
    }
  }, [templateId]);

  useEffect(() => {
    if (template != null) {
      let tempContent: string;
      tempContent = `${template.content} ${template.emphasizeTitle} ${template.emphasizeSubtitle}`;
      template.buttons?.forEach(btn => {
        tempContent += ` ${btn.linkAnd} ${btn.linkIos} ${btn.linkMo} ${btn.linkPc}`;
      });

      const parsedContent = getKakaoTemplateVariables(tempContent);
      setVariables(parsedContent);
    }
  }, [template]);

  return (
    <Form
      action={sendAlimtalk}
      formMethod="POST"
      className="flex flex-col gap-6 row-start-2 items-center sm:items-start min-w-dvh">
      <p className="flex flex-auto justify-center w-full text-center">
        발신번호, 수신번호를 입력하고 테스트 할 알림톡 템플릿을 선택하여
        알림톡을 발송해보세요! <br />
        발신번호는 알림톡 발송 실패 시 문자로 대체발송 진행할 때 사용됩니다!
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
        <label
          htmlFor="channelId"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          카카오 비즈니스 채널
        </label>
        <select
          id="channelId"
          className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          name="channelId"
          required={true}
          onClick={e => handleGetKakaoChannels(e)}
          onChange={e => setChannel(e.target.value)}>
          <option value="">
            발송할 알림톡 템플릿의 카카오 비즈니스 채널을 선택해주세요!
          </option>
          {channels.map((channel: KakaoChannel) => (
            <option key={channel.channelId} value={channel.channelId}>
              {channel.searchId}
            </option>
          ))}
        </select>
      </div>
      {channel != '' && (
        <div className="w-full">
          <label
            htmlFor="templateId"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            검수가 완료된 카카오 알림톡 템플릿
          </label>
          <select
            id="templateId"
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            name="templateId"
            onChange={e => setTemplateId(e.target.value)}
            required={true}>
            <option value="">
              발송할 알림톡 템플릿의 카카오 비즈니스 채널 템플릿을 선택해주세요!
            </option>
            {templates.length > 0 &&
              templates.map(template => (
                <option key={template.templateId} value={template.templateId}>
                  {template.name}
                </option>
              ))}
          </select>
        </div>
      )}
      {variables.length > 0 && (
        <>
          <h3 className="text-2xl">템플릿에 등록된 치환문구 목록</h3>
          <p className="">
            <b className="font-extrabold text-2xl"># 주의사항 #</b>
            <br />
            등록된 템플릿의 변수 중 링크를 변수화 시켰다면, 템플릿 내용을
            확인해주세요.
            <br />
            http:// 나 https:// 를 변수의 앞에 미리 입력해두었다면, 실제
            치환문구 입력시에는 http:// 혹은 https:// 는 제거되어야 합니다!
          </p>
          <div>
            <h4 className="mb-2 text-xl font-bold">
              템플릿 치환문구 확인용 내용
            </h4>
            <ul>
              {template?.emphasizeTitle && template.emphasizeTitle != '' && (
                <li>강조표기 제목: {template?.emphasizeTitle}</li>
              )}
              {template?.emphasizeSubtitle &&
                template.emphasizeSubtitle != '' && (
                  <li>강조표기 부제목: {template?.emphasizeSubtitle}</li>
                )}
              <li>템플릿 내용: {template?.content}</li>
              {template?.buttons?.map((btn, idx) => (
                <div key={idx}>
                  <h4 className="text-lg font-bold mt-1.5">
                    {btn.buttonName} 버튼의 링크 목록:
                  </h4>
                  <ul>
                    {btn.linkMo && <li>모바일 링크: {btn.linkMo}</li>}
                    {btn.linkPc && <li>PC 링크: {btn.linkPc}</li>}
                    {btn.linkAnd && <li>{btn.linkAnd}</li>}
                    {btn.linkIos && <li>{btn.linkIos}</li>}
                  </ul>
                </div>
              ))}
            </ul>
          </div>
          {variables.map((variable, key) => (
            <div className="w-full" key={key}>
              <div>
                치환문구{key + 1}: {variable}
              </div>
              <div>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="text"
                  name={`#{${variable}}`}
                  placeholder="치환문구 입력"
                  required={true}
                />
              </div>
            </div>
          ))}
        </>
      )}
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
