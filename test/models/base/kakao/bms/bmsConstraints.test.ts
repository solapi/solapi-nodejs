import {
  type BmsConstraintInput,
  validateAcceptableFields,
  validateAllowedLinkTypes,
  validateButtonCount,
  validateButtonNames,
  validateCarouselListCount,
  validateCouponDescription,
  validateForbiddenVariables,
  validateImageIdLength,
  validateLinks,
  validateNewlineLimits,
  validateTextLengths,
} from '@models/base/kakao/bms/bmsConstraints';
import {describe, expect, it} from 'vitest';

const baseTextBms = (
  overrides: Partial<BmsConstraintInput> = {},
): BmsConstraintInput => ({
  chatBubbleType: 'TEXT',
  ...overrides,
});

describe('validateCouponDescription', () => {
  it('should pass when coupon is not provided', () => {
    expect(validateCouponDescription(baseTextBms())).toBe(true);
  });

  it.each([
    ['TEXT', 12, true],
    ['IMAGE', 12, true],
    ['COMMERCE', 12, true],
    ['CAROUSEL_FEED', 12, true],
    ['CAROUSEL_COMMERCE', 12, true],
    ['PREMIUM_VIDEO', 12, true],
    ['WIDE', 18, true],
    ['WIDE_ITEM_LIST', 18, true],
  ] as const)('should accept coupon description at exact max length for %s (%d chars)', (chatBubbleType, maxLen) => {
    const result = validateCouponDescription({
      chatBubbleType,
      coupon: {description: 'x'.repeat(maxLen)},
    });
    expect(result).toBe(true);
  });

  it.each([
    ['TEXT', 13, 12],
    ['IMAGE', 13, 12],
    ['WIDE', 19, 18],
    ['WIDE_ITEM_LIST', 19, 18],
  ] as const)('should reject coupon description exceeding max for %s (%d > %d)', (chatBubbleType, descLen, maxLen) => {
    const result = validateCouponDescription({
      chatBubbleType,
      coupon: {description: 'x'.repeat(descLen)},
    });
    expect(result).toBe(`쿠폰 설명은 최대 ${maxLen}자 이하로 입력해주세요.`);
  });

  it('should reproduce server error message exactly (regression: sdk-testing BMS_FREE)', () => {
    const result = validateCouponDescription({
      chatBubbleType: 'TEXT',
      coupon: {description: '이것은 13자짜리 설명입'},
    });
    expect(result).toBe('쿠폰 설명은 최대 12자 이하로 입력해주세요.');
  });

  it('should validate per-item coupon description on CAROUSEL_FEED (ultrareview merged_bug_002)', () => {
    const result = validateCouponDescription({
      chatBubbleType: 'CAROUSEL_FEED',
      carousel: {
        list: [{coupon: {description: 'x'.repeat(13)}}],
      },
    });
    expect(result).toBe('쿠폰 설명은 최대 12자 이하로 입력해주세요.');
  });

  it('should validate per-item coupon description on CAROUSEL_COMMERCE', () => {
    const result = validateCouponDescription({
      chatBubbleType: 'CAROUSEL_COMMERCE',
      carousel: {
        list: [{coupon: {description: 'x'.repeat(13)}}],
      },
    });
    expect(result).toBe('쿠폰 설명은 최대 12자 이하로 입력해주세요.');
  });

  it('should accept per-item coupon description within limit', () => {
    expect(
      validateCouponDescription({
        chatBubbleType: 'CAROUSEL_FEED',
        carousel: {
          list: [{coupon: {description: 'x'.repeat(12)}}],
        },
      }),
    ).toBe(true);
  });
});

