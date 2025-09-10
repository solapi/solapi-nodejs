import { defineConfig } from 'tsup';

// NODE_ENV 값에 따라 개발(build --watch) / 프로덕션(build) 옵션을 자동 전환합니다.
export default defineConfig(({ watch }) => {
  const isProd = !watch; // watch 모드가 아니면 프로덕션 빌드로 간주
  const enableDebug = process.env.DEBUG === 'true';

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

    // 디버그 모드에서는 minify 비활성화
    minify: isProd && !enableDebug,
    treeshake: isProd && !enableDebug,

    // 디버그 모드이거나 개발 환경에서는 소스맵 생성
    sourcemap: !isProd || enableDebug,

    // 빌드 전 dist 폴더 정리
    clean: true,

    // 외부 실행 환경(Node 단독 실행)에서도 동작하도록 핵심 의존성은 번들에 포함
    // - effect 및 하위 서브패스, date-fns 를 인라인 번들링
    // - Node 내장 모듈(fs, url, crypto 등)은 외부로 유지
    // noExternal: [/^effect\//, 'effect', 'date-fns'],

    // ESM 포맷에서 코드 분할을 비활성화하여 단일 파일 생성 (라이브러리 배포에 유리)
    splitting: false,

    // 환경 변수 정의 - 에러 포맷팅을 위해 중요
    define: {
      'process.env.NODE_ENV': isProd ? '"production"' : '"development"',
      'process.env.EFFECT_DEBUG': enableDebug ? '"true"' : '"false"',
    },

    // 경로 별칭 설정 – 특정 디렉토리용 별칭 정의
    alias: {
      '@models': './src/models',
      '@lib': './src/lib',
      '@internal-types': './src/types',
      '@services': './src/services',
      '@errors': './src/errors',
      // 루트 src 하위 전체를 가리키는 옵션을 추가적으로 원한다면 아래 라인을 유지하세요.
      '@': './src',
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
