import { useEngine } from "./EngineContext";
import { JobState } from "../domain/stateMachine.js";
import { Column } from "./Column";

export function Board() {
  const { jobs } = useEngine(); // 🔥 SNAPSHOT, NOT QUEUE

  return (
    <div className="board">
      {Object.values(JobState).map(state => (
        <Column
          key={state}
          title={state}
          jobs={jobs.filter(job => job.state === state)}
        />
      ))}
    </div>
  );
}
