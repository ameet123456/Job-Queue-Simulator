// job.js
import { JobState, assertTransition } from "./stateMachine.js";

let JOB_ID_SEQ = 1;

export function createJob(type = "email", maxAttempts = 3) {
  const now = Date.now();

  return {
    id: JOB_ID_SEQ++,
    type,
    state: JobState.PENDING,
    attempts: 0,
    maxAttempts,
    lastError: null,
    createdAt: now,
    updatedAt: now,
  };
}

function updateState(job, nextState) {
  assertTransition(job.state, nextState);

  job.state = nextState;
  job.updatedAt = Date.now();
}

/* ===== Domain Commands ===== */

export function markRunning(job) {
  updateState(job, JobState.RUNNING);
}

export function markCompleted(job) {
  updateState(job, JobState.COMPLETED);
}

export function markFailed(job, error) {
  updateState(job, JobState.FAILED);

  job.attempts += 1;
  if (job.attempts > job.maxAttempts) {
    throw new Error("Job exceeded max attempts");
  }

  job.lastError = error;
}

export function retryJob(job) {
  if (job.attempts >= job.maxAttempts) {
    throw new Error("Retry limit reached");
  }

  updateState(job, JobState.PENDING);
}
