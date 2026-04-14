import CashService from '@services/cash/cashService';
import IamService from '@services/iam/iamService';
import KakaoChannelService from '@services/kakao/channels/kakaoChannelService';
import KakaoTemplateService from '@services/kakao/templates/kakaoTemplateService';
import GroupService from '@services/messages/groupService';
import MessageService from '@services/messages/messageService';
import StorageService from '@services/storage/storageService';
import {ApiKeyError} from './errors/defaultError';

// Errors
export * from './errors/defaultError';
// Models (base types, request types, response types, schemas)
export * from './models/index';
// Common Types & Schemas
export * from './types/index';

/**
 * SOLAPI 메시지 서비스
 * 발송 및 조회 등 SOLAPI에서 제공되는 여러 API의 기능을 쉽게 사용할 수 있습니다.
 * SOLAPI 자체의 서비스에 관한 사항은 SOLAPI 홈페이지를 참고해주세요.
 * @see https://solapi.github.io/solapi-nodejs
 * @see https://developers.solapi.com/category/nodejs
 */
export class SolapiMessageService {
  // CashService 위임
  /**
   * 잔액조회
   * @returns GetBalanceResponse
   */
  readonly getBalance: typeof CashService.prototype.getBalance;

  // IamService 위임
  /**
   * 080 수신 거부 조회
   * @param data 080 수신 거부 상세 조회용 request 데이터
   * @returns GetBlacksResponse
   */
  readonly getBlacks: typeof IamService.prototype.getBlacks;

  /**
   * 수신 거부 그룹 조회
   * @param data 수신 거부 그룹 조회용 request 데이터
   * @returns GetBlockGroupsResponse
   */
  readonly getBlockGroups: typeof IamService.prototype.getBlockGroups;

  /**
   * 수신 거부 번호 조회
   * @param data 수신 거부 번호 상세 조회용 request 데이터
   * @returns GetBlockNumbersResponse
   */
  readonly getBlockNumbers: typeof IamService.prototype.getBlockNumbers;

  // KakaoChannelService 위임
  /**
   * 카카오 채널 카테고리 조회
   */
  readonly getKakaoChannelCategories: typeof KakaoChannelService.prototype.getKakaoChannelCategories;

  /**
   * 카카오 채널 목록 조회
   * @param data 카카오 채널 목록을 더 자세하게 조회할 때 필요한 파라미터
   */
  readonly getKakaoChannels: typeof KakaoChannelService.prototype.getKakaoChannels;

  /**
   * @description 카카오 채널 조회
   * @param channelId 카카오 채널 ID(구 pfId)
   */
  readonly getKakaoChannel: typeof KakaoChannelService.prototype.getKakaoChannel;

  /**
   * @description 카카오 채널 연동을 위한 인증 토큰 요청
   */
  readonly requestKakaoChannelToken: typeof KakaoChannelService.prototype.requestKakaoChannelToken;

  /**
   * @description 카카오 채널 연동 메소드
   * getKakaoChannelCategories, requestKakaoChannelToken 메소드를 선행적으로 호출해야 합니다!
   */
  readonly createKakaoChannel: typeof KakaoChannelService.prototype.createKakaoChannel;

  /**
   * @description 카카오 채널 삭제, 채널이 삭제 될 경우 해당 채널의 템플릿이 모두 삭제됩니다!
   * @param channelId 카카오 채널 ID
   */
  readonly removeKakaoChannel: typeof KakaoChannelService.prototype.removeKakaoChannel;

  // KakaoTemplateService 위임
  /**
   * 카카오 템플릿 카테고리 조회
   */
  readonly getKakaoAlimtalkTemplateCategories: typeof KakaoTemplateService.prototype.getKakaoAlimtalkTemplateCategories;

  /**
   * @description 카카오 알림톡 템플릿 생성
   * 반드시 getKakaoAlimtalkTemplateCategories를 먼저 호출하여 카테고리 값을 확인해야 합니다!
   * @param data 알림톡 템플릿 생성을 위한 파라미터
   */
  readonly createKakaoAlimtalkTemplate: typeof KakaoTemplateService.prototype.createKakaoAlimtalkTemplate;

  /**
   * 카카오 템플릿 목록 조회
   * @param data 카카오 템플릿 목록을 더 자세하게 조회할 때 필요한 파라미터
   */
  readonly getKakaoAlimtalkTemplates: typeof KakaoTemplateService.prototype.getKakaoAlimtalkTemplates;

  /**
   * 카카오 템플릿 상세 조회
   * @param templateId 카카오 알림톡 템플릿 ID
   */
  readonly getKakaoAlimtalkTemplate: typeof KakaoTemplateService.prototype.getKakaoAlimtalkTemplate;

  /**
   * 카카오 알림톡 템플릿 검수 취소 요청
   * @param templateId 카카오 알림톡 템플릿 ID
   */
  readonly cancelInspectionKakaoAlimtalkTemplate: typeof KakaoTemplateService.prototype.cancelInspectionKakaoAlimtalkTemplate;

