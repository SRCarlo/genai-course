export class ChatService {
  constructor(ragService) {
    this.ragService = ragService;
  }

  async ask({ question, tenantId, userId }) {
    return this.ragService.answer(question, {
      tenantId,
      userId,
    });
  }
}
