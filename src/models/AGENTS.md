# Models Layer

## OVERVIEW

Three-layer model architecture using Effect Schema for runtime validation.

## STRUCTURE

```
models/
├── base/                       # Core domain entities
│   ├── messages/message.ts     # MessageType, messageSchema
│   ├── kakao/
│   │   ├── kakaoOption.ts      # BMS validation, VariableValidationError
│   │   ├── kakaoButton.ts      # Discriminated union (8 types)
│   │   └── bms/                # 7 BMS chat bubble schemas
│   ├── rcs/                    # RCS options and buttons
│   └── naver/                  # Naver Talk Talk
├── requests/                   # Input → API payload transformation
│   ├── messages/               # Send, group, query requests
│   ├── kakao/                  # Channel/template operations
│   ├── iam/                    # Block list management
│   └── common/datePayload.ts   # Shared date range type
└── responses/                  # API response types (mostly type-only)
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Add message type | `base/messages/message.ts` | Add to MessageType union |
| Add BMS type | `base/kakao/bms/` + `kakaoOption.ts` | Update BMS_REQUIRED_FIELDS |
| Add button variant | `base/kakao/kakaoButton.ts` | Discriminated union pattern |
| Add request validation | `requests/` domain folder | Use Schema.transform |
| Add response type | `responses/` domain folder | Type-only usually sufficient |

## CONVENTIONS

**Type + Schema + Class Pattern**:
```typescript
// 1. Type
export type MyType = Schema.Schema.Type<typeof mySchema>;

// 2. Schema
export const mySchema = Schema.Struct({
  field: Schema.String,
  optional: Schema.optional(Schema.Number),
});

// 3. Class (optional, for runtime behavior)
export class MyClass {
  constructor(parameter: MyType) { /* ... */ }
}
```

**Discriminated Union**:
```typescript
export const buttonSchema = Schema.Union(
  webButtonSchema,      // { linkType: 'WL', ... }
  appButtonSchema,      // { linkType: 'AL', ... }
);
```

**Custom Validation**:
```typescript
Schema.String.pipe(
  Schema.filter(isValid, { message: () => 'Error message' }),
);
```

**Transform with Validation**:
```typescript
Schema.transform(Schema.String, Schema.String, {
  decode: input => normalize(input),
  encode: output => output,
});
```

## ANTI-PATTERNS

- Don't skip schema validation for user input
- Don't use interfaces when schema needed — use Schema.Struct
- Don't duplicate validation logic — compose schemas
- Don't create class without schema — validate first
