import fileToBase64 from '@lib/fileToBase64';
import {
  FileType,
  FileUploadRequest,
} from '@models/requests/messages/groupMessageRequest';
import {FileUploadResponse} from '@models/responses/messageResponses';
import DefaultService from '../defaultService';

export default class StorageService extends DefaultService {
  constructor(apiKey: string, apiSecret: string) {
    super(apiKey, apiSecret);
  }

  /**
   * 파일(이미지) 업로드
   * 카카오 친구톡 이미지는 500kb, MMS는 200kb, 발신번호 서류 인증용 파일은 2mb의 제한이 있음
   * @param filePath 해당 파일의 경로 또는 접근 가능한 이미지 URL
   * @param fileType 저장할 파일의 유형, 예) 카카오 친구톡 용 이미지 -> KAKAO, MMS용 사진 -> MMS, 발신번호 서류 인증에 쓰이는 문서 등 -> DOCUMENT, RCS 이미지 -> RCS
   * @param name 파일 이름
   * @param link 파일 링크, 친구톡의 경우 필수 값
   */
  async uploadFile(
    filePath: string,
    fileType: FileType,
    name?: string,
    link?: string,
  ): Promise<FileUploadResponse> {
    const encodedFile = await fileToBase64(filePath);
    const parameter: FileUploadRequest = {
      file: encodedFile,
      type: fileType,
      name,
      link,
    };
    return this.request<FileUploadRequest, FileUploadResponse>({
      httpMethod: 'POST',
      url: 'storage/v1/files',
      body: parameter,
    });
  }
}
