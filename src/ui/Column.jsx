import { useEngine } from "./EngineContext";
import { JobState } from "../domain/stateMachine.js";

export function Column({ title, jobs }) {
  const { worker } = useEngine();

  return (
    <div className={`column ${title.toLowerCase()}`}>
      <h3>
        {title} <span className="count">({jobs.length})</span>
      </h3>

      {jobs.map(job => (
        <div key={job.id} className={`job ${job.state.toLowerCase()}`}>
          <div className="job-title">📧 Email #{job.id}</div>

          <div className="job-meta">
            Failures: {job.attempts}/{job.maxAttempts}
          </div>

          {job.lastError && (
            <div className="job-error">❌ {job.lastError}</div>
          )}

          {job.state === JobState.RUNNING && (
            <div className="spinner">⏳ Sending…</div>
          )}

          {job.state === JobState.FAILED && (
            <button
              className="retry-btn"
              onClick={() => worker.retryFailedJob(job.id)}
            >
              Retry
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
