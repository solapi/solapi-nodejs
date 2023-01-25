import {
  HandleKey,
  Black,
} from '../types/commonTypes';

export type GetBlacksResponse = {
  startKey: string | null | undefined;
  limit: number;
  nextKey: string | null | undefined;
  blackList: Record<HandleKey, Black>;
};
