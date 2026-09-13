let activeRequests = 0;

const MAX_CONCURRENT_REQUESTS = 1;

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function waitForSlot() {
  while (activeRequests >= MAX_CONCURRENT_REQUESTS) {
    await sleep(250);
  }
}

export async function withRateLimit(fn) {
  await waitForSlot();

  activeRequests++;

  try {
    return await fn();
  } finally {
    activeRequests--;
  }
}
