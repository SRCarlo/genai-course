export class AuthenticationService {
  constructor({ apiKeyService, userRegistry }) {
    this.apiKeyService = apiKeyService;
    this.userRegistry = userRegistry;
  }

  authenticate(apiKey) {
    const identity = this.apiKeyService.authenticate(apiKey);
    const user = this.userRegistry.get(identity.userId);
    if (!user.active) throw new Error("User is inactive");
    return user;
  }
}
