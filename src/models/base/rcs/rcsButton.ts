import {Schema} from 'effect';

/**
 * @name "RCS 버튼타입"
 */
export type RcsButtonType =
  | 'WL' // (웹링크)
  | 'ML' // (지도[좌표])
  | 'MQ' // (지도[쿼리])
  | 'MR' // (위치공유)
  | 'CA' // (캘린더생성)
  | 'CL' // (복사)
  | 'DL' // (전화걸기)
  | 'MS'; // (메시지보내기)

export const rcsButtonTypeSchema = Schema.Literal(
  'WL',
  'ML',
  'MQ',
  'MR',
  'CA',
  'CL',
  'DL',
  'MS',
);

export type RcsWebButton = {
  buttonName: string;
  buttonType: Extract<RcsButtonType, 'WL'>;
  link: string;
};

export type RcsMapButton = {
  buttonName: string;
  buttonType: Extract<RcsButtonType, 'ML'>;
  latitude: string;
  longitude: string;
};

export type RcsDefaultButton = {
  buttonName: string;
  buttonType: Exclude<RcsButtonType, 'WL'>;
  link: string;
};

export type RcsButton = RcsWebButton | RcsMapButton | RcsDefaultButton;

export const rcsWebButtonSchema = Schema.Struct({
  buttonName: Schema.String,
  buttonType: Schema.Literal('WL'),
  link: Schema.String,
});

export const rcsMapButtonSchema = Schema.Struct({
  buttonName: Schema.String,
  buttonType: Schema.Literal('ML'),
  latitude: Schema.String,
  longitude: Schema.String,
});

export const rcsDefaultButtonSchema = Schema.Struct({
  buttonName: Schema.String,
  buttonType: Schema.Literal('MQ', 'MR', 'CA', 'CL', 'DL', 'MS'),
  link: Schema.String,
});

export const rcsButtonSchema = Schema.Union(
  rcsWebButtonSchema,
  rcsMapButtonSchema,
  rcsDefaultButtonSchema,
);

export type RcsButtonSchema = Schema.Schema.Type<typeof rcsButtonSchema>;
