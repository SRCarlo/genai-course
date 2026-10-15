export function createDemoAuth({ enabled = false } = {}) {
  return function demoAuth(req, _res, next) {
    if (!enabled) {
      req.auth = null;
      return next();
    }

    // Local learning only. Never enable this identity-header auth in a deployed environment.
    const tenantId = req.get('x-demo-tenant-id');
    const userId = req.get('x-demo-user-id') || 'user_demo';
    req.auth = tenantId ? { tenantId, userId, role: 'member' } : null;
    return next();
  };
}
