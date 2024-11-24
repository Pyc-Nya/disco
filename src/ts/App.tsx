import { observer } from "mobx-react-lite";
import CountStore from "./stores/CountStore";
import { useState, useEffect } from "react";
import { commands } from "../bindings";

function App() {
  const [saveText, setSaveText] = useState<string>("Save result!");
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const loadResult = async () => {
      try {
        const res = await commands.readResult();
        if (res.status == "ok") {
            CountStore.setCount(res.data);
        }
        else {
            console.error("Ошибка загрузки данных:", res.error);
        }
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

      if ((await commands.saveResult(CountStore.count)).status != "ok") {
        console.error("Ошибка сохранения");
        return;
      }

      setSaveText("Saved!");
      const id = setTimeout(() => {
        setSaveText("Save result!");
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
