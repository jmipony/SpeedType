import { useEffect, useState } from "react";

export default function MainPage() {
  const tempTask =
    "While eating at a restaurant is an enjoyable and convenient occasional";

  const start = 0;
  const [time, setTime] = useState(start);
  const [userInput, setUserInput] = useState("");
  const [task, setTask] = useState(tempTask);
  const [info, setInfo] = useState();
  const [isActive, setIsActive] = useState(true);

  const changeUserInput = (event) => {
    setUserInput(event.target.value);
  };

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setTime((t) => t + 1);
      }, 1000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isActive]);

  const handleResult = () => {
    setIsActive(false);
    setTime(0);
  };

  return (
    <div className="flex mx-auto flex-col items-center my-10 ">
      <p>{time}</p>
      <p className="w-[800px] text-2xl/[50px]">{task}</p>
      <input
        className="border-2 border-indigo-600 w-[800px]"
        onChange={changeUserInput}
        type="text"
      ></input>
      <button onClick={handleResult} className="bg-indigo-300 ">
        Result
      </button>
    </div>
  );
}