  /**
   * 카카오 알림톡 템플릿 수정(검수 X)
   * @param templateId 카카오 알림톡 템플릿 ID
   * @param data 카카오 알림톡 템플릿 수정을 위한 파라미터
   */
  readonly updateKakaoAlimtalkTemplate: typeof KakaoTemplateService.prototype.updateKakaoAlimtalkTemplate;

  /**
   * 카카오 알림톡 템플릿 이름 수정(검수 상태 상관없이 변경가능)
   * @param templateId 카카오 알림톡 템플릿 ID
   * @param name 카카오 알림톡 템플릿 이름 변경을 위한 파라미터
   */
  readonly updateKakaoAlimtalkTemplateName: typeof KakaoTemplateService.prototype.updateKakaoAlimtalkTemplateName;

  /**
   * 카카오 알림톡 템플릿 삭제(대기, 반려 상태일 때만 삭제가능)
   * @param templateId 카카오 알림톡 템플릿 ID
   */
  readonly removeKakaoAlimtalkTemplate: typeof KakaoTemplateService.prototype.removeKakaoAlimtalkTemplate;

  // GroupService 위임
  /**
   * 그룹 생성
   * @param allowDuplicates 생성할 그룹이 중복 수신번호를 허용하는지 여부를 확인합니다.
   * @param appId 생성할 그룹에 특정 appId를 넣을 수 있습니다.
   * @param customFields 생성할 그룹에 사용자 정의 데이터를 Record 형태로 삽입할 수 있습니다.
   */
  readonly createGroup: typeof GroupService.prototype.createGroup;

  /**
   * 그룹 메시지 추가
   * 한번 요청으로 최대 10,000건의 메시지를 추가할 수 있습니다.
   * 추가 가능한 최대 메시지 건 수는 1,000,000건 입니다.
   * @param groupId 생성 된 Group ID
   * @param messages 여러 메시지(문자, 알림톡 등)
   */
  readonly addMessagesToGroup: typeof GroupService.prototype.addMessagesToGroup;

  /**
   * 그룹 메시지 전송 요청
   * @param groupId 생성 된 Group ID
   */
  readonly sendGroup: typeof GroupService.prototype.sendGroup;

  /**
   * 그룹 예약 발송 설정
   * @param groupId 생성 된 Group ID
   * @param scheduledDate 예약발송 할 날짜
   */
  readonly reserveGroup: typeof GroupService.prototype.reserveGroup;

  /**
   * 그룹 내 예약 발송 취소(메시지 실패 전체 처리 됨)
   * @param groupId 생성 된 Group ID
   */
  readonly removeReservationToGroup: typeof GroupService.prototype.removeReservationToGroup;

  /**
   * 그룹 목록 정보 조회
   * @param data 그룹 정보 상세 조회용 request 데이터
   */
  readonly getGroups: typeof GroupService.prototype.getGroups;

  /**
   * 단일 그룹정보 조회
   * @param groupId 그룹 ID
   */
  readonly getGroup: typeof GroupService.prototype.getGroup;

  /**
   * 그룹 내 메시지 목록 조회
   * @param groupId 생성 된 Group ID
   * @param data startkey, limit 등 쿼리 조건 파라미터
   */
  readonly getGroupMessages: typeof GroupService.prototype.getGroupMessages;

  /**
   * 그룹 내 특정 메시지 삭제
   * @param groupId 생성 된 Group Id
   * @param messageIds 생성 된 메시지 ID 목록
   */
  readonly removeGroupMessages: typeof GroupService.prototype.removeGroupMessages;

  /**
   * 그룹 삭제
   * @param groupId
   */
  readonly removeGroup: typeof GroupService.prototype.removeGroup;

  // MessageService 위임
  /**
   * 메시지 발송 기능, sendMany 함수보다 개선된 오류 표시 기능등을 제공합니다.
   * 한번의 요청으로 최대 10,000건까지 발송할 수 있습니다.
   * @param messages 발송 요청할 메시지 파라미터(문자, 알림톡 등)
   * @param requestConfigParameter request시 필요한 파라미터 오브젝트
   * @throws MessageNotReceivedError 모든 메시지 접수건이 실패건으로 진행되는 경우 반환되는 에러
   * @throws BadRequestError 잘못된 파라미터를 기입했거나, 데이터가 아예 없는 경우 반환되는 에러
   */
  readonly send: typeof MessageService.prototype.send;

  /**
   * 메시지 목록 조회
   * @param data 목록 조회 상세조건 파라미터
   */
  readonly getMessages: typeof MessageService.prototype.getMessages;

  /**
   * 통계 조회
   * @param data 통계 상세 조건 파라미터
   * @returns GetStatisticsResponse 통계 결과
   */
  readonly getStatistics: typeof MessageService.prototype.getStatistics;

