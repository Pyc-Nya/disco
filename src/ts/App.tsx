import { observer } from "mobx-react-lite";
import CountStore from "./stores/CountStore";
import { invoke } from "@tauri-apps/api/core";
import { useState, useEffect } from "react";

function App() {
  const [saveText, setsaveText] = useState<string>("Save result!");
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const loadResult = async () => {
      try {
        const result: number = await invoke("read_result");
        CountStore.setCount(result);
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
      }
    };

    loadResult();
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  const saveResult = async () => {
    try {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      await invoke("save_result", { result: CountStore.count });

      setsaveText("Saved!");
      const id = setTimeout(() => {
        setsaveText("Save result!");
      }, 500);
      setTimeoutId(id); 
    } catch (error) {
      console.error("Ошибка сохранения:", error);
    }
  };

  return (
    <div className="container">
      <div className="title">You clicked {CountStore.count} times.</div>
      <div className="buttons">
        <div className="button" onClick={CountStore.increment}>+1</div>
        <div className="button" onClick={CountStore.decrement}>-1</div>
      </div>
      <div className="save button" onClick={saveResult}>{saveText}</div>
    </div>
  );
}

export default observer(App);
