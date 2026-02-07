// queue.js
import { JobState } from "./stateMachine.js";

export class JobQueue {
  constructor() {
    this.jobs = [];
  }

  enqueue(job) {
    this.jobs.push(job);
  }

  getNextPendingJob() {
    return this.jobs
      .filter(job => job.state === JobState.PENDING)
      .sort((a, b) => a.createdAt - b.createdAt)[0] || null;
  }

  getJobsByState(state) {
    return this.jobs.filter(job => job.state === state);
  }

  getAllJobs() {
    return [...this.jobs];
  }
}