  // StorageService 위임
  /**
   * 파일(이미지) 업로드
   * 카카오 친구톡 이미지는 500kb, MMS는 200kb, 발신번호 서류 인증용 파일은 2mb의 제한이 있음
   * @param filePath 해당 파일의 경로 또는 접근 가능한 이미지 URL
   * @param fileType 저장할 파일의 유형, 예) 카카오 친구톡 용 이미지 -> KAKAO, MMS용 사진 -> MMS, 발신번호 서류 인증에 쓰이는 문서 등 -> DOCUMENT, RCS 이미지 -> RCS
   * @param name 파일 이름
   * @param link 파일 링크, 친구톡의 경우 필수 값
   */
  readonly uploadFile: typeof StorageService.prototype.uploadFile;

  constructor(apiKey: string, apiSecret: string) {
    if (!apiKey || !apiSecret) {
      throw new ApiKeyError({
        message: 'API Key와 API Secret은 필수입니다.',
      });
    }

    const cashService = new CashService(apiKey, apiSecret);
    const iamService = new IamService(apiKey, apiSecret);
    const kakaoChannelService = new KakaoChannelService(apiKey, apiSecret);
    const kakaoTemplateService = new KakaoTemplateService(apiKey, apiSecret);
    const groupService = new GroupService(apiKey, apiSecret);
    const messageService = new MessageService(apiKey, apiSecret);
    const storageService = new StorageService(apiKey, apiSecret);

    // CashService
    this.getBalance = cashService.getBalance.bind(cashService);

    // IamService
    this.getBlacks = iamService.getBlacks.bind(iamService);
    this.getBlockGroups = iamService.getBlockGroups.bind(iamService);
    this.getBlockNumbers = iamService.getBlockNumbers.bind(iamService);

    // KakaoChannelService
    this.getKakaoChannelCategories =
      kakaoChannelService.getKakaoChannelCategories.bind(kakaoChannelService);
    this.getKakaoChannels =
      kakaoChannelService.getKakaoChannels.bind(kakaoChannelService);
    this.getKakaoChannel =
      kakaoChannelService.getKakaoChannel.bind(kakaoChannelService);
    this.requestKakaoChannelToken =
      kakaoChannelService.requestKakaoChannelToken.bind(kakaoChannelService);
    this.createKakaoChannel =
      kakaoChannelService.createKakaoChannel.bind(kakaoChannelService);
    this.removeKakaoChannel =
      kakaoChannelService.removeKakaoChannel.bind(kakaoChannelService);

    // KakaoTemplateService
    this.getKakaoAlimtalkTemplateCategories =
      kakaoTemplateService.getKakaoAlimtalkTemplateCategories.bind(
        kakaoTemplateService,
      );
    this.createKakaoAlimtalkTemplate =
      kakaoTemplateService.createKakaoAlimtalkTemplate.bind(
        kakaoTemplateService,
      );
    this.getKakaoAlimtalkTemplates =
      kakaoTemplateService.getKakaoAlimtalkTemplates.bind(kakaoTemplateService);
    this.getKakaoAlimtalkTemplate =
      kakaoTemplateService.getKakaoAlimtalkTemplate.bind(kakaoTemplateService);
    this.cancelInspectionKakaoAlimtalkTemplate =
      kakaoTemplateService.cancelInspectionKakaoAlimtalkTemplate.bind(
        kakaoTemplateService,
      );
    this.updateKakaoAlimtalkTemplate =
      kakaoTemplateService.updateKakaoAlimtalkTemplate.bind(
        kakaoTemplateService,
      );
    this.updateKakaoAlimtalkTemplateName =
      kakaoTemplateService.updateKakaoAlimtalkTemplateName.bind(
        kakaoTemplateService,
      );
    this.removeKakaoAlimtalkTemplate =
      kakaoTemplateService.removeKakaoAlimtalkTemplate.bind(
        kakaoTemplateService,
      );

    // GroupService
    this.createGroup = groupService.createGroup.bind(groupService);
    this.addMessagesToGroup =
      groupService.addMessagesToGroup.bind(groupService);
    this.sendGroup = groupService.sendGroup.bind(groupService);
    this.reserveGroup = groupService.reserveGroup.bind(groupService);
    this.removeReservationToGroup =
      groupService.removeReservationToGroup.bind(groupService);
    this.getGroups = groupService.getGroups.bind(groupService);
    this.getGroup = groupService.getGroup.bind(groupService);
    this.getGroupMessages = groupService.getGroupMessages.bind(groupService);
    this.removeGroupMessages =
      groupService.removeGroupMessages.bind(groupService);
    this.removeGroup = groupService.removeGroup.bind(groupService);

    // MessageService
    this.send = messageService.send.bind(messageService);
    this.getMessages = messageService.getMessages.bind(messageService);
    this.getStatistics = messageService.getStatistics.bind(messageService);

    // StorageService
    this.uploadFile = storageService.uploadFile.bind(storageService);
  }
}
