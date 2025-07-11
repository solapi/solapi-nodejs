import {KakaoAlimtalkTemplateSchema} from '@/models/base/kakao/kakaoAlimtalkTemplate';

/**
 * 카카오 템플릿 변수명에 따른 랜덤 값 생성 함수
 */
export const generateRandomValueForVariable = (
  variableName: string,
): string => {
  const name = variableName.toLowerCase();

  // 변수명에 따른 적절한 더미 데이터 생성
  if (
    name.includes('이름') ||
    name.includes('name') ||
    name.includes('고객명')
  ) {
    const names = ['김철수', '이영희', '박민수', '정수진', '최영호'];
    return names[Math.floor(Math.random() * names.length)];
  }

  if (name.includes('날짜') || name.includes('date') || name.includes('일자')) {
    const today = new Date();
    today.setDate(today.getDate() + Math.floor(Math.random() * 30));
    return today.toLocaleDateString('ko-KR');
  }

  if (name.includes('시간') || name.includes('time')) {
    const hour = Math.floor(Math.random() * 24);
    const minute = Math.floor(Math.random() * 60);
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  }

  if (
    name.includes('금액') ||
    name.includes('price') ||
    name.includes('amount')
  ) {
    const amount = Math.floor(Math.random() * 1000000) + 1000;
    return amount.toLocaleString('ko-KR') + '원';
  }

  if (name.includes('번호') || name.includes('number') || name.includes('no')) {
    return Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');
  }

  if (
    name.includes('등급') ||
    name.includes('grade') ||
    name.includes('level')
  ) {
    const grades = [
      '일반',
      '우수',
      'VIP',
      'VVIP',
      'Bronze',
      'Silver',
      'Gold',
      'Platinum',
    ];
    return grades[Math.floor(Math.random() * grades.length)];
  }

  if (
    name.includes('장소') ||
    name.includes('여행지') ||
    name.includes('location')
  ) {
    const places = [
      '서울',
      '부산',
      '제주도',
      '강릉',
      '경주',
      '전주',
      '대전',
      '광주',
    ];
    return places[Math.floor(Math.random() * places.length)];
  }

  // 기본값: 랜덤 문자열
  const defaultValues = [
    '테스트값',
    '샘플데이터',
    '예시내용',
    'Sample',
    'Test',
  ];
  return defaultValues[Math.floor(Math.random() * defaultValues.length)];
};

/**
 * 카카오 알림톡 템플릿의 variables 배열에서 변수명을 추출하여
 * 랜덤 값으로 채워진 변수 객체를 생성합니다.
 */
export const generateTemplateVariables = (
  template: KakaoAlimtalkTemplateSchema,
): Record<string, string> => {
  if (!template.variables || template.variables.length === 0) {
    return {};
  }

  return template.variables.reduce(
    (acc, variable) => {
      acc[variable.name] = generateRandomValueForVariable(variable.name);
      return acc;
    },
    {} as Record<string, string>,
  );
};