describe('validateButtonCount', () => {
  it('should pass when no buttons provided for TEXT', () => {
    expect(validateButtonCount(baseTextBms())).toBe(true);
  });

  it('should accept 5 buttons on TEXT without coupon', () => {
    const buttons = Array.from({length: 5}, (_, i) => ({
      name: `b${i}`,
      linkType: 'WL' as const,
    }));
    expect(validateButtonCount(baseTextBms({buttons}))).toBe(true);
  });

  it('should reject 6 buttons on TEXT without coupon', () => {
    const buttons = Array.from({length: 6}, (_, i) => ({
      name: `b${i}`,
      linkType: 'WL' as const,
    }));
    const result = validateButtonCount(baseTextBms({buttons}));
    expect(result).toBe(
      'TEXT 타입에서는 최대 5개의 버튼만 사용할 수 있습니다.',
    );
  });

  it('should accept 4 buttons on IMAGE with coupon', () => {
    const buttons = Array.from({length: 4}, (_, i) => ({
      name: `b${i}`,
      linkType: 'WL' as const,
    }));
    expect(
      validateButtonCount({
        chatBubbleType: 'IMAGE',
        coupon: {description: '10%'},
        buttons,
      }),
    ).toBe(true);
  });

  it('should reject 5 buttons on IMAGE when coupon present', () => {
    const buttons = Array.from({length: 5}, (_, i) => ({
      name: `b${i}`,
      linkType: 'WL' as const,
    }));
    const result = validateButtonCount({
      chatBubbleType: 'IMAGE',
      coupon: {description: '10%'},
      buttons,
    });
    expect(result).toBe(
      'IMAGE 타입에서는 쿠폰 사용 시 최대 4개의 버튼만 사용할 수 있습니다.',
    );
  });

  it('should reject 3 buttons on WIDE', () => {
    const buttons = Array.from({length: 3}, (_, i) => ({
      name: `b${i}`,
      linkType: 'WL' as const,
    }));
    const result = validateButtonCount({
      chatBubbleType: 'WIDE',
      buttons,
    });
    expect(result).toBe(
      'WIDE 타입에서는 최대 2개의 버튼만 사용할 수 있습니다.',
    );
  });

  it('should reject 2 buttons on PREMIUM_VIDEO', () => {
    const result = validateButtonCount({
      chatBubbleType: 'PREMIUM_VIDEO',
      buttons: [
        {name: 'b1', linkType: 'WL'},
        {name: 'b2', linkType: 'WL'},
      ],
    });
    expect(result).toBe(
      'PREMIUM_VIDEO 타입에서는 최대 1개의 버튼만 사용할 수 있습니다.',
    );
  });

  it('should validate each CAROUSEL_FEED item buttons separately', () => {
    const result = validateButtonCount({
      chatBubbleType: 'CAROUSEL_FEED',
      carousel: {
        list: [
          {
            buttons: [
              {name: 'a', linkType: 'WL'},
              {name: 'b', linkType: 'WL'},
              {name: 'c', linkType: 'WL'},
            ],
          },
        ],
      },
    });
    expect(result).toBe(
      'CAROUSEL_FEED 타입에서는 최대 2개의 버튼만 사용할 수 있습니다.',
    );
  });
});

describe('validateButtonNames', () => {
  it('should accept 14-char name on TEXT', () => {
    expect(
      validateButtonNames(
        baseTextBms({
          buttons: [{name: 'x'.repeat(14), linkType: 'WL'}],
        }),
      ),
    ).toBe(true);
  });

  it('should reject 15-char name on TEXT', () => {
    const result = validateButtonNames(
      baseTextBms({
        buttons: [{name: 'x'.repeat(15), linkType: 'WL'}],
      }),
    );
    expect(result).toBe(
      'TEXT 타입 button.name은 최대 14자 이하로 입력해주세요.',
    );
  });

  it('should reject 9-char name on WIDE', () => {
    const result = validateButtonNames({
      chatBubbleType: 'WIDE',
      buttons: [{name: 'x'.repeat(9), linkType: 'WL'}],
    });
    expect(result).toBe(
      'WIDE 타입 button.name은 최대 8자 이하로 입력해주세요.',
    );
  });

  it('should skip AC linkType even with long name', () => {
    expect(
      validateButtonNames(
        baseTextBms({
          buttons: [{name: 'x'.repeat(100), linkType: 'AC'}],
        }),
      ),
    ).toBe(true);
  });

  it('should check button names in carousel list items', () => {
    const result = validateButtonNames({
      chatBubbleType: 'CAROUSEL_FEED',
      carousel: {
        list: [
          {
            buttons: [{name: 'x'.repeat(9), linkType: 'WL'}],
          },
        ],
      },
    });
    expect(result).toBe(
      'CAROUSEL_FEED 타입 button.name은 최대 8자 이하로 입력해주세요.',
    );
  });
});

