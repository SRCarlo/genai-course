import {
  getConversation,
  saveConversation,
  clearConversation,
} from "../backend/memory/memoryStore.js";

describe("Memory Store", () => {
  test("stores and retrieves messages", () => {
    const messages = [
      {
        role: "user",
        content: "Hello",
      },
    ];

    saveConversation("test-session", messages);

    expect(getConversation("test-session")).toEqual(messages);
  });

  test("isolates sessions", () => {
    saveConversation("session-a", [
      {
        role: "user",
        content: "I am Shubham",
      },
    ]);

    saveConversation("session-b", [
      {
        role: "user",
        content: "I am Carlo",
      },
    ]);

    expect(getConversation("session-a")[0].content).toBe("I am Rahul");

    expect(getConversation("session-b")[0].content).toBe("I am Priya");
  });

  test("clears conversation", () => {
    saveConversation("clear-test", [
      {
        role: "user",
        content: "Hello",
      },
    ]);

    clearConversation("clear-test");

    expect(getConversation("clear-test")).toEqual([]);
  });
});
