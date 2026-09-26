const systems = [];

export function registerAISystem(system) {
  const record = {
    ...system,
    registeredAt: new Date().toISOString()
  };

  systems.push(record);
  return record;
}

export function getAISystems() {
  return [...systems];
}

export function getAISystem(systemId) {
  return systems.find((system) => system.systemId === systemId);
}
