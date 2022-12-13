import {formatWithTransfer} from '../../../lib/stringDateTrasnfer';

export interface GetGroupsRequest {
  groupId?: string;
  startKey?: string;
  limit?: number;
  startDate?: string | Date;
  endDate?: string | Date;
}

export class GetGroupsFinalizeRequest implements GetGroupsRequest {
  criteria?: string;
  cond?: string;
  value?: string;
  startKey?: string;
  limit?: number;
  startDate?: string;
  endDate?: string;

  constructor(parameter: GetGroupsRequest) {
    if (parameter.groupId) {
      this.criteria = 'groupId';
      this.cond = 'eq';
      this.value = parameter.groupId;
    }
    this.startKey = parameter.startKey;
    this.limit = parameter.limit;
    if (parameter.startDate) {
      this.startDate = formatWithTransfer(parameter.startDate);
    }
    if (parameter.endDate) {
      this.endDate = formatWithTransfer(parameter.endDate);
    }
  }
}
