import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {MessageNotReceivedError} from '@/errors/defaultError';
import {DetailGroupMessageResponse} from '@/models/responses/sendManyDetailResponse';
import MessageService from '@/services/messages/messageService';

const fixturePath = join(__dirname, '../../assets/fastSendResponse.json');
const loadFixture = (): DetailGroupMessageResponse =>
  JSON.parse(readFileSync(fixturePath, 'utf-8'));

const jsonResponse = (body: unknown) =>
  new Response(JSON.stringify(body), {
    status: 200,
    headers: {'Content-Type': 'application/json'},
  });

describe('MessageService.send fast intake', () => {
  const fetchMock = vi.fn();
  const service = new MessageService('testApiKey12345', 'testApiSecret12345');
  const message = {to: '01000000000', from: '01000000000', text: '테스트'};

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should POST to messages/v4/send-many/fast', async () => {
    fetchMock.mockResolvedValue(jsonResponse(loadFixture()));

    await service.send(message);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('https://api.solapi.com/messages/v4/send-many/fast');
    expect(init.method).toBe('POST');
    expect(JSON.parse(String(init.body))).toMatchObject({messages: [message]});
  });

  it('should fill deprecated cta/cti charge fields missing from fast response', async () => {
    const fixture = loadFixture();
    expect(fixture.groupInfo.countForCharge).not.toHaveProperty('cta');
    expect(fixture.groupInfo.app.profit).not.toHaveProperty('cti');
    fetchMock.mockResolvedValue(jsonResponse(fixture));

    const result = await service.send(message);

    expect(result.groupInfo.countForCharge.cta).toEqual({});
    expect(result.groupInfo.countForCharge.cti).toEqual({});
    expect(result.groupInfo.app.profit.cta).toBe(0);
    expect(result.groupInfo.app.profit.cti).toBe(0);
    expect(result.groupInfo.isRefunded).toBe(false);
    expect(result.groupInfo.countForCharge.sms).toEqual(
      fixture.groupInfo.countForCharge.sms,
    );
    expect(result.groupInfo.status).toBe('SEND-REQUESTED');
    expect(result.groupInfo.apiVersion).toBe('v4-fast');
    expect(result.messageList).toHaveLength(1);
  });

  it('should keep server-provided cta/cti values untouched', async () => {
    const fixture = loadFixture();
    const withCta = {
      ...fixture,
      groupInfo: {
        ...fixture.groupInfo,
        isRefunded: true,
        countForCharge: {...fixture.groupInfo.countForCharge, cta: {'82': 2}},
        app: {
          ...fixture.groupInfo.app,
          profit: {...fixture.groupInfo.app.profit, cti: 7},
        },
      },
    };
    fetchMock.mockResolvedValue(jsonResponse(withCta));

    const result = await service.send(message);

    expect(result.groupInfo.countForCharge.cta).toEqual({'82': 2});
    expect(result.groupInfo.countForCharge.cti).toEqual({});
    expect(result.groupInfo.app.profit.cti).toBe(7);
    expect(result.groupInfo.app.profit.cta).toBe(0);
    expect(result.groupInfo.isRefunded).toBe(true);
  });

  it('should throw MessageNotReceivedError when every message fails registration', async () => {
    const fixture = loadFixture();
    const allFailed = {
      ...fixture,
      failedMessageList: [
        {
          to: message.to,
          from: message.from,
          type: 'SMS',
          statusMessage: '발신번호 미등록',
          country: '82',
          messageId: 'M4V20260101000000TESTFAIL000000',
          statusCode: '1021',
          accountId: fixture.groupInfo.accountId,
        },
      ],
      groupInfo: {
        ...fixture.groupInfo,
        count: {
          ...fixture.groupInfo.count,
          total: 1,
          registeredFailed: 1,
          registeredSuccess: 0,
        },
      },
    };
    fetchMock.mockResolvedValue(jsonResponse(allFailed));

    await expect(service.send(message)).rejects.toBeInstanceOf(
      MessageNotReceivedError,
    );
  });
});
