import {Config, Context, Effect, Layer} from 'effect';
import CashService from '@/services/cash/cashService';
import IamService from '@/services/iam/iamService';
import KakaoChannelService from '@/services/kakao/channels/kakaoChannelService';
import KakaoTemplateService from '@/services/kakao/templates/kakaoTemplateService';
import MessageService from '@/services/messages/messageService';
import StorageService from '@/services/storage/storageService';

// Service Tags
export const MessageServiceTag =
  Context.GenericTag<MessageService>('MessageService');
export const KakaoChannelServiceTag = Context.GenericTag<KakaoChannelService>(
  'KakaoChannelService',
);
export const KakaoTemplateServiceTag = Context.GenericTag<KakaoTemplateService>(
  'KakaoTemplateService',
);
export const StorageServiceTag =
  Context.GenericTag<StorageService>('StorageService');
export const CashServiceTag = Context.GenericTag<CashService>('CashService');
export const IamServiceTag = Context.GenericTag<IamService>('IamService');

// Helper to create a service layer
const createServiceLayer = <S>(
  tag: Context.Tag<S, S>,
  ServiceClass: new (apiKey: string, apiSecret: string) => S,
) =>
  Layer.effect(
    tag,
    Effect.gen(function* () {
      const apiKey = yield* Config.string('API_KEY');
      const apiSecret = yield* Config.string('API_SECRET');
      return new ServiceClass(apiKey, apiSecret);
    }),
  );

// Individual Service Layers
export const MessageServiceLive = createServiceLayer(
  MessageServiceTag,
  MessageService,
);
export const KakaoChannelServiceLive = createServiceLayer(
  KakaoChannelServiceTag,
  KakaoChannelService,
);
export const KakaoTemplateServiceLive = createServiceLayer(
  KakaoTemplateServiceTag,
  KakaoTemplateService,
);
export const StorageServiceLive = createServiceLayer(
  StorageServiceTag,
  StorageService,
);
export const CashServiceLive = createServiceLayer(CashServiceTag, CashService);
export const IamServiceLive = createServiceLayer(IamServiceTag, IamService);

// Combined Layer for Message Service Tests
export const MessageTestServicesLive = Layer.mergeAll(
  MessageServiceLive,
  KakaoChannelServiceLive,
  KakaoTemplateServiceLive,
  StorageServiceLive,
);

// Combined Layer for All Services
export const AllServicesLive = Layer.mergeAll(
  MessageTestServicesLive,
  CashServiceLive,
  IamServiceLive,
);
