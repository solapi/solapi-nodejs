# Changelog

## [6.0.0](https://github.com/solapi/solapi-nodejs/compare/solapi-v5.5.4...solapi-v6.0.0) (2026-04-20)


### ⚠ BREAKING CHANGES

* 전체 API를 Effect 라이브러리 기반으로 마이그레이션

### Features

* Add support for custom fields in group creation ([0adb356](https://github.com/solapi/solapi-nodejs/commit/0adb3566ee47ca06ed6da40fa54dbe98e8fc4c0f))
* **bms:** add client-side pre-validation for BMS options ([c0ace11](https://github.com/solapi/solapi-nodejs/commit/c0ace118274fbcfbbc4875d300de91cca703e726))
* **bms:** BMS 옵션 사전 검증 추가 (cherry-pick from master) ([0cb9a9c](https://github.com/solapi/solapi-nodejs/commit/0cb9a9c9ad10e2ae03e628109f82e10e202631a0))
* **bms:** Enhance error handling and add BMS message types ([4274811](https://github.com/solapi/solapi-nodejs/commit/427481119d8c369de11b066c4d885a4067409bd6))
* **bms:** Implement validation for WIDE_ITEM_LIST and enhance commerce pricing rules ([dc1d572](https://github.com/solapi/solapi-nodejs/commit/dc1d572e5524b1777802b64b472ceca4d88b7c8d))
* **bms:** Update BMS Free Message E2E tests with new discount features ([d3174ed](https://github.com/solapi/solapi-nodejs/commit/d3174ed17de1c4235f9b97770dda900b758beaf8))
* **docs:** Add comprehensive documentation for AGENTS architecture ([cce726e](https://github.com/solapi/solapi-nodejs/commit/cce726e65e40256f9182db62c0f3568c517ec3a0))
* enhance error handling documentation and improve kakao template service e2e tests ([1b098fd](https://github.com/solapi/solapi-nodejs/commit/1b098fdf5cc14f9caaef7b42f6e201c6d8e26131))
* **errors:** Introduce ClientError and ServerError classes ([abebea3](https://github.com/solapi/solapi-nodejs/commit/abebea3400c92483b0b1ad0bf488fb49da4ebc0d))
* export all types/schemas and migrate to Effect ([e23dc93](https://github.com/solapi/solapi-nodejs/commit/e23dc93700b9aebdc52fdadad1feba5b18702cfa))
* **kakao:** BMS(브랜드 메시지 서비스) 타입 및 스키마 추가 ([e2a2381](https://github.com/solapi/solapi-nodejs/commit/e2a2381ccb48e60ecbc87f1e934867f724fed513))
* **responses:** sync query API schemas and add runtime validation ([7d2979c](https://github.com/solapi/solapi-nodejs/commit/7d2979ce2e1f8db02df3cc960f060dadbb2b28dc))


### Bug Fixes

* beta manifest 버전을 현재 stable 버전(5.5.4)으로 수정 ([00943e6](https://github.com/solapi/solapi-nodejs/commit/00943e610df93296f73408742240752b716ec8b0))
* beta 설정에서 bootstrap-sha 제거 ([c94a3cc](https://github.com/solapi/solapi-nodejs/commit/c94a3ccef58efffeaeb5744bc2297dc2f5a4f1fe))
* **bms:** close empty-string/malformed URL silent pass paths ([7dc0d1f](https://github.com/solapi/solapi-nodejs/commit/7dc0d1f2023e191919737593e404df933cdafc79))
* **bms:** close present-but-empty gap on carousel.head and AL buttons ([a73b336](https://github.com/solapi/solapi-nodejs/commit/a73b3368913f793a53738854a54b5e607eac364d))
* **bms:** Update test cases for WIDE_ITEM_LIST type ([9df35df](https://github.com/solapi/solapi-nodejs/commit/9df35df87d319a2ede88ae61842342489379eb63))
* CI에서 사용하는 lint:ci, test:ci 스크립트 추가 ([209a78f](https://github.com/solapi/solapi-nodejs/commit/209a78f407e6cee95327bea0de8db9ec5de04382))
* **errors:** redact all PII channels (validationErrors/url) in production ([300d9eb](https://github.com/solapi/solapi-nodejs/commit/300d9eb0206a5129f2efb24c605c92e96b30afb8))
* **errors:** redact responseBody in production ResponseSchemaMismatchError ([ff37fe5](https://github.com/solapi/solapi-nodejs/commit/ff37fe5f8f490894fb55a21d8a2b7e0e26fd0be7))
* **errors:** safe-by-default redact gate; strip url fragment ([0af8ead](https://github.com/solapi/solapi-nodejs/commit/0af8eada25f44ff390d35ee831b996c8254d6e72))
* handleClientErrorResponse에 동일한 null/비정형 JSON 방어 적용 ([e33df23](https://github.com/solapi/solapi-nodejs/commit/e33df239765a443ef094543c718977d2818e1a33))
* handleServerErrorResponse null JSON 방어 및 코드 간결화 ([6e149ef](https://github.com/solapi/solapi-nodejs/commit/6e149efd6377a156c2b16d092701bb7ddf3c9530))
* Kakao 스키마 타입 정의 수정 (알림톡 템플릿 code nullable, 앱버튼 링크 필수) ([3af2c74](https://github.com/solapi/solapi-nodejs/commit/3af2c74a65b0d34cbf03d04cd4e4c27de7f4523f))
* **responses:** accept new message types in countForCharge; null feature fields ([d268c5e](https://github.com/solapi/solapi-nodejs/commit/d268c5e813bfd89dd196ffe72e10ee128b1db6d7))
* **responses:** allow nullish startKey in kakao list responses ([61247e5](https://github.com/solapi/solapi-nodejs/commit/61247e506d3c10f7259eeb1baf7561fd318951ff))
* **responses:** sync query API schemas and add runtime response validation ([4e4317b](https://github.com/solapi/solapi-nodejs/commit/4e4317bf1d738072a45b3af741561be69b937b3e))
* restore default message schema export ([e8d5e9c](https://github.com/solapi/solapi-nodejs/commit/e8d5e9cd3c83520aff5299889bb67d615bbc402c))
* **statistics:** keep dayPeriod.statusCode typed via partial MessageTypeRecord ([28c912c](https://github.com/solapi/solapi-nodejs/commit/28c912cdf1c54ed6a8fe2d43d83350991ecf48c4))
* 리뷰 피드백 반영 — isErrorResponse 강화, 에러 처리 일관성, examples 업데이트 ([0d9d7b4](https://github.com/solapi/solapi-nodejs/commit/0d9d7b45184f8cd81474f19b1e72beb5b9d63bfd))
* 리뷰 피드백 반영 — 문서 업데이트, 테스트 보강 ([233bb6b](https://github.com/solapi/solapi-nodejs/commit/233bb6b1984b9f8f0f16551148b6015e2a8d1724))
* 리뷰 피드백 반영 — 주석 누락 제거 및 sendRequestConfigSchema 테스트 추가 ([3635405](https://github.com/solapi/solapi-nodejs/commit/36354052621e6246906b4c17510c1f620f531ef8))
* 테스트에 expect.assertions() 추가로 false-green 방지 ([1f3fc8a](https://github.com/solapi/solapi-nodejs/commit/1f3fc8aa45a722998c8b4d8de9dc08ce9042b624))

## [6.0.0-beta.4](https://github.com/solapi/solapi-nodejs/compare/solapi-v6.0.0-beta.3...solapi-v6.0.0-beta.4) (2026-04-20)


### Features

* **bms:** add client-side pre-validation for BMS options ([c0ace11](https://github.com/solapi/solapi-nodejs/commit/c0ace118274fbcfbbc4875d300de91cca703e726))
* **bms:** BMS 옵션 사전 검증 추가 (cherry-pick from master) ([0cb9a9c](https://github.com/solapi/solapi-nodejs/commit/0cb9a9c9ad10e2ae03e628109f82e10e202631a0))


### Bug Fixes

* **bms:** close empty-string/malformed URL silent pass paths ([7dc0d1f](https://github.com/solapi/solapi-nodejs/commit/7dc0d1f2023e191919737593e404df933cdafc79))
* **bms:** close present-but-empty gap on carousel.head and AL buttons ([a73b336](https://github.com/solapi/solapi-nodejs/commit/a73b3368913f793a53738854a54b5e607eac364d))

## [6.0.0-beta.3](https://github.com/solapi/solapi-nodejs/compare/solapi-v6.0.0-beta.2...solapi-v6.0.0-beta.3) (2026-04-17)


### Features

* **responses:** sync query API schemas and add runtime validation ([7d2979c](https://github.com/solapi/solapi-nodejs/commit/7d2979ce2e1f8db02df3cc960f060dadbb2b28dc))


### Bug Fixes

* **errors:** redact all PII channels (validationErrors/url) in production ([300d9eb](https://github.com/solapi/solapi-nodejs/commit/300d9eb0206a5129f2efb24c605c92e96b30afb8))
* **errors:** redact responseBody in production ResponseSchemaMismatchError ([ff37fe5](https://github.com/solapi/solapi-nodejs/commit/ff37fe5f8f490894fb55a21d8a2b7e0e26fd0be7))
* **errors:** safe-by-default redact gate; strip url fragment ([0af8ead](https://github.com/solapi/solapi-nodejs/commit/0af8eada25f44ff390d35ee831b996c8254d6e72))
* **responses:** accept new message types in countForCharge; null feature fields ([d268c5e](https://github.com/solapi/solapi-nodejs/commit/d268c5e813bfd89dd196ffe72e10ee128b1db6d7))
* **responses:** allow nullish startKey in kakao list responses ([61247e5](https://github.com/solapi/solapi-nodejs/commit/61247e506d3c10f7259eeb1baf7561fd318951ff))
* **responses:** sync query API schemas and add runtime response validation ([4e4317b](https://github.com/solapi/solapi-nodejs/commit/4e4317bf1d738072a45b3af741561be69b937b3e))
* **statistics:** keep dayPeriod.statusCode typed via partial MessageTypeRecord ([28c912c](https://github.com/solapi/solapi-nodejs/commit/28c912cdf1c54ed6a8fe2d43d83350991ecf48c4))

## [6.0.0-beta.2](https://github.com/solapi/solapi-nodejs/compare/solapi-v6.0.0-beta.1...solapi-v6.0.0-beta.2) (2026-04-16)


### ⚠ BREAKING CHANGES

* 전체 API를 Effect 라이브러리 기반으로 마이그레이션

### Features

* Add support for custom fields in group creation ([0adb356](https://github.com/solapi/solapi-nodejs/commit/0adb3566ee47ca06ed6da40fa54dbe98e8fc4c0f))
* **bms:** Enhance error handling and add BMS message types ([4274811](https://github.com/solapi/solapi-nodejs/commit/427481119d8c369de11b066c4d885a4067409bd6))
* **bms:** Implement validation for WIDE_ITEM_LIST and enhance commerce pricing rules ([dc1d572](https://github.com/solapi/solapi-nodejs/commit/dc1d572e5524b1777802b64b472ceca4d88b7c8d))
* **bms:** Update BMS Free Message E2E tests with new discount features ([d3174ed](https://github.com/solapi/solapi-nodejs/commit/d3174ed17de1c4235f9b97770dda900b758beaf8))
* **docs:** Add comprehensive documentation for AGENTS architecture ([cce726e](https://github.com/solapi/solapi-nodejs/commit/cce726e65e40256f9182db62c0f3568c517ec3a0))
* enhance error handling documentation and improve kakao template service e2e tests ([1b098fd](https://github.com/solapi/solapi-nodejs/commit/1b098fdf5cc14f9caaef7b42f6e201c6d8e26131))
* **errors:** Introduce ClientError and ServerError classes ([abebea3](https://github.com/solapi/solapi-nodejs/commit/abebea3400c92483b0b1ad0bf488fb49da4ebc0d))
* export all types/schemas and migrate to Effect ([e23dc93](https://github.com/solapi/solapi-nodejs/commit/e23dc93700b9aebdc52fdadad1feba5b18702cfa))
* **kakao:** BMS(브랜드 메시지 서비스) 타입 및 스키마 추가 ([e2a2381](https://github.com/solapi/solapi-nodejs/commit/e2a2381ccb48e60ecbc87f1e934867f724fed513))


### Bug Fixes

* beta manifest 버전을 현재 stable 버전(5.5.4)으로 수정 ([00943e6](https://github.com/solapi/solapi-nodejs/commit/00943e610df93296f73408742240752b716ec8b0))
* beta 설정에서 bootstrap-sha 제거 ([c94a3cc](https://github.com/solapi/solapi-nodejs/commit/c94a3ccef58efffeaeb5744bc2297dc2f5a4f1fe))
* **bms:** Update test cases for WIDE_ITEM_LIST type ([9df35df](https://github.com/solapi/solapi-nodejs/commit/9df35df87d319a2ede88ae61842342489379eb63))
* CI에서 사용하는 lint:ci, test:ci 스크립트 추가 ([209a78f](https://github.com/solapi/solapi-nodejs/commit/209a78f407e6cee95327bea0de8db9ec5de04382))
* handleClientErrorResponse에 동일한 null/비정형 JSON 방어 적용 ([e33df23](https://github.com/solapi/solapi-nodejs/commit/e33df239765a443ef094543c718977d2818e1a33))
* handleServerErrorResponse null JSON 방어 및 코드 간결화 ([6e149ef](https://github.com/solapi/solapi-nodejs/commit/6e149efd6377a156c2b16d092701bb7ddf3c9530))
* Kakao 스키마 타입 정의 수정 (알림톡 템플릿 code nullable, 앱버튼 링크 필수) ([3af2c74](https://github.com/solapi/solapi-nodejs/commit/3af2c74a65b0d34cbf03d04cd4e4c27de7f4523f))
* restore default message schema export ([e8d5e9c](https://github.com/solapi/solapi-nodejs/commit/e8d5e9cd3c83520aff5299889bb67d615bbc402c))
* 리뷰 피드백 반영 — isErrorResponse 강화, 에러 처리 일관성, examples 업데이트 ([0d9d7b4](https://github.com/solapi/solapi-nodejs/commit/0d9d7b45184f8cd81474f19b1e72beb5b9d63bfd))
* 리뷰 피드백 반영 — 문서 업데이트, 테스트 보강 ([233bb6b](https://github.com/solapi/solapi-nodejs/commit/233bb6b1984b9f8f0f16551148b6015e2a8d1724))
* 리뷰 피드백 반영 — 주석 누락 제거 및 sendRequestConfigSchema 테스트 추가 ([3635405](https://github.com/solapi/solapi-nodejs/commit/36354052621e6246906b4c17510c1f620f531ef8))
* 테스트에 expect.assertions() 추가로 false-green 방지 ([1f3fc8a](https://github.com/solapi/solapi-nodejs/commit/1f3fc8aa45a722998c8b4d8de9dc08ce9042b624))

## [6.0.0-beta.1](https://github.com/solapi/solapi-nodejs/compare/solapi-v6.0.0-beta.0...solapi-v6.0.0-beta.1) (2026-04-16)


### Bug Fixes

* handleClientErrorResponse에 동일한 null/비정형 JSON 방어 적용 ([e33df23](https://github.com/solapi/solapi-nodejs/commit/e33df239765a443ef094543c718977d2818e1a33))
* handleServerErrorResponse null JSON 방어 및 코드 간결화 ([6e149ef](https://github.com/solapi/solapi-nodejs/commit/6e149efd6377a156c2b16d092701bb7ddf3c9530))
* restore default message schema export ([e8d5e9c](https://github.com/solapi/solapi-nodejs/commit/e8d5e9cd3c83520aff5299889bb67d615bbc402c))
* 리뷰 피드백 반영 — isErrorResponse 강화, 에러 처리 일관성, examples 업데이트 ([0d9d7b4](https://github.com/solapi/solapi-nodejs/commit/0d9d7b45184f8cd81474f19b1e72beb5b9d63bfd))
* 리뷰 피드백 반영 — 문서 업데이트, 테스트 보강 ([233bb6b](https://github.com/solapi/solapi-nodejs/commit/233bb6b1984b9f8f0f16551148b6015e2a8d1724))
* 리뷰 피드백 반영 — 주석 누락 제거 및 sendRequestConfigSchema 테스트 추가 ([3635405](https://github.com/solapi/solapi-nodejs/commit/36354052621e6246906b4c17510c1f620f531ef8))
* 테스트에 expect.assertions() 추가로 false-green 방지 ([1f3fc8a](https://github.com/solapi/solapi-nodejs/commit/1f3fc8aa45a722998c8b4d8de9dc08ce9042b624))

## [6.0.0-beta.0](https://github.com/solapi/solapi-nodejs/compare/solapi-v5.5.4...solapi-v6.0.0-beta.0) (2026-04-08)


### ⚠ BREAKING CHANGES

* 전체 API를 Effect 라이브러리 기반으로 마이그레이션

### Features

* Add support for custom fields in group creation ([0adb356](https://github.com/solapi/solapi-nodejs/commit/0adb3566ee47ca06ed6da40fa54dbe98e8fc4c0f))
* **bms:** Enhance error handling and add BMS message types ([4274811](https://github.com/solapi/solapi-nodejs/commit/427481119d8c369de11b066c4d885a4067409bd6))
* **bms:** Implement validation for WIDE_ITEM_LIST and enhance commerce pricing rules ([dc1d572](https://github.com/solapi/solapi-nodejs/commit/dc1d572e5524b1777802b64b472ceca4d88b7c8d))
* **bms:** Update BMS Free Message E2E tests with new discount features ([d3174ed](https://github.com/solapi/solapi-nodejs/commit/d3174ed17de1c4235f9b97770dda900b758beaf8))
* **docs:** Add comprehensive documentation for AGENTS architecture ([cce726e](https://github.com/solapi/solapi-nodejs/commit/cce726e65e40256f9182db62c0f3568c517ec3a0))
* enhance error handling documentation and improve kakao template service e2e tests ([1b098fd](https://github.com/solapi/solapi-nodejs/commit/1b098fdf5cc14f9caaef7b42f6e201c6d8e26131))
* **errors:** Introduce ClientError and ServerError classes ([abebea3](https://github.com/solapi/solapi-nodejs/commit/abebea3400c92483b0b1ad0bf488fb49da4ebc0d))
* export all types/schemas and migrate to Effect ([e23dc93](https://github.com/solapi/solapi-nodejs/commit/e23dc93700b9aebdc52fdadad1feba5b18702cfa))
* **kakao:** BMS(브랜드 메시지 서비스) 타입 및 스키마 추가 ([e2a2381](https://github.com/solapi/solapi-nodejs/commit/e2a2381ccb48e60ecbc87f1e934867f724fed513))


### Bug Fixes

* beta manifest 버전을 현재 stable 버전(5.5.4)으로 수정 ([00943e6](https://github.com/solapi/solapi-nodejs/commit/00943e610df93296f73408742240752b716ec8b0))
* beta 설정에서 bootstrap-sha 제거 ([c94a3cc](https://github.com/solapi/solapi-nodejs/commit/c94a3ccef58efffeaeb5744bc2297dc2f5a4f1fe))
* **bms:** Update test cases for WIDE_ITEM_LIST type ([9df35df](https://github.com/solapi/solapi-nodejs/commit/9df35df87d319a2ede88ae61842342489379eb63))
* CI에서 사용하는 lint:ci, test:ci 스크립트 추가 ([209a78f](https://github.com/solapi/solapi-nodejs/commit/209a78f407e6cee95327bea0de8db9ec5de04382))
* Kakao 스키마 타입 정의 수정 (알림톡 템플릿 code nullable, 앱버튼 링크 필수) ([3af2c74](https://github.com/solapi/solapi-nodejs/commit/3af2c74a65b0d34cbf03d04cd4e4c27de7f4523f))
