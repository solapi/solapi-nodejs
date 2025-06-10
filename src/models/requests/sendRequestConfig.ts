/**
 * @name SendRequestConfig
 * @description send 메소드 내 부가적으로 필요한 파라미터 목록
 */
export interface SendRequestConfig {
  /**
   * 예약일시
   */
  scheduledDate?: string | Date;

  /**
   * 중복 수신번호 허용 여부
   * 값 미기입시 중복 수신번호 비허용이 기본값으로 설정됩니다.
   */
  allowDuplicates?: boolean;

  /**
   * 특정 solapi app을 통해 발송 시 넣어줘야 할 app ID 값
   */
  appId?: string;

  /**
   * send 메소드를 통해 발송 시 response에 messageList 값을 표시할 지에 대한 여부
   * 값 미기입시 기본값으로 비표시로 설정됩니다.
   */
  showMessageList?: boolean;
}
