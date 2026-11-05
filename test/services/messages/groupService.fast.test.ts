import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import GroupService from '@/services/messages/groupService';

const fixturePath = join(__dirname, '../../assets/fastGroup.json');
const listFixturePath = join(__dirname, '../../assets/fastGroupMessages.json');
const loadGroup = (): Record<string, unknown> =>
  JSON.parse(readFileSync(fixturePath, 'utf-8'));
const loadGroupMessages = (): Record<string, unknown> =>
  JSON.parse(readFileSync(listFixturePath, 'utf-8'));

const jsonResponse = (body: unknown) =>
  new Response(JSON.stringify(body), {
    status: 200,
    headers: {'Content-Type': 'application/json'},
  });

describe('GroupService fast intake group decoding', () => {
  const fetchMock = vi.fn();
  const service = new GroupService('testApiKey12345', 'testApiSecret12345');

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('getGroup should decode a v4-fast group lacking cta/cti keys', async () => {
    const group = loadGroup();
    fetchMock.mockResolvedValue(jsonResponse(group));

    const result = await service.getGroup(group.groupId as string);

    expect(fetchMock.mock.calls[0]?.[0]).toBe(
      `https://api.solapi.com/messages/v4/groups/fast/${group.groupId}`,
    );
    expect(result.groupId).toBe(group.groupId);
    expect(result.countForCharge.cta).toEqual({});
    expect(result.countForCharge.cti).toEqual({});
    expect(result.app.profit.cta).toBe(0);
    expect(result.app.profit.cti).toBe(0);
    expect(result.app.profit.sms).toBe(
      (group.app as {profit: {sms: number}}).profit.sms,
    );
  });

  it('getGroups should decode a list containing a v4-fast group', async () => {
    const group = loadGroup();
    fetchMock.mockResolvedValue(
      jsonResponse({
        startKey: null,
        nextKey: null,
        limit: 20,
        groupList: {[group.groupId as string]: group},
      }),
    );

    const result = await service.getGroups({groupId: group.groupId as string});

    const decoded = result.groupList[group.groupId as string];
    expect(decoded.countForCharge.cta).toEqual({});
    expect(decoded.app.profit.cti).toBe(0);
  });

  it('getGroupMessages should read the fast list route and decode the page', async () => {
    const page = loadGroupMessages();
    fetchMock.mockResolvedValue(jsonResponse(page));
    const groupId = 'G4V202611051534087P91669DDW55VZ6';

    const result = await service.getGroupMessages(groupId, {limit: 2});

    expect(fetchMock.mock.calls[0]?.[0]).toBe(
      `https://api.solapi.com/messages/v4/groups/fast/${groupId}/messages?limit=2`,
    );
    expect(result.limit).toBe(2);
    expect(result.nextKey).toBe(page.nextKey);
    expect(Object.keys(result.messageList)).toEqual(
      Object.keys(page.messageList as object),
    );
  });

  it('getGroup should keep cta/cti values when the server returns them', async () => {
    const group = loadGroup();
    const legacy = {
      ...group,
      countForCharge: {
        ...(group.countForCharge as object),
        cta: {'82': 3},
        cti: {},
      },
      app: {
        ...(group.app as object),
        profit: {...(group.app as {profit: object}).profit, cta: 5, cti: 0},
      },
    };
    fetchMock.mockResolvedValue(jsonResponse(legacy));

    const result = await service.getGroup(group.groupId as string);

    expect(result.countForCharge.cta).toEqual({'82': 3});
    expect(result.app.profit.cta).toBe(5);
  });
});
