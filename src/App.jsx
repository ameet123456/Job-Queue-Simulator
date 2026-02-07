import { EngineProvider } from "./ui/EngineContext";
import { TopBar } from "./ui/TopBar";
import { Board } from "./ui/Board";

export default function App() {
  return (
    <EngineProvider>
      <TopBar />
      <Board />
    </EngineProvider>
  );
}
