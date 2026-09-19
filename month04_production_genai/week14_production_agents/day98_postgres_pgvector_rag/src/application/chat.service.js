export class ChatService {
  constructor({ ragService }) {
    this.ragService = ragService;
  }

  async answer({ question, tenantId }) {
    return this.ragService.answer({
      question,
      tenantId
    });
  }
}
