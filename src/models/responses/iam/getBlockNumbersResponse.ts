import {BlockNumber} from '../../../types/commonTypes';

export type GetBlockNumbersResponse = {
  startKey: string | null | undefined;
  limit: number;
  nextKey: string | null | undefined;
  blockNumbers: BlockNumber[];
};
