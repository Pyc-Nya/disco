import { useEffect, useState } from "react";

const App = () => {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await window.electron.invoke('read-count');
        if (data) {
          const value = parseInt(data);
          if (isNaN(value)) {
            setCount(0);
            return;
          }
          setCount(value);
        }
      } catch (error) {
        console.error('Failed to fetch file data:', error);
      }
    };
    fetchData();
  }, []);

  const handleClick = () => {
    const newCount = count + 1;
    setCount(newCount);
    window.electron.send('save-count', newCount);
  };

  return (
    <div className="container">
      <div onClick={handleClick} className="button">
        Clicked {count} times
      </div>
    </div>
  );
};

export default App;
