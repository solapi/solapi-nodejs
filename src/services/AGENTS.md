# Services Layer

## OVERVIEW

Domain services extending `DefaultService` base class. Each service handles one API domain.

## STRUCTURE

```
services/
├── defaultService.ts           # Base class: auth, HTTP abstraction
├── messages/
│   ├── messageService.ts       # send(), sendOne(), getMessages()
│   └── groupService.ts         # Group operations (create, add, send)
├── kakao/
│   ├── channels/               # Channel CRUD
│   └── templates/              # Template CRUD with Effect.all
├── cash/cashService.ts         # getBalance()
├── iam/iamService.ts           # Block lists, 080 rejection
└── storage/storageService.ts   # File uploads
```

## WHERE TO LOOK

| Task | File | Notes |
|------|------|-------|
| Add new service | Create in domain folder | Extend DefaultService |
| Modify HTTP behavior | `defaultService.ts` | Base URL, auth handling |
| Complex Effect logic | `messageService.ts` | Reference for Effect.gen pattern |
| Parallel processing | `kakaoTemplateService.ts` | Effect.all example |

## CONVENTIONS

**Service Pattern**:
```typescript
export default class MyService extends DefaultService {
  constructor(apiKey: string, apiSecret: string) {
    super(apiKey, apiSecret);
  }
  
  async myMethod(data: Request): Promise<Response> {
    return this.request<Request, Response>({
      httpMethod: 'POST',
      url: 'my/endpoint',
      body: data,
    });
  }
}
```

**Effect.gen Pattern** (for complex logic):
```typescript
async send(messages: Request): Promise<Response> {
  const effect = Effect.gen(function* (_) {
    const validated = yield* _(validateSchema(messages));
    const response = yield* _(Effect.promise(() => this.request(...)));
    return response;
  });
  return runSafePromise(effect);
}
```

## ANTI-PATTERNS

- Don't call `defaultFetcher` directly — use `this.request()`
- Don't bypass schema validation — always validate input
- Don't mix Effect and Promise styles — pick one per method