describe('validateAllowedLinkTypes', () => {
  it('should allow any linkType on TEXT', () => {
    expect(
      validateAllowedLinkTypes(
        baseTextBms({
          buttons: [
            {name: 'a', linkType: 'AC'},
            {name: 'b', linkType: 'BK'},
            {name: 'c', linkType: 'BT'},
          ],
        }),
      ),
    ).toBe(true);
  });

  it('should reject AC on COMMERCE', () => {
    const result = validateAllowedLinkTypes({
      chatBubbleType: 'COMMERCE',
      buttons: [{name: 'a', linkType: 'AC'}],
    });
    expect(result).toBe(
      'COMMERCE 타입에서는 WL, AL 타입의 버튼만 사용할 수 있습니다.',
    );
  });

  it('should reject BK on CAROUSEL_FEED item buttons', () => {
    const result = validateAllowedLinkTypes({
      chatBubbleType: 'CAROUSEL_FEED',
      carousel: {
        list: [
          {
            buttons: [{name: 'a', linkType: 'BK'}],
          },
        ],
      },
    });
    expect(result).toBe(
      'CAROUSEL_FEED 타입에서는 WL, AL 타입의 버튼만 사용할 수 있습니다.',
    );
  });
});

describe('validateTextLengths', () => {
  it('should reject header over 20 chars', () => {
    const result = validateTextLengths(baseTextBms({header: 'x'.repeat(21)}));
    expect(result).toBe('TEXT 타입 header은 최대 20자 이하로 입력해주세요.');
  });

  it('should accept header of exactly 20 chars', () => {
    expect(validateTextLengths(baseTextBms({header: 'x'.repeat(20)}))).toBe(
      true,
    );
  });

  it('should reject content over 1300 chars on TEXT', () => {
    const result = validateTextLengths(
      baseTextBms({content: 'x'.repeat(1301)}),
    );
    expect(result).toBe('TEXT 타입 content은 최대 1300자 이하로 입력해주세요.');
  });

  it('should reject content over 76 chars on WIDE', () => {
    const result = validateTextLengths({
      chatBubbleType: 'WIDE',
      content: 'x'.repeat(77),
    });
    expect(result).toBe('WIDE 타입 content은 최대 76자 이하로 입력해주세요.');
  });

  it('should reject additionalContent over 34 chars', () => {
    const result = validateTextLengths({
      chatBubbleType: 'COMMERCE',
      additionalContent: 'x'.repeat(35),
    });
    expect(result).toBe(
      'COMMERCE 타입 additionalContent은 최대 34자 이하로 입력해주세요.',
    );
  });

  it('should reject mainWideItem.title over 25 chars', () => {
    const result = validateTextLengths({
      chatBubbleType: 'WIDE_ITEM_LIST',
      mainWideItem: {title: 'x'.repeat(26)},
    });
    expect(result).toBe(
      'WIDE_ITEM_LIST 타입 mainWideItem.title은 최대 25자 이하로 입력해주세요.',
    );
  });

  it('should reject subWideItem.title over 30 chars', () => {
    const result = validateTextLengths({
      chatBubbleType: 'WIDE_ITEM_LIST',
      subWideItemList: [{title: 'x'.repeat(31)}],
    });
    expect(result).toBe(
      'WIDE_ITEM_LIST 타입 subWideItem.title은 최대 30자 이하로 입력해주세요.',
    );
  });

  it('should reject carousel.head.content over 50 chars', () => {
    const result = validateTextLengths({
      chatBubbleType: 'CAROUSEL_COMMERCE',
      carousel: {
        head: {content: 'x'.repeat(51)},
      },
    });
    expect(result).toBe(
      'CAROUSEL_COMMERCE 타입 carousel.head.content은 최대 50자 이하로 입력해주세요.',
    );
  });

  it('should reject CAROUSEL_FEED list content over 180 chars', () => {
    const result = validateTextLengths({
      chatBubbleType: 'CAROUSEL_FEED',
      carousel: {
        list: [{content: 'x'.repeat(181)}],
      },
    });
    expect(result).toBe(
      'CAROUSEL_FEED 타입 carousel.list.content은 최대 180자 이하로 입력해주세요.',
    );
  });

  it('should reject CAROUSEL_COMMERCE list additionalContent over 34 chars', () => {
    const result = validateTextLengths({
      chatBubbleType: 'CAROUSEL_COMMERCE',
      carousel: {
        list: [{additionalContent: 'x'.repeat(35)}],
      },
    });
    expect(result).toBe(
      'CAROUSEL_COMMERCE 타입 carousel.list.additionalContent은 최대 34자 이하로 입력해주세요.',
    );
  });
});

