# Provider Strategy

## Provider A

Real Groq implementation using `groq-sdk`.

## Provider B

Fallback adapter for testing and future integration.

## Provider C

Tertiary fallback adapter for testing and future integration.

## Why adapters?

Application code calls:

```js
provider.generate(request);
```

It does not need to know the provider SDK or HTTP details.

This reduces provider-specific coupling and makes migration easier.
