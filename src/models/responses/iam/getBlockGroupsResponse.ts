import {BlockGroup} from '../../../types/commonTypes';

export type GetBlockGroupsResponse = {
  startKey: string | null | undefined;
  limit: number;
  nextKey: string | null | undefined;
  blockGroups: BlockGroup[];
};
