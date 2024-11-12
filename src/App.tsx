
import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";

interface ProcessInfo {
  id: string;
  name: string;
}
 
function App() {
  const [osName, setOsName] = useState<string>("");
  const [processes, setProcesses] = useState<ProcessInfo[]>([]);
 
  useState(() => {
    async function fetchData() {
      const os = await invoke<string>("os_name");
      const processList = await invoke<ProcessInfo[]>("list_processes");
      setOsName(os);
      setProcesses(processList);
    }
    fetchData();
  });

  async function killProcess(id: string) {
    const result = await invoke<boolean>("kill_process", { id });
    if (result) {
      setProcesses((prev) => prev.filter((p) => p.id !== id));
    }
  }

  return (
    <main className="flex flex-col items-center justify-center">
      <p className="text-xl bg-slate-100 p-4 gap-4 m-4 rounded-md">
        OS: {osName} Process:{processes.length}
      </p>
      <div className="grid grid-cols-4 gap-4">
        {processes.map((process) => (
          <div key={process.id} className="bg-slate-100 p-4 rounded-md">
            <p className="text-lg">{process.name}</p>
            <p className="text-sm">ID: {process.id}</p>
            <button onClick={() => killProcess(process.id)} className="bg-red-500 text-white p-2 rounded-md">Kill</button>
          </div>
        ))}
      </div>
    </main>
  );
}

export default App;
