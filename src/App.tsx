import { useEffect } from "react";
import { useDataStore } from "./stores/useDataStore";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Task1 from "./pages/Task1";
import Task2 from "./pages/Task2";

export default function App() {
  const generateInitialData = useDataStore((s) => s.generateInitialData);
  useEffect(() => {
    generateInitialData(5000);
  }, [generateInitialData]);

  return (
    <Routes>
      <Route path={""} element={<Home />} />
      <Route path={"task-1"} element={<Task1 />} />
      <Route path={"task-2"} element={<Task2 />} />

      <Route path="*" element={<Navigate to={""} replace />} />
    </Routes>
  );
}
