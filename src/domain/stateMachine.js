// stateMachine.js

export const JobState = Object.freeze({
  PENDING: "PENDING",
  RUNNING: "RUNNING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
});

const allowedTransitions = {
  [JobState.PENDING]: [JobState.RUNNING],
  [JobState.RUNNING]: [JobState.COMPLETED, JobState.FAILED],
  [JobState.FAILED]: [JobState.PENDING],
  [JobState.COMPLETED]: [],
};

export function assertTransition(from, to) {
  const allowed = allowedTransitions[from] || [];
  if (!allowed.includes(to)) {
    throw new Error(`Invalid state transition: ${from} → ${to}`);
  }
}
