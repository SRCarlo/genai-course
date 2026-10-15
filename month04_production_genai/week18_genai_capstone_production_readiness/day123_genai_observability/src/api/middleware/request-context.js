import { randomUUID } from 'node:crypto';

export function requestContext(req, res, next) {
  const incoming = req.get('x-request-id');
  const requestId =
    typeof incoming === 'string' && /^[a-zA-Z0-9._:-]{1,100}$/.test(incoming)
      ? incoming
      : randomUUID();
  req.requestId = requestId;
  res.setHeader('x-request-id', requestId);
  next();
}
