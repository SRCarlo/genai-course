const allowedData = {
  PUBLIC: true,
  INTERNAL: true,
  CONFIDENTIAL: false,
  RESTRICTED: false
};

export function canProcessData(classification) {
  return Boolean(allowedData[classification]);
}

export function getDataPolicy() {
  return { ...allowedData };
}
