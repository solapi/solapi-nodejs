'use server';

import '../../envConfig';
import {BadRequestError, SolapiMessageService} from 'solapi';
import {redirect} from 'next/navigation';

export async function sendMessage(formData: FormData) {
  if (!formData.has('from') || !formData.has('to') || !formData.has('text')) {
    throw new BadRequestError(
      '반드시 발신번호, 수신번호, 메시지 내용을 입력해주세요!',
    );
  }
  const from = formData.get('from') as string;
  const to = formData.get('to') as string;
  const text = formData.get('text') as string;

  const messageService = new SolapiMessageService(
    process.env.SOLAPI_API_KEY!,
    process.env.SOLAPI_API_SECRET!,
  );

  await messageService
    .send({
      from,
      to,
      text,
    })
    .then(console.log);

  redirect('/?success=true');
}
