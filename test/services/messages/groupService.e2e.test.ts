import {RequestSendOneMessageSchema} from '@models/requests/messages/sendMessage';
import {beforeAll, describe, expect, it} from 'vitest';
import GroupService from '@/services/messages/groupService';
import {retryUntil, retryWithBackoff} from '../../lib/retry-utils';

describe('GroupService E2E', () => {
  let groupService: GroupService;

  beforeAll(() => {
    const apiKey = process.env.API_KEY;
    const apiSecret = process.env.API_SECRET;
    if (!apiKey || !apiSecret) {
      throw new Error('API_KEY and API_SECRET must be provided in .env file');
    }
    groupService = new GroupService(apiKey, apiSecret);
  });

  it('should return groups', async () => {
    // when
    const result = await groupService.getGroups();

    // then
    expect(result).toBeTypeOf('object');
    expect(result.groupList).toBeInstanceOf(Object);
  });

  it('should throw error for non-existent group', async () => {
    // given
    const nonExistentGroupId = 'non-existent-group';

    // when & then
    await expect(groupService.getGroup(nonExistentGroupId)).rejects.toThrow();
  });

  it('should handle the full lifecycle of a group', async () => {
    // 1. Create a group
    const groupId = await groupService.createGroup();
    expect(groupId).toBeTypeOf('string');

    // 2. Add a message to the group
    const message: RequestSendOneMessageSchema = {
      to: '01000000000',
      from: process.env.SENDER_NUMBER ?? '',
      text: 'test message',
    };
    await groupService.addMessagesToGroup(groupId, message);

    // 3. Get the group info (retry to handle eventual consistency)
    const groupInfo = await retryWithBackoff(
      () => groupService.getGroup(groupId),
      {maxRetries: 5, initialDelayMs: 200},
    );
    expect(groupInfo.count.total).toBe(1);

    // 4. Delete the group
    await groupService.removeGroup(groupId);

    // 5. Verify the group is deleted (retry until status becomes DELETED)
    const removedGroupInfo = await retryUntil(
      () => groupService.getGroup(groupId),
      info => info.status === 'DELETED',
      {maxRetries: 10, initialDelayMs: 200},
    );
    expect(removedGroupInfo.status).toBe('DELETED');
  });
});
