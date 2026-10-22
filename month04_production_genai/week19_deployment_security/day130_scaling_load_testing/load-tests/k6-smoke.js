import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  vus: 2,
  duration: "20s",
  thresholds: {
    http_req_failed: ["rate<0.05"],
    http_req_duration: ["p(95)<1000"],
  },
};

export default function () {
  const baseUrl = __ENV.BASE_URL || "http://localhost:3000";

  const response = http.get(`${baseUrl}/health/live`);

  check(response, {
    "status is 200": (r) => r.status === 200,
  });

  sleep(1);
}
