export interface GetBlockGroupsRequest {
  /**
   * @description 수신 거부 그룹 핸들키
   */
  blockGroupId?: string;

  /**
   * @description 수신 거부 그룹에 등록된 모든 발신번호 적용 여부.
   */
  useAll?: boolean;

  /**
   * @description 수신 거부 그룹에 등록된 발신번호
   */
  senderNumber?: string;

  /**
   * @description 수신 거부 그룹 이름 (부분 검색 가능)
   */
  name?: {like: string} | string;

  /**
   * @description 수신 거부 그룹 활성화 상태
   */
  status?: 'ACTIVE' | 'INACTIVE';

  /**
   * @description 페이지네이션 조회 키
   */
  startKey?: string;

  /**
   * @description 조회 시 제한할 건 수 (기본: 20, 최대: 500)
   */
  limit?: number;
}

export class GetBlockGroupsFinalizeRequest implements GetBlockGroupsRequest {
  blockGroupId?: string;
  useAll?: boolean;
  senderNumber?: string;
  name?: {like: string} | string;
  status?: 'ACTIVE' | 'INACTIVE';
  startKey?: string;
  limit?: number;

  constructor(parameter: GetBlockGroupsRequest) {
    this.blockGroupId = parameter.blockGroupId;
    this.useAll = parameter.useAll;
    this.senderNumber = parameter.senderNumber;
    if (parameter.name != undefined) {
      if (typeof parameter.name == 'string') {
        this.name = {
          like: parameter.name,
        };
      } else {
        this.name = parameter.name;
      }
    }
    this.status = parameter.status;
    this.startKey = parameter.startKey;
    this.limit = parameter.limit;
  }
}
