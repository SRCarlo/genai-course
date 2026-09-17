const jobs = [];

export const queue = {
  async add(type, data) {
    const job = {
      id: `job-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,

      type,

      data,

      status: "queued",

      createdAt: new Date().toISOString(),
    };

    jobs.push(job);

    return job;
  },

  async getJobs() {
    return jobs;
  },
};
