import {Black, HandleKey} from '../../../types/commonTypes';

export type GetBlacksResponse = {
  startKey: string | null | undefined;
  limit: number;
  nextKey: string | null | undefined;
  blackList: Record<HandleKey, Black>;
};
