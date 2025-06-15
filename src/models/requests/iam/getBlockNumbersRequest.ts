export interface GetBlockNumbersRequest {
  /**
   * @description 수신 차단 그룹 별 수신번호 핸들키
   */
  blockNumberId?: string;

  /**
   * @description 해당 그룹의 발신번호를 차단한 수신번호
   */
  phoneNumber?: string;

  /**
   * @description 수신 차단 그룹 핸들키
   */
  blockGroupId?: string;

  /**
   * @description 수신 차단 그룹 별 수신번호 목록에 대한 메모 (부분 검색 가능)
   */
  memo?: {like: string} | string;

  /**
   * @description 페이지네이션 조회 키
   */
  startKey?: string;

  /**
   * @description 조회 시 제한할 건 수 (기본: 20, 최대: 500)
   */
  limit?: number;
}

export class GetBlockNumbersFinalizeRequest implements GetBlockNumbersRequest {
  blockNumberId?: string;
  phoneNumber?: string;
  blockGroupId?: string;
  memo?: {like: string} | string;
  startKey?: string;
  limit?: number;

  constructor(parameter: GetBlockNumbersRequest) {
    this.blockNumberId = parameter.blockNumberId;
    this.phoneNumber = parameter.phoneNumber;
    this.blockGroupId = parameter.blockGroupId;
    if (parameter.memo != undefined) {
      if (typeof parameter.memo == 'string') {
        this.memo = {
          like: parameter.memo,
        };
      } else {
        this.memo = parameter.memo;
      }
    }
    this.startKey = parameter.startKey;
    this.limit = parameter.limit;
  }
}
