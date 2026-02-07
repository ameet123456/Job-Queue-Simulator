import { useEngine } from "./EngineContext";
import { createJob } from "../domain/job.js";

export function TopBar() {
  const { worker, workerState, jobs } = useEngine();

  return (
    <div className="topbar">
      <div className="brand">Job Queue Simulator</div>

      <div className="status">
        Worker: <strong>{workerState}</strong>
        <span className="pill">Jobs: {jobs.length}</span>
      </div>

      <div className="controls">
        <button onClick={() => worker.addJob(createJob("email", 3))}>
          + Add Job
        </button>

        <button disabled={workerState === "RUNNING"} onClick={() => worker.start()}>
          Start
        </button>

        <button disabled={workerState !== "RUNNING"} onClick={() => worker.pause()}>
          Pause
        </button>

        <button disabled={workerState !== "PAUSED"} onClick={() => worker.resume()}>
          Resume
        </button>

        <button onClick={() => worker.stop()}>
          Stop
        </button>
      </div>
    </div>
  );
}
