import {baseKakaoOptionSchema} from '@models/base/kakao/kakaoOption';
import {Schema} from 'effect';
import {describe, expect, it} from 'vitest';

describe('BMS Option Schema in KakaoOption', () => {
  describe('chatBubbleType별 필수 필드 검증', () => {
    it('should accept valid BMS_TEXT message (no required fields)', () => {
      const validBmsText = {
        pfId: 'test-pf-id',
        bms: {
          targeting: 'I',
          chatBubbleType: 'TEXT',
        },
      };

      const result = Schema.decodeUnknownEither(baseKakaoOptionSchema)(
        validBmsText,
      );
      expect(result._tag).toBe('Right');
    });

    it('should accept BMS_TEXT with optional header', () => {
      const validBmsText = {
        pfId: 'test-pf-id',
        bms: {
          targeting: 'M',
          chatBubbleType: 'TEXT',
          header: '안내',
        },
      };

      const result = Schema.decodeUnknownEither(baseKakaoOptionSchema)(
        validBmsText,
      );
      expect(result._tag).toBe('Right');
    });

    it('should accept valid BMS_IMAGE message with imageId', () => {
      const validBmsImage = {
        pfId: 'test-pf-id',
        bms: {
          targeting: 'N',
          chatBubbleType: 'IMAGE',
          imageId: 'img-123',
        },
      };

      const result = Schema.decodeUnknownEither(baseKakaoOptionSchema)(
        validBmsImage,
      );
      expect(result._tag).toBe('Right');
    });

    it('should reject BMS_IMAGE without imageId', () => {
      const invalidBmsImage = {
        pfId: 'test-pf-id',
        bms: {
          targeting: 'I',
          chatBubbleType: 'IMAGE',
        },
      };

      expect(() => {
        Schema.decodeUnknownSync(baseKakaoOptionSchema)(invalidBmsImage);
      }).toThrow('BMS IMAGE 타입에 필수 필드가 누락되었습니다: imageId');
    });

    it('should accept valid BMS_WIDE message with imageId', () => {
      const validBmsWide = {
        pfId: 'test-pf-id',
        bms: {
          targeting: 'I',
          chatBubbleType: 'WIDE',
          imageId: 'img-456',
        },
      };

      const result = Schema.decodeUnknownEither(baseKakaoOptionSchema)(
        validBmsWide,
      );
      expect(result._tag).toBe('Right');
    });

    it('should reject BMS_WIDE without imageId', () => {
      const invalidBmsWide = {
        pfId: 'test-pf-id',
        bms: {
          targeting: 'I',
          chatBubbleType: 'WIDE',
        },
      };

      expect(() => {
        Schema.decodeUnknownSync(baseKakaoOptionSchema)(invalidBmsWide);
      }).toThrow('BMS WIDE 타입에 필수 필드가 누락되었습니다: imageId');
    });

    it('should accept valid BMS_WIDE_ITEM_LIST message with 3 sub items (minimum)', () => {
      const validBmsWideItemList = {
        pfId: 'test-pf-id',
        bms: {
          targeting: 'M',
          chatBubbleType: 'WIDE_ITEM_LIST',
          header: '헤더 제목',
          mainWideItem: {
            title: '메인 아이템',
            imageId: 'img-main',
            linkMobile: 'https://example.com/main',
          },
          subWideItemList: [
            {
              title: '서브 아이템 1',
              imageId: 'img-sub-1',
              linkMobile: 'https://example.com/sub1',
            },
            {
              title: '서브 아이템 2',
              imageId: 'img-sub-2',
              linkMobile: 'https://example.com/sub2',
            },
            {
              title: '서브 아이템 3',
              imageId: 'img-sub-3',
              linkMobile: 'https://example.com/sub3',
            },
          ],
        },
      };

      const result = Schema.decodeUnknownEither(baseKakaoOptionSchema)(
        validBmsWideItemList,
      );
      expect(result._tag).toBe('Right');
    });

    it('should reject BMS_WIDE_ITEM_LIST without mainWideItem', () => {
      const invalidBmsWideItemList = {
        pfId: 'test-pf-id',
        bms: {
          targeting: 'M',
          chatBubbleType: 'WIDE_ITEM_LIST',
          header: '헤더 제목',
          subWideItemList: [
            {
              title: '서브 아이템 1',
              imageId: 'img-sub-1',
              linkMobile: 'https://example.com/sub1',
            },
            {
              title: '서브 아이템 2',
              imageId: 'img-sub-2',
              linkMobile: 'https://example.com/sub2',
            },
            {
              title: '서브 아이템 3',
              imageId: 'img-sub-3',
              linkMobile: 'https://example.com/sub3',
            },
          ],
        },
      };

      expect(() => {
        Schema.decodeUnknownSync(baseKakaoOptionSchema)(invalidBmsWideItemList);
      }).toThrow('BMS WIDE_ITEM_LIST 타입에 필수 필드가 누락되었습니다');
    });

    it('should reject BMS_WIDE_ITEM_LIST with less than 3 sub items', () => {
      const invalidBmsWideItemList = {
        pfId: 'test-pf-id',
        bms: {
          targeting: 'M',
          chatBubbleType: 'WIDE_ITEM_LIST',
          header: '헤더 제목',
          mainWideItem: {
            title: '메인 아이템',
            imageId: 'img-main',
            linkMobile: 'https://example.com/main',
          },
          subWideItemList: [
            {
              title: '서브 아이템 1',
              imageId: 'img-sub-1',
              linkMobile: 'https://example.com/sub1',
            },
            {
              title: '서브 아이템 2',
              imageId: 'img-sub-2',
              linkMobile: 'https://example.com/sub2',
            },
          ],
        },
      };

      expect(() => {
        Schema.decodeUnknownSync(baseKakaoOptionSchema)(invalidBmsWideItemList);
      }).toThrow(
        'WIDE_ITEM_LIST 타입의 subWideItemList는 최소 3개 이상이어야 합니다',
      );
    });

    it('should accept valid BMS_COMMERCE message', () => {
      const validBmsCommerce = {
        pfId: 'test-pf-id',
        bms: {
          targeting: 'I',
          chatBubbleType: 'COMMERCE',
          imageId: 'img-commerce',
          commerce: {
            title: '상품명',
            regularPrice: 10000,
            discountPrice: 8000,
            discountRate: 20,
          },
          buttons: [
            {
              name: '구매하기',
              linkType: 'WL',
              linkMobile: 'https://shop.example.com',
            },
          ],
        },
      };

      const result = Schema.decodeUnknownEither(baseKakaoOptionSchema)(
        validBmsCommerce,
      );
      expect(result._tag).toBe('Right');
    });

    it('should reject BMS_COMMERCE without commerce', () => {
      const invalidBmsCommerce = {
        pfId: 'test-pf-id',
        bms: {
          targeting: 'I',
          chatBubbleType: 'COMMERCE',
          buttons: [
            {
              name: '구매하기',
              linkType: 'WL',
              linkMobile: 'https://shop.example.com',
            },
          ],
        },
      };

      expect(() => {
        Schema.decodeUnknownSync(baseKakaoOptionSchema)(invalidBmsCommerce);
      }).toThrow('BMS COMMERCE 타입에 필수 필드가 누락되었습니다');
    });

    it('should reject BMS_COMMERCE without buttons', () => {
      const invalidBmsCommerce = {
        pfId: 'test-pf-id',
        bms: {
          targeting: 'I',
          chatBubbleType: 'COMMERCE',
          commerce: {
            title: '상품명',
            regularPrice: 10000,
          },
        },
      };

      expect(() => {
        Schema.decodeUnknownSync(baseKakaoOptionSchema)(invalidBmsCommerce);
      }).toThrow('BMS COMMERCE 타입에 필수 필드가 누락되었습니다');
    });

    it('should accept valid BMS_CAROUSEL_FEED message', () => {
      const validBmsCarouselFeed = {
        pfId: 'test-pf-id',
        bms: {
          targeting: 'N',
          chatBubbleType: 'CAROUSEL_FEED',
          carousel: {
            list: [
              {
                header: '캐러셀 1',
                content: '내용 1',
                imageId: 'img-1',
                buttons: [
                  {
                    name: '자세히',
                    linkType: 'WL',
                    linkMobile: 'https://example.com/1',
                  },
                ],
              },
            ],
          },
        },
      };

      const result = Schema.decodeUnknownEither(baseKakaoOptionSchema)(
        validBmsCarouselFeed,
      );
      expect(result._tag).toBe('Right');
    });

    it('should reject BMS_CAROUSEL_FEED without carousel', () => {
      const invalidBmsCarouselFeed = {
        pfId: 'test-pf-id',
        bms: {
          targeting: 'N',
          chatBubbleType: 'CAROUSEL_FEED',
        },
      };

      expect(() => {
        Schema.decodeUnknownSync(baseKakaoOptionSchema)(invalidBmsCarouselFeed);
      }).toThrow(
        'BMS CAROUSEL_FEED 타입에 필수 필드가 누락되었습니다: carousel',
      );
    });

    it('should accept valid BMS_CAROUSEL_COMMERCE message', () => {
      const validBmsCarouselCommerce = {
        pfId: 'test-pf-id',
        bms: {
          targeting: 'M',
          chatBubbleType: 'CAROUSEL_COMMERCE',
          carousel: {
            list: [
              {
                commerce: {
                  title: '상품 1',
                  regularPrice: 15000,
                },
                imageId: 'img-1',
                buttons: [
                  {
                    name: '구매',
                    linkType: 'WL',
                    linkMobile: 'https://shop.example.com/1',
                  },
                ],
              },
            ],
          },
        },
      };

      const result = Schema.decodeUnknownEither(baseKakaoOptionSchema)(
        validBmsCarouselCommerce,
      );
      expect(result._tag).toBe('Right');
    });

    it('should reject BMS_CAROUSEL_COMMERCE without carousel', () => {
      const invalidBmsCarouselCommerce = {
        pfId: 'test-pf-id',
        bms: {
          targeting: 'M',
          chatBubbleType: 'CAROUSEL_COMMERCE',
        },
      };

      expect(() => {
        Schema.decodeUnknownSync(baseKakaoOptionSchema)(
          invalidBmsCarouselCommerce,
        );
      }).toThrow(
        'BMS CAROUSEL_COMMERCE 타입에 필수 필드가 누락되었습니다: carousel',
      );
    });

    it('should accept valid BMS_PREMIUM_VIDEO message', () => {
      const validBmsPremiumVideo = {
        pfId: 'test-pf-id',
        bms: {
          targeting: 'I',
          chatBubbleType: 'PREMIUM_VIDEO',
          video: {
            videoUrl: 'https://tv.kakao.com/v/123456789',
            imageId: 'thumb-123',
          },
        },
      };

      const result = Schema.decodeUnknownEither(baseKakaoOptionSchema)(
        validBmsPremiumVideo,
      );
      expect(result._tag).toBe('Right');
    });

    it('should reject BMS_PREMIUM_VIDEO without video', () => {
      const invalidBmsPremiumVideo = {
        pfId: 'test-pf-id',
        bms: {
          targeting: 'I',
          chatBubbleType: 'PREMIUM_VIDEO',
        },
      };

      expect(() => {
        Schema.decodeUnknownSync(baseKakaoOptionSchema)(invalidBmsPremiumVideo);
      }).toThrow('BMS PREMIUM_VIDEO 타입에 필수 필드가 누락되었습니다: video');
    });
  });

  describe('targeting 필드 검증', () => {
    it.each([
      'I',
      'M',
      'N',
    ] as const)('should accept valid targeting: %s', targeting => {
      const validBms = {
        pfId: 'test-pf-id',
        bms: {
          targeting,
          chatBubbleType: 'TEXT',
        },
      };

      const result = Schema.decodeUnknownEither(baseKakaoOptionSchema)(
        validBms,
      );
      expect(result._tag).toBe('Right');
    });

    it('should reject invalid targeting', () => {
      const invalidBms = {
        pfId: 'test-pf-id',
        bms: {
          targeting: 'INVALID',
          chatBubbleType: 'TEXT',
        },
      };

      const result = Schema.decodeUnknownEither(baseKakaoOptionSchema)(
        invalidBms,
      );
      expect(result._tag).toBe('Left');
    });
  });

  describe('chatBubbleType 필드 검증', () => {
    const validChatBubbleTypes = [
      'TEXT',
      'IMAGE',
      'WIDE',
      'WIDE_ITEM_LIST',
      'COMMERCE',
      'CAROUSEL_FEED',
      'CAROUSEL_COMMERCE',
      'PREMIUM_VIDEO',
    ] as const;

    it.each(
      validChatBubbleTypes,
    )('should accept valid chatBubbleType: %s (with required fields)', chatBubbleType => {
      let bms: Record<string, unknown> = {
        targeting: 'I',
        chatBubbleType,
      };

      // chatBubbleType별 필수 필드 추가
      switch (chatBubbleType) {
        case 'IMAGE':
        case 'WIDE':
          bms = {...bms, imageId: 'img-123'};
          break;
        case 'WIDE_ITEM_LIST':
          bms = {
            ...bms,
            header: '헤더 제목',
            mainWideItem: {
              title: '메인',
              imageId: 'img-main',
              linkMobile: 'https://example.com/main',
            },
            subWideItemList: [
              {
                title: '서브 1',
                imageId: 'img-sub-1',
                linkMobile: 'https://example.com/sub1',
              },
              {
                title: '서브 2',
                imageId: 'img-sub-2',
                linkMobile: 'https://example.com/sub2',
              },
              {
                title: '서브 3',
                imageId: 'img-sub-3',
                linkMobile: 'https://example.com/sub3',
              },
            ],
          };
          break;
        case 'COMMERCE':
          bms = {
            ...bms,
            imageId: 'img-commerce',
            commerce: {title: '상품', regularPrice: 10000},
            buttons: [
              {name: '구매', linkType: 'WL', linkMobile: 'https://example.com'},
            ],
          };
          break;
        case 'CAROUSEL_FEED':
          bms = {
            ...bms,
            carousel: {
              list: [
                {
                  header: '헤더',
                  content: '내용',
                  imageId: 'img-1',
                  buttons: [
                    {
                      name: '버튼',
                      linkType: 'WL',
                      linkMobile: 'https://example.com',
                    },
                  ],
                },
              ],
            },
          };
          break;
        case 'CAROUSEL_COMMERCE':
          bms = {
            ...bms,
            carousel: {
              list: [
                {
                  commerce: {title: '상품', regularPrice: 10000},
                  imageId: 'img-1',
                  buttons: [
                    {
                      name: '구매',
                      linkType: 'WL',
                      linkMobile: 'https://example.com',
                    },
                  ],
                },
              ],
            },
          };
          break;
        case 'PREMIUM_VIDEO':
          bms = {
            ...bms,
            video: {
              videoUrl: 'https://tv.kakao.com/v/123456789',
              imageId: 'thumb-123',
            },
          };
          break;
      }

      const validBms = {
        pfId: 'test-pf-id',
        bms,
      };

      const result = Schema.decodeUnknownEither(baseKakaoOptionSchema)(
        validBms,
      );
      expect(result._tag).toBe('Right');
    });

    it('should reject invalid chatBubbleType', () => {
      const invalidBms = {
        pfId: 'test-pf-id',
        bms: {
          targeting: 'I',
          chatBubbleType: 'INVALID_TYPE',
        },
      };

      const result = Schema.decodeUnknownEither(baseKakaoOptionSchema)(
        invalidBms,
      );
      expect(result._tag).toBe('Left');
    });
  });

  describe('optional fields', () => {
    it('should accept BMS with adult flag', () => {
      const bmsWithAdult = {
        pfId: 'test-pf-id',
        bms: {
          targeting: 'I',
          chatBubbleType: 'TEXT',
          adult: true,
        },
      };

      const result = Schema.decodeUnknownEither(baseKakaoOptionSchema)(
        bmsWithAdult,
      );
      expect(result._tag).toBe('Right');
    });

    it('should accept BMS with coupon', () => {
      const bmsWithCoupon = {
        pfId: 'test-pf-id',
        bms: {
          targeting: 'I',
          chatBubbleType: 'TEXT',
          coupon: {
            title: '10000원 할인 쿠폰',
            description: '10% 할인',
          },
        },
      };

      const result = Schema.decodeUnknownEither(baseKakaoOptionSchema)(
        bmsWithCoupon,
      );
      expect(result._tag).toBe('Right');
    });

    it('should accept BMS with buttons', () => {
      const bmsWithButtons = {
        pfId: 'test-pf-id',
        bms: {
          targeting: 'I',
          chatBubbleType: 'TEXT',
          buttons: [
            {
              name: '버튼1',
              linkType: 'WL',
              linkMobile: 'https://example.com',
            },
            {
              name: '채널추가',
              linkType: 'AC',
            },
          ],
        },
      };

      const result = Schema.decodeUnknownEither(baseKakaoOptionSchema)(
        bmsWithButtons,
      );
      expect(result._tag).toBe('Right');
    });

    it('should accept BMS with additionalContent', () => {
      const bmsWithAdditionalContent = {
        pfId: 'test-pf-id',
        bms: {
          targeting: 'I',
          chatBubbleType: 'TEXT',
          additionalContent: '추가 내용',
        },
      };

      const result = Schema.decodeUnknownEither(baseKakaoOptionSchema)(
        bmsWithAdditionalContent,
      );
      expect(result._tag).toBe('Right');
    });
  });
});
