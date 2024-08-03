import { useEffect, useRef, useState } from "react";
import { Modal, Info, Buttons } from "../components/main/index";

export default function MainPage() {
  const tempTask =
    "While eating at a restaurant is an enjoyable and convenient occasional";

  const [time, setTime] = useState(0); //timer
  const [userInput, setUserInput] = useState([""]); //userInput
  const [task, setTask] = useState(tempTask); // task
  const [missCount, setMissCount] = useState(0); //Miss
  const [isActive, setIsActive] = useState(true); // Active
  const [result, setResult] = useState(0); // result
  const [percentMiss, setPercentMiss] = useState(0); // percentMiss
  const [isModalOpen, setIsModalOpen] = useState(false); //IsOpenModal
  const inputRef = useRef(null); // zalupi

  //input
  const changeUserInput = (event) => {
    if (isActive) {
      const value = event.target.value;
      setUserInput(value);
      let errorCount = 0;
      for (let i = 0; i < value.length; i++) {
        if (value[i] !== task[i]) {
          errorCount += 1;
        }
      }
      setMissCount(errorCount);
    }
  };

  //color symbol
  const getInputClass = (userInput, task) => {
    const chars = task.split("");
    return chars.map((char, index) => {
      let className = "";
      if (index < userInput.length) {
        if (userInput[index] === char) {
          className = "text-zinc-500";
        } else {
          className = "text-red-500";
        }
        if (userInput[0] === "") {
          className = "text-zinc-200";
        }
      }
      return (
        <span key={index} className={className}>
          {char}
        </span>
      );
    });
  };

  //timer
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

  //button stop
  const handleStop = () => {
    isActive ? setIsActive(false) : setIsActive(true);
    setTime(0);
    setMissCount(0);
    setUserInput("");
  };

  //button reset
  const handleReset = () => {
    if (isActive) {
      setTime(0);
      setMissCount(0);
      setUserInput("");
    }
  };

  // button modal
  const handelOpenModal = () => {
    if (isActive) {
      isActive ? setIsActive(false) : setIsActive(true);
      setIsModalOpen(true);
      const timeInMinute = time / 60;
      if (userInput.length !== 0) {
        setResult(Math.round((userInput.length - missCount) / timeInMinute));
        setMissCount(Math.round((missCount * 100) / userInput.length));
      } else {
        setResult(0);
        setMissCount(0);
      }
    }
    setTime(time);
    setUserInput("");
  };
  // button close Modal
  const handleCloseModal = () => setIsModalOpen(false);

  // 2 zalupi
  const handleKeyDown = (event) => {
    const badKeys = ["Backspace", "Delete", "Control"];
    if (badKeys.includes(event.key)) {
      event.preventDefault();
    }
  };

  const targetClick = () => {
    if (inputRef.current) {
      inputRef.current.setSelectionRange(userInput.length, userInput.length);
    }
  };

  return (
    <div className="bg-neutral-800 min-h-screen flex flex-col items-center p-5">
      <Info
        missCount={missCount}
        time={time}
        userInput={userInput}
        task={task}
        getInputClass={getInputClass}
      />
      <textarea
        className="w-[1000px] font-mono tracking-tight text-2xl/[50px] p-4 bg-neutral-800 text-zinc-300 rounded-lg h-80 resize-none border border-white"
        onChange={changeUserInput}
        type="text"
        onKeyDown={handleKeyDown}
        onClick={targetClick}
        ref={inputRef}
        value={userInput}
        getInputClass
      />
      <Buttons
        isActive={isActive}
        handleReset={handleReset}
        handleStop={handleStop}
        openModal={handelOpenModal}
      />
      <Modal
        onClose={handleCloseModal}
        isOpen={isModalOpen}
        result={result}
        missCount={missCount}
        time={time}
      />
    </div>
  );
}
