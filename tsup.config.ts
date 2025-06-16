import {defineConfig} from 'tsup';

// NODE_ENV 값에 따라 개발(build --watch) / 프로덕션(build) 옵션을 자동 전환합니다.
export default defineConfig(({watch}) => {
  const isProd = !watch; // watch 모드가 아니면 프로덕션 빌드로 간주

  return {
    // 엔트리 포인트
    entry: ['src/index.ts'],

    // 출력 위치를 package.json 의 파일 경로와 동일하게 맞춥니다.
    outDir: 'dist',

    // 모듈 포맷: CJS + ESM 동시 지원
    format: ['cjs', 'esm'],

    // Node 18 LTS 타겟
    target: 'node18',
    platform: 'node',

    // 타입 선언 파일(.d.ts) 생성
    dts: true,

    // 프로덕션 시에만 난독화/트리쉐이킹 활성화
    minify: isProd,
    treeshake: isProd,

    // 개발 편의를 위한 소스맵: 프로덕션 시에는 비활성화하여 파일 용량 절감
    sourcemap: !isProd,

    // 빌드 전 dist 폴더 정리
    clean: true,

    // node_modules 내부 의존성은 번들에서 제외 → SDK 배포 용량 최소화
    skipNodeModulesBundle: true,

    // ESM 포맷에서 코드 분할을 비활성화하여 단일 파일 생성 (라이브러리 배포에 유리)
    splitting: false,

    // 경로 별칭 설정 – 특정 디렉토리용 별칭 정의
    alias: {
      '@models': './src/models',
      '@lib': './src/lib',
      '@internal-types': './src/types',
      '@services': './src/services',
      // 루트 src 하위 전체를 가리키는 옵션을 추가적으로 원한다면 아래 라인을 유지하세요.
      // '@': './src',
    },

    // tsup --watch 시 변경 감지를 무시할 경로
    ignoreWatch: [
      '**/debug/**',
      '**/changelog/**',
      '**/examples/**',
      '**/docs/**',
    ],
  };
});