describe('validateCarouselListCount', () => {
  it('should skip validation for non-carousel types', () => {
    expect(validateCarouselListCount(baseTextBms())).toBe(true);
  });

  it('should accept 2-6 list without head', () => {
    for (const count of [2, 3, 6]) {
      const list = Array.from({length: count}, () => ({}));
      expect(
        validateCarouselListCount({
          chatBubbleType: 'CAROUSEL_FEED',
          carousel: {list},
        }),
      ).toBe(true);
    }
  });

  it('should reject 1 list item without head', () => {
    const result = validateCarouselListCount({
      chatBubbleType: 'CAROUSEL_FEED',
      carousel: {list: [{}]},
    });
    expect(result).toBe('캐러셀 리스트는 최소 2개, 최대 6개까지 가능합니다.');
  });

  it('should reject 7 list items without head', () => {
    const list = Array.from({length: 7}, () => ({}));
    const result = validateCarouselListCount({
      chatBubbleType: 'CAROUSEL_FEED',
      carousel: {list},
    });
    expect(result).toBe('캐러셀 리스트는 최소 2개, 최대 6개까지 가능합니다.');
  });

  it('should accept 1-5 list with head', () => {
    for (const count of [1, 3, 5]) {
      const list = Array.from({length: count}, () => ({}));
      expect(
        validateCarouselListCount({
          chatBubbleType: 'CAROUSEL_COMMERCE',
          carousel: {head: {}, list},
        }),
      ).toBe(true);
    }
  });

  it('should reject 6 list items with head', () => {
    const list = Array.from({length: 6}, () => ({}));
    const result = validateCarouselListCount({
      chatBubbleType: 'CAROUSEL_COMMERCE',
      carousel: {head: {}, list},
    });
    expect(result).toBe(
      '캐러셀 인트로가 있는 경우 캐러셀 리스트는 최소 1개, 최대 5개까지 가능합니다.',
    );
  });
});

