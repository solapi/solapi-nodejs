export type Count = {
  total: number;
  sentTotal: number;
  sentFailed: number;
  sentSuccess: number;
  sentPending: number;
  sentReplacement: number;
  refund: number;
  registeredFailed: number;
  registeredSuccess: number;
};

type CountryChargeStatus = Record<string, number>;

export type CountForCharge = {
  sms: CountryChargeStatus;
  lms: CountryChargeStatus;
  mms: CountryChargeStatus;
  ata: CountryChargeStatus;
  cta: CountryChargeStatus;
  cti: CountryChargeStatus;
  nsa: CountryChargeStatus;
  rcs_sms: CountryChargeStatus;
  rcs_lms: CountryChargeStatus;
  rcs_mms: CountryChargeStatus;
  rcs_tpl: CountryChargeStatus;
};

export type CommonCashResponse = {
  requested: number;
  replacement: number;
  refund: number;
  sum: number;
};

export type MessageTypeRecord = {
  sms: number;
  lms: number;
  mms: number;
  ata: number;
  cta: number;
  cti: number;
  nsa: number;
  rcs_sms: number;
  rcs_lms: number;
  rcs_mms: number;
  rcs_tpl: number;
};

export type App = {
  profit: MessageTypeRecord;
  appId: string | null | undefined;
};

export type Log = Array<object>;

export type GroupId = string;

export type Group = {
  count: {
    total: number;
    sentTotal: number;
    sentFailed: number;
    sentSuccess: number;
    sentPending: number;
    sentReplacement: number;
    refund: number;
    registeredFailed: number;
    registeredSuccess: number;
  };
  balance: CommonCashResponse;
  point: CommonCashResponse;
  app: App;
  sdkVersion: string;
  osPlatform: string;
  log: Log;
  status: string;
  scheduledDate?: string;
  dateSent?: string;
  dateCompleted?: string;
  isRefunded: boolean;
  groupId: GroupId;
  accountId: string;
  countForCharge: CountForCharge;
  dateCreated: string;
  dateUpdated: string;
};

export type HandleKey = string;

export type Black = {
  handleKey: HandleKey;
  type: 'DENIAL';
  senderNumber: string;
  recipientNumber: string
  dateCreated: string;
  dateUpdated: string
}

export type BlockGroup = {
  blockGroupId: string;
  accountId: string;
  status: 'INACTIVE' | 'ACTIVE';
  name: string;
  useAll: boolean;
  senderNumbers: string[]
  dateCreated: string;
  dateUpdated: string;
}

export type BlockNumber = {
  blockNumberId: string;
  accountId: string;
  memo: string;
  phoneNumber: string;
  blockGroupIds: string[];
  dateCreated: string;
  dateUpdated: string;
};

/**
 * @description 검색 조건 파라미터
 * @see https://docs.solapi.com/api-reference/overview#operator
 */
export type OperatorType =
  | 'eq'
  | 'gte'
  | 'lte'
  | 'ne'
  | 'in'
  | 'like'
  | 'gt'
  | 'lt';

/**
 * @description 검색 조건 파라미터
 * @see https://docs.solapi.com/api-reference/overview#operator
 */
export type DateOperatorType = 'eq' | 'gte' | 'lte' | 'gt' | 'lt';
