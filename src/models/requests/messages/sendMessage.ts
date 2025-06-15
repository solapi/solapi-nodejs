import {z} from 'zod/v4';
import {messageSchema} from '../../base/messages/message';
import {defaultMessageRequestSchema} from './requestConfig';

/**
 * 단건 메시지 발송 요청 모델
 * @description 단건 메시지 발송 요청 모델
 * @example
 * ```ts
 * const message = {
 *  to: '01012345678',
 *  from: '01012345678',
 *  text: 'Hello, world!',
 * };
 * ```
 */
export const requestSendOneMessageSchema = messageSchema
  .refine(data => data.autoTypeDetect !== false || data.type !== undefined, {
    message: 'autoTypeDetect가 false일때 type값은 필수 입력요소 입니다.',
    path: ['type'],
  })
  .refine(
    data => {
      if (data.type === 'NSA') return data.naverOptions !== undefined;
      return true;
    },
    {
      message: 'NSA에서 naverOptions값은 필수 입력요소 입니다.',
      path: ['naverOptions'],
    },
  )
  .refine(
    data => {
      if (data.type && data.type.startsWith('RCS')) {
        return (
          data.rcsOptions !== undefined && data.rcsOptions.brandId !== undefined
        );
      }
      return true;
    },
    {
      message: 'RCS에서 rcsOptions.brandId값은 필수 입력요소 입니다.',
      path: ['rcsOptions', 'brandId'],
    },
  )
  .refine(data => !(data.kakaoOptions && data.naverOptions), {
    message: 'kakaoOptions와 naverOptions는 동시에 사용될 수 없습니다.',
    path: ['kakaoOptions'],
  })
  .refine(
    data => {
      const kakaoHasVariables =
        typeof data.kakaoOptions === 'object' &&
        data.kakaoOptions !== null &&
        'variables' in data.kakaoOptions &&
        data.kakaoOptions.variables !== undefined &&
        Object.keys(data.kakaoOptions.variables as Record<string, unknown>)
          .length > 0;

      const naverHasVariables =
        typeof data.naverOptions === 'object' &&
        data.naverOptions !== null &&
        'variables' in data.naverOptions &&
        data.naverOptions.variables !== undefined &&
        Object.keys(data.naverOptions.variables as Record<string, unknown>)
          .length > 0;

      const hasAltText =
        kakaoHasVariables ||
        data.rcsOptions?.brandId !== undefined ||
        naverHasVariables ||
        (data.faxOptions?.fileIds && data.faxOptions.fileIds.length > 0);

      return Boolean(data.text) || hasAltText;
    },
    {
      message: 'text 필드는 필수 입력요소 입니다.',
      path: ['text'],
    },
  );

/**
 * 메시지 발송 요청 모델
 * @description 메시지 발송 요청 모델
 * @example
 * ```ts
 * const message = {
 *  to: '01012345678',
 *  from: '01012345678',
 *  text: 'Hello, world!',
 * };
 *
 * // 혹은..
 * const messages = [
 *  {
 *    to: '01012345678',
 *    from: '01012345678',
 *    text: 'Hello, world!',
 *  },
 * ];
 * ```
 */
export const requestSendMessageSchema: z.ZodUnion<
  [
    typeof requestSendOneMessageSchema,
    z.ZodArray<typeof requestSendOneMessageSchema>,
  ]
> = z.union([
  requestSendOneMessageSchema,
  z.array(requestSendOneMessageSchema),
]);

export type RequestSendOneMessageSchema = z.infer<
  typeof requestSendOneMessageSchema
>;

export type RequestSendMessagesSchema = z.infer<
  typeof requestSendMessageSchema
>;

export const multipleMessageSendingRequestSchema =
  defaultMessageRequestSchema.extend({
    messages: z.array(requestSendOneMessageSchema),
    scheduledDate: z.union([z.string(), z.date()]).optional(),
    showMessageList: z.boolean().optional(),
  });

export type MultipleMessageSendingRequestSchema = z.infer<
  typeof multipleMessageSendingRequestSchema
>;

export {
  defaultAgentTypeSchema,
  defaultMessageRequestSchema,
} from './requestConfig';

export type {DefaultAgentType} from './requestConfig';
