async function sleep(ms: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), ms);
  });
}

function reload(
  requestsPerInterval: number,
  interval: number,
  state: { lastReload: number; availableRequests: number }
): { lastReload: number; availableRequests: number } {
  const throughput = requestsPerInterval / interval;
  const now = Date.now();
  const reloadTime = now - state.lastReload;
  const reloadedRequests = reloadTime * throughput;
  const newAvalableRequests = state.availableRequests + reloadedRequests;

  return {
    ...state,
    lastReload: now,
    availableRequests: Math.min(newAvalableRequests, requestsPerInterval),
  };
}

function wait(
  requestsPerInterval: number,
  interval: number
): (requests?: number) => Promise<number> {
  const timePerRequest = interval / requestsPerInterval;

  let state = {
    lastReload: Date.now(),
    availableRequests: requestsPerInterval,
  };

  async function waitRequest(requests = 1) {
    if (requests > requestsPerInterval) {
      throw new Error(
        "Requests can not be greater than the number of requests per interval"
      );
    }

    state = reload(requestsPerInterval, interval, state);

    const requestsToWait = Math.max(0, requests - state.availableRequests);
    const wait = Math.ceil(requestsToWait * timePerRequest);

    state.availableRequests -= requests;
    await sleep(wait);
    return wait;
  }

  return waitRequest;
}

export { wait };
