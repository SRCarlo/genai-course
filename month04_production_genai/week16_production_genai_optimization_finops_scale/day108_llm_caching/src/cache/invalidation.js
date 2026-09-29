export function createVersionedKey(namespace, version, hash) {
  return `${namespace}:${version}:${hash}`;
}

export function createNamespaceVersionKey(namespace, version, value) {
  return `${namespace}:${version}:${value}`;
}
