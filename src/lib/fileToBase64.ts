import {promises as fs} from 'node:fs';
import {URL} from 'node:url';

/**
 * URL에서 파일을 가져와 Base64로 인코딩합니다.
 * @param url 파일 URL
 * @returns Base64로 인코딩된 문자열
 */
async function fromUrl(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `URL에서 이미지를 가져오는데 실패했습니다: ${url}, 상태: ${response.status}`,
    );
  }
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return buffer.toString('base64');
}

/**
 * 로컬 경로에서 파일을 읽어 Base64로 인코딩합니다.
 * @param path 파일 경로
 * @returns Base64로 인코딩된 문자열
 */
async function fromPath(path: string): Promise<string> {
  const buffer = await fs.readFile(path);
  return buffer.toString('base64');
}

/**
 * 주어진 경로(URL 또는 로컬 경로)의 파일을 Base64 문자열로 변환합니다.
 * @param path 파일의 로컬 경로 또는 접근 가능한 URL
 * @returns Base64로 인코딩된 파일 문자열
 */
export default async function fileToBase64(path: string): Promise<string> {
  try {
    new URL(path);
    return fromUrl(path);
  } catch (error) {
    // URL 생성에 실패하면 로컬 파일 경로로 간주합니다.
    console.log('URL parsing error', error);
    return fromPath(path);
  }
}
