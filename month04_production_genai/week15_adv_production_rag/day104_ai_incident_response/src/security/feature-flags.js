const features = {
  rag: true,
  tools: true,
  externalSearch: false,
};

export function isFeatureEnabled(name) {
  if (!(name in features)) {
    throw new Error(`Unknown feature: ${name}`);
  }
  return features[name];
}

export function setFeature(name, enabled) {
  if (!(name in features)) {
    throw new Error(`Unknown feature: ${name}`);
  }
  features[name] = Boolean(enabled);
}

export function getFeatures() {
  return { ...features };
}

export function requireFeature(name) {
  if (!isFeatureEnabled(name)) {
    throw new Error(`Feature "${name}" is disabled`);
  }
}