describe('validateNewlineLimits', () => {
  it('should reject header with any newline', () => {
    const result = validateNewlineLimits(baseTextBms({header: '제목\n부제'}));
    expect(result).toBe('TEXT 타입 header은 줄바꿈 최대 0개 까지 가능합니다.');
  });

  it('should accept TEXT content with 99 newlines', () => {
    const content = Array.from({length: 100}, () => 'x').join('\n');
    expect(validateNewlineLimits(baseTextBms({content}))).toBe(true);
  });

  it('should reject WIDE content with 2 newlines', () => {
    const result = validateNewlineLimits({
      chatBubbleType: 'WIDE',
      content: 'a\nb\nc',
    });
    expect(result).toBe('WIDE 타입 content은 줄바꿈 최대 1개 까지 가능합니다.');
  });

  it('should reject PREMIUM_VIDEO content with 2 newlines', () => {
    const result = validateNewlineLimits({
      chatBubbleType: 'PREMIUM_VIDEO',
      content: 'a\nb\nc',
    });
    expect(result).toBe(
      'PREMIUM_VIDEO 타입 content은 줄바꿈 최대 1개 까지 가능합니다.',
    );
  });

  it('should reject mainWideItem.title with 2 newlines', () => {
    const result = validateNewlineLimits({
      chatBubbleType: 'WIDE_ITEM_LIST',
      mainWideItem: {title: 'a\nb\nc'},
    });
    expect(result).toBe(
      'WIDE_ITEM_LIST 타입 mainWideItem.title은 줄바꿈 최대 1개 까지 가능합니다.',
    );
  });

  it('should reject subWideItem.title with 2 newlines', () => {
    const result = validateNewlineLimits({
      chatBubbleType: 'WIDE_ITEM_LIST',
      subWideItemList: [{title: 'a\nb\nc'}],
    });
    expect(result).toBe(
      'WIDE_ITEM_LIST 타입 subWideItem.title은 줄바꿈 최대 1개 까지 가능합니다.',
    );
  });

  it('should reject carousel.head.content with 3 newlines', () => {
    const result = validateNewlineLimits({
      chatBubbleType: 'CAROUSEL_COMMERCE',
      carousel: {head: {content: 'a\nb\nc\nd'}},
    });
    expect(result).toBe(
      'CAROUSEL_COMMERCE 타입 carousel.head.content은 줄바꿈 최대 2개 까지 가능합니다.',
    );
  });

  it('should reject carousel.list.header with newline', () => {
    const result = validateNewlineLimits({
      chatBubbleType: 'CAROUSEL_FEED',
      carousel: {list: [{header: 'a\nb'}]},
    });
    expect(result).toBe(
      'CAROUSEL_FEED 타입 carousel.list.header은 줄바꿈 최대 0개 까지 가능합니다.',
    );
  });

  it('should reject CAROUSEL_FEED carousel.list.content with 3 newlines', () => {
    const result = validateNewlineLimits({
      chatBubbleType: 'CAROUSEL_FEED',
      carousel: {list: [{content: 'a\nb\nc\nd'}]},
    });
    expect(result).toBe(
      'CAROUSEL_FEED 타입 carousel.list.content은 줄바꿈 최대 2개 까지 가능합니다.',
    );
  });

  it('should reject CAROUSEL_COMMERCE carousel.list.additionalContent with 2 newlines', () => {
    const result = validateNewlineLimits({
      chatBubbleType: 'CAROUSEL_COMMERCE',
      carousel: {list: [{additionalContent: 'a\nb\nc'}]},
    });
    expect(result).toBe(
      'CAROUSEL_COMMERCE 타입 carousel.list.additionalContent은 줄바꿈 최대 1개 까지 가능합니다.',
    );
  });
});

