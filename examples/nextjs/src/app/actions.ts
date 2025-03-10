'use server';

import '../../envConfig';
import {SolapiMessageService} from 'solapi';
import {redirect} from 'next/navigation';
import {
  alimtalkFormSchema,
  AlimtalkFormType,
  ApiKeysType,
  messageFormSchema,
  MessageFormType,
} from '@/types/types';
import {extractVariablesFields, formDataToObject} from '@/lib/formData';

// 주의!! 실제 발송 연동시에는 오로지 서버에서 api key를 관리해서 MessageService를 호출 하도록 해주세요.
// 본인의 부주의로 인해 Api Key가 유출되어 발생하는 피해는 오로지 개인에게 있습니다!
export async function getApiKeys(): Promise<Array<string | undefined>> {
  return [process.env.SOLAPI_API_KEY, process.env.SOLAPI_API_SECRET];
}

export async function sendMessage(formData: FormData) {
  const rawFormData = {
    apiKey: formData.get('apiKey'),
    apiSecret: formData.get('apiSecret'),
    from: formData.get('from'),
    to: formData.get('to'),
    text: formData.get('text'),
  };

  const {from, to, text, apiKey, apiSecret}: MessageFormType =
    messageFormSchema.parse(rawFormData);

  // 주의!! 실제 발송 연동시에는 오로지 서버에서 api key를 관리해서 MessageService를 호출 하도록 해주세요.
  // 본인의 부주의로 인해 Api Key가 유출되어 발생하는 피해는 오로지 개인에게 있습니다!
  const messageService = new SolapiMessageService(apiKey, apiSecret);
  await messageService.send({from, to, text}).then(console.log);

  redirect('/?success=true');
}

export async function getKakaoChannels({apiKey, apiSecret}: ApiKeysType) {
  const messageService = new SolapiMessageService(apiKey, apiSecret);
  return await messageService
    .getKakaoChannels()
    .then(res => JSON.parse(JSON.stringify(res.channelList)));
}

export async function getKakaoAlimtalkTemplates(
  {apiKey, apiSecret}: ApiKeysType,
  channelId: string,
) {
  const messageService = new SolapiMessageService(apiKey, apiSecret);
  return await messageService
    .getKakaoAlimtalkTemplates({
      channelId,
      status: 'APPROVED',
    })
    .then(res => JSON.parse(JSON.stringify(res.templateList)));
}

export async function getKakaoAlimtalkTemplate(
  {apiKey, apiSecret}: ApiKeysType,
  templateId: string,
) {
  const messageService = new SolapiMessageService(apiKey, apiSecret);
  return await messageService
    .getKakaoAlimtalkTemplate(templateId)
    .then(res => JSON.parse(JSON.stringify(res)));
}

export async function sendAlimtalk(formData: FormData) {
  const data: AlimtalkFormType = formDataToObject(formData);
  alimtalkFormSchema.parse(data);

  const variables = extractVariablesFields(data);

  // 주의!! 실제 발송 연동시에는 오로지 서버에서 api key를 관리해서 MessageService를 호출 하도록 해주세요.
  // 본인의 부주의로 인해 Api Key가 유출되어 발생하는 피해는 오로지 개인에게 있습니다!
  const messageService = new SolapiMessageService(data.apiKey, data.apiSecret);
  await messageService
    .send({
      from: data.from,
      to: data.to,
      kakaoOptions: {
        pfId: data.channelId,
        templateId: data.templateId,
        variables: {
          ...variables,
        },
      },
    })
    .then(console.log);

  redirect('/?success=true');
}
