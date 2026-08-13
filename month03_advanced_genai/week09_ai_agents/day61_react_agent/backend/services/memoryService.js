const sessions =
  new Map();

export function getMemory(
  sessionId
) {
  if (!sessionId) {
    return null;
  }

  return (
    sessions.get(sessionId) ?? {
      sessionId,

      facts: [],

      previousGoals: []
    }
  );
}

export function saveMemory(
  sessionId,
  memory
) {
  if (!sessionId) {
    return;
  }

  sessions.set(
    sessionId,
    memory
  );
}

export function addMemoryFact(
  sessionId,
  fact
) {
  const memory =
    getMemory(sessionId);

  memory.facts.push(fact);

  saveMemory(
    sessionId,
    memory
  );

  return memory;
}

export function addGoalToMemory(
  sessionId,
  goal
) {
  const memory =
    getMemory(sessionId);

  memory.previousGoals.push(
    goal
  );

  saveMemory(
    sessionId,
    memory
  );

  return memory;
}