describe('validateLinks', () => {
  it('should accept valid http(s) linkMobile on buttons', () => {
    expect(
      validateLinks(
        baseTextBms({
          buttons: [
            {
              name: 'b',
              linkType: 'WL',
              linkMobile: 'https://example.com/path?x=1',
            },
          ],
        }),
      ),
    ).toBe(true);
  });

  it('should reject non-URL linkMobile', () => {
    const result = validateLinks(
      baseTextBms({
        buttons: [{name: 'b', linkType: 'WL', linkMobile: 'not-a-url'}],
      }),
    );
    expect(result).toBe(
      'linkMobile 값이 잘못되었습니다. 올바른 형식은 웹 링크 형식이어야 합니다.',
    );
  });

  it('should accept http(s) prefix with #{variable}', () => {
    expect(
      validateLinks(
        baseTextBms({
          coupon: {
            description: '10%',
            linkMobile: 'https://example.com/#{couponId}/view',
          },
        }),
      ),
    ).toBe(true);
  });

  it('should reject linkPc with malformed URL', () => {
    const result = validateLinks(
      baseTextBms({
        buttons: [
          {
            name: 'b',
            linkType: 'WL',
            linkMobile: 'https://ok.example.com',
            linkPc: 'broken://not-http',
          },
        ],
      }),
    );
    expect(result).toBe(
      'linkPc 값이 잘못되었습니다. 올바른 형식은 웹 링크 형식이어야 합니다.',
    );
  });

  it('should reject invalid imageLink at top level', () => {
    const result = validateLinks(baseTextBms({imageLink: 'just-text'}));
    expect(result).toBe(
      'imageLink 값이 잘못되었습니다. http:// 또는 https:// 로 시작하는 정상적인 주소를 올려주세요.',
    );
  });

  it('should reject invalid imageLink inside carousel list item', () => {
    const result = validateLinks({
      chatBubbleType: 'CAROUSEL_FEED',
      carousel: {
        list: [{imageLink: 'bad'}],
      },
    });
    expect(result).toBe(
      'imageLink 값이 잘못되었습니다. http:// 또는 https:// 로 시작하는 정상적인 주소를 올려주세요.',
    );
  });

  it('should reject invalid linkMobile on mainWideItem', () => {
    const result = validateLinks({
      chatBubbleType: 'WIDE_ITEM_LIST',
      mainWideItem: {linkMobile: 'not-url'},
    });
    expect(result).toBe(
      'linkMobile 값이 잘못되었습니다. 올바른 형식은 웹 링크 형식이어야 합니다.',
    );
  });

  it('should reject invalid linkMobile on carousel.tail', () => {
    const result = validateLinks({
      chatBubbleType: 'CAROUSEL_FEED',
      carousel: {tail: {linkMobile: 'bad-url'}},
    });
    expect(result).toBe(
      'linkMobile 값이 잘못되었습니다. 올바른 형식은 웹 링크 형식이어야 합니다.',
    );
  });

  it('should reject invalid linkMobile on per-item coupon (ultrareview merged_bug_002)', () => {
    const result = validateLinks({
      chatBubbleType: 'CAROUSEL_FEED',
      carousel: {
        list: [
          {
            coupon: {description: '10%', linkMobile: 'not-a-url'},
          },
        ],
      },
    });
    expect(result).toBe(
      'linkMobile 값이 잘못되었습니다. 올바른 형식은 웹 링크 형식이어야 합니다.',
    );
  });

  it('should reject https without domain.tld (localhost)', () => {
    const result = validateLinks(
      baseTextBms({
        buttons: [{name: 'b', linkType: 'WL', linkMobile: 'https://localhost'}],
      }),
    );
    expect(result).toBe(
      'linkMobile 값이 잘못되었습니다. 올바른 형식은 웹 링크 형식이어야 합니다.',
    );
  });
});

describe('countNewlines — CRLF/CR 대응', () => {
  it('should count CRLF as one newline', () => {
    const result = validateNewlineLimits(baseTextBms({header: '제목\r\n부제'}));
    expect(result).toBe('TEXT 타입 header은 줄바꿈 최대 0개 까지 가능합니다.');
  });

  it('should count CR as one newline', () => {
    const result = validateNewlineLimits(baseTextBms({header: '제목\r부제'}));
    expect(result).toBe('TEXT 타입 header은 줄바꿈 최대 0개 까지 가능합니다.');
  });
});

