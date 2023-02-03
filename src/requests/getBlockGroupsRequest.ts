export interface GetBlockGroupsRequest {
  status?: 'ACTIVE' | 'INACTIVE';
  startKey?: string;
  limit?: number;
}

export class GetBlockGroupsFinalizeRequest implements GetBlockGroupsRequest {
  status?: 'ACTIVE' | 'INACTIVE';
  startKey?: string;
  limit?: number;

  constructor(parameter: GetBlockGroupsRequest) {
    this.status = parameter.status;
    this.startKey = parameter.startKey;
    this.limit = parameter.limit;
  }
}
