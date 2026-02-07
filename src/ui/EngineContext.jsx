import { createContext, useContext, useEffect, useRef, useState } from "react";
import { JobQueue } from "../domain/queue.js";
import { Worker } from "../domain/worker.js";

const EngineContext = createContext(null);

export function EngineProvider({ children }) {
  const engineRef = useRef(null);
  const [jobs, setJobs] = useState([]);
  const [workerState, setWorkerState] = useState("IDLE");

  useEffect(() => {
    if (!engineRef.current) {
      const queue = new JobQueue();
      const worker = new Worker(queue);

      worker.subscribe(() => {
        // 🔥 SNAPSHOT HERE (this is the key)
        setJobs([...queue.getAllJobs()]);
        setWorkerState(worker.state);
      });

      engineRef.current = { queue, worker };

      // initial snapshot
      setJobs([]);
      setWorkerState(worker.state);
    }
  }, []);

  if (!engineRef.current) {
    return <div>Initializing engine…</div>;
  }

  return (
    <EngineContext.Provider
      value={{
        worker: engineRef.current.worker,
        jobs,
        workerState,
      }}
    >
      {children}
    </EngineContext.Provider>
  );
}

export function useEngine() {
  const ctx = useContext(EngineContext);
  if (!ctx) throw new Error("useEngine outside provider");
  return ctx;
}
