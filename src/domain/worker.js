// worker.js
import {
  markRunning,
  markCompleted,
  markFailed,
  retryJob,
} from "./job.js";
import { JobState } from "./stateMachine.js";

export const WorkerState = Object.freeze({
  IDLE: "IDLE",
  RUNNING: "RUNNING",
  PAUSED: "PAUSED",
  STOPPED: "STOPPED",
});

export class Worker {
  constructor(queue, options = {}) {
    this.queue = queue;
    this.state = WorkerState.IDLE;

    this.currentJob = null;
    this.intervalId = null;

    this.pollInterval = options.pollInterval ?? 1000;
    this.failureRate = options.failureRate ?? 0.3;

    this.listeners = new Set();
    console.log("🔥 Worker created", this);
  }

  /* =====================
     Subscriptions
  ====================== */

  subscribe(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  _notify() {
    console.log("🔔 notify listeners", this.listeners.size);
    this.listeners.forEach(fn => fn());
  }

  /* =====================
     Job Commands
  ====================== */

  addJob(job) {
    console.log("➕ addJob called", job);
    this.queue.enqueue(job);
    console.log("📦 queue after enqueue", this.queue.getAllJobs());
    this._notify();
  }

  retryFailedJob(jobId) {
    const job = this.queue.getAllJobs().find(j => j.id === jobId);
    if (!job) return;
    if (job.state !== JobState.FAILED) return;

    console.log("🔁 retry job", job.id);

    job.state = JobState.PENDING;
    job.attempts = 0;
    job.lastError = null;

    // 🔥 ensure worker can pick it up
    if (this.state === WorkerState.STOPPED) {
      this.state = WorkerState.IDLE;
    }

    this._notify();
  }

  /* =====================
     Worker Controls
  ====================== */

  start() {
    if (this.state === WorkerState.RUNNING) return;

    this.state = WorkerState.RUNNING;
    this._notify();
    this._startLoop();
  }

  pause() {
    if (this.state !== WorkerState.RUNNING) return;
    this.state = WorkerState.PAUSED;
    this._notify();
  }

  resume() {
    if (this.state !== WorkerState.PAUSED) return;
    this.state = WorkerState.RUNNING;
    this._notify();
  }

  stop() {
    this.state = WorkerState.STOPPED;

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this._notify();
  }

  /* =====================
     Internal Loop
  ====================== */

  _startLoop() {
    if (this.intervalId) return;

    this.intervalId = setInterval(() => {
      this._tick();
    }, this.pollInterval);
  }

  async _tick() {
    if (this.state !== WorkerState.RUNNING) return;
    if (this.currentJob) return;

    const job = this.queue.getNextPendingJob();
    if (!job) return;

    this.currentJob = job;

    try {
      markRunning(job);
      this._notify();

      await this._execute(job);

      markCompleted(job);
      this._notify();
    } catch (err) {
      markFailed(job, err.message);
      this._notify();

      if (job.attempts < job.maxAttempts) {
        retryJob(job);
        this._notify();
      }
    } finally {
      this.currentJob = null;
    }
  }

  /* =====================
     Job Execution
  ====================== */

  _execute(job) {
    return new Promise((resolve, reject) => {
      const duration = 1000 + Math.random() * 2000;

      setTimeout(() => {
        const failed = Math.random() < this.failureRate;
        failed
          ? reject(new Error("Simulated email failure"))
          : resolve();
      }, duration);
    });
  }
}
