export function JobCard({ job }) {
  return (
    <div className={`job ${job.state.toLowerCase()}`}>
      <div><strong>Job #{job.id}</strong></div>
      <div>Failures: {job.attempts}/{job.maxAttempts}</div>
      {job.lastError && <div>Error: {job.lastError}</div>}
    </div>
  );
}