describe('validateForbiddenVariables', () => {
  it('should accept button.name without variables', () => {
    expect(
      validateForbiddenVariables(
        baseTextBms({
          buttons: [{name: '자세히 보기', linkType: 'WL'}],
        }),
      ),
    ).toBe(true);
  });

  it('should reject button.name with variable', () => {
    const result = validateForbiddenVariables(
      baseTextBms({
        buttons: [{name: '#{user}님', linkType: 'WL'}],
      }),
    );
    expect(result).toBe('button.name에는 변수를 사용할 수 없습니다.');
  });

  it('should reject button.name with variable inside carousel list', () => {
    const result = validateForbiddenVariables({
      chatBubbleType: 'CAROUSEL_FEED',
      carousel: {
        list: [{buttons: [{name: '#{v}', linkType: 'WL'}]}],
      },
    });
    expect(result).toBe('button.name에는 변수를 사용할 수 없습니다.');
  });

  it('should reject variable in carousel.tail.linkMobile', () => {
    const result = validateForbiddenVariables({
      chatBubbleType: 'CAROUSEL_FEED',
      carousel: {
        tail: {linkMobile: 'https://example.com/#{path}'},
      },
    });
    expect(result).toBe('linkMobile에는 변수를 사용할 수 없습니다.');
  });

  it('should reject variable in carousel.tail.linkPc', () => {
    const result = validateForbiddenVariables({
      chatBubbleType: 'CAROUSEL_COMMERCE',
      carousel: {
        tail: {linkPc: 'https://example.com/#{path}'},
      },
    });
    expect(result).toBe('linkPc에는 변수를 사용할 수 없습니다.');
  });
});

describe('validateAcceptableFields', () => {
  it('should accept TEXT with only allowed fields', () => {
    expect(
      validateAcceptableFields({
        chatBubbleType: 'TEXT',
        content: '내용',
      }),
    ).toBe(true);
  });

  it('should reject TEXT with mainWideItem field', () => {
    const result = validateAcceptableFields({
      chatBubbleType: 'TEXT',
      mainWideItem: {title: '나쁨'},
    });
    expect(result).toBe(
      'TEXT타입 에서는 adult, content, buttons, coupon 값만 사용이 가능합니다.',
    );
  });

  it('should reject CAROUSEL_FEED with additionalContent', () => {
    const result = validateAcceptableFields({
      chatBubbleType: 'CAROUSEL_FEED',
      additionalContent: '추가 내용',
    });
    expect(result).toBe(
      'CAROUSEL_FEED타입 에서는 adult, carousel 값만 사용이 가능합니다.',
    );
  });

  it('should reject WIDE with imageLink (not in acceptable list)', () => {
    const result = validateAcceptableFields({
      chatBubbleType: 'WIDE',
      imageLink: 'https://example.com',
    });
    expect(result).toBe(
      'WIDE타입 에서는 adult, content, imageId, buttons, coupon 값만 사용이 가능합니다.',
    );
  });

  it('should skip null/undefined fields', () => {
    // null 필드는 레퍼런스에서 삭제되므로 검증 대상에서 제외
    const result = validateAcceptableFields({
      chatBubbleType: 'TEXT',
      content: '내용',
      header: undefined,
    });
    expect(result).toBe(true);
  });
});

describe('validateImageIdLength', () => {
  it('should pass for non-IMAGE type', () => {
    expect(
      validateImageIdLength({
        chatBubbleType: 'TEXT',
        imageId: 'x'.repeat(100),
      }),
    ).toBe(true);
  });

  it('should pass for IMAGE with no imageId', () => {
    expect(validateImageIdLength({chatBubbleType: 'IMAGE'})).toBe(true);
  });

  it('should accept IMAGE with 32-char imageId', () => {
    expect(
      validateImageIdLength({
        chatBubbleType: 'IMAGE',
        imageId: 'a'.repeat(32),
      }),
    ).toBe(true);
  });

  it('should reject IMAGE with 33-char imageId', () => {
    const result = validateImageIdLength({
      chatBubbleType: 'IMAGE',
      imageId: 'a'.repeat(33),
    });
    expect(result).toBe('IMAGE 타입 imageId은 최대 32자 이하로 입력해주세요.');
  });

  it('should strip whitespace before measuring length', () => {
    // 공백 포함 40자지만 공백 제거 후 32자 — valid
    expect(
      validateImageIdLength({
        chatBubbleType: 'IMAGE',
        imageId: `${'a'.repeat(32)}        `,
      }),
    ).toBe(true);
  });
});
