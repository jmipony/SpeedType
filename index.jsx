import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import {
  openModal,
  handleReset,
  handleStop,
} from "../components/main/buttons-logic";

export default function MainPage() {
  const tempTask =
    "While eating at a restaurant is an enjoyable and convenient occasional";

  const [time, setTime] = useState(0);
  const [userInput, setUserInput] = useState([""]);
  const [task, setTask] = useState(tempTask);
  const [missCount, setMissCount] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const inputRef = useRef(null);
  const [result, setResult] = useState(0);
  const [percentMiss, setPercentMiss] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showTime, setShowTime] = useState(0);

  const openModal = () => {
    if (isActive) {
      isActive ? setIsActive(false) : setIsActive(true);
      setShowTime(time);
      setTime(0);
      setIsModalOpen(true);
      const timeInMinute = time / 60;
      if (userInput.length !== 0) {
        setResult(Math.round((userInput.length - missCount) / timeInMinute));
        setPercentMiss(Math.round((missCount * 100) / userInput.length));
      } else {
        setResult(0);
        setPercentMiss(0);
      }
    }

    setMissCount(0);
    setUserInput("");
  };
  const closeModal = () => setIsModalOpen(false);

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

  const handleReset = () => {
    if (isActive) {
      setTime(0);
      setMissCount(0);
      setUserInput("");
    }
  };

  const handleStop = () => {
    isActive ? setIsActive(false) : setIsActive(true);
    setTime(0);
    setMissCount(0);
    setUserInput("");
  };

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
      ></Info>
      <textarea
        className="w-[1000px] font-mono tracking-tight text-2xl/[50px] p-4 bg-neutral-800 text-zinc-300 rounded-lg h-80 resize-none border border-white"
        onChange={changeUserInput}
        type="text"
        onKeyDown={handleKeyDown}
        onClick={targetClick}
        ref={inputRef}
        value={userInput}
        getInputClass
      ></textarea>
      <Buttons
        handleReset={handleReset}
        isActive={isActive}
        handleStop={handleStop}
        openModal={openModal}
      ></Buttons>
      <Modal
        onClose={closeModal}
        isOpen={isModalOpen}
        result={result}
        percentMiss={percentMiss}
        showTime={showTime}
      ></Modal>
    </div>
  );
}

function Modal({ isOpen, onClose, result, percentMiss, showTime }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 justify-center flex items-center z-50 shadow-lg bg-black bg-opacity-25">
      <div className="bg-neutral-700 p-5 rounded-md max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-1 right-4 cursor-pointer text-zinc-200 hover:text-zinc-300 active:text-zinc-400"
        >
          x
        </button>
        <div className="mt-2">
          <p className="text-zinc-200 text-xl/[25px] p-3 px-20 tracking-wide">
            Correct SPM: {result}
          </p>
          <p className="text-zinc-200 text-xl/[25px] p-3 px-20 tracking-wide">
            Miss: {percentMiss}%
          </p>
          <p className="text-zinc-200 text-xl/[25px] p-3 px-20 tracking-wide">
            Time: {showTime}s
          </p>
        </div>
      </div>
    </div>
  );
}

function Buttons({ handleReset, isActive, handleStop, openModal }) {
  return (
    <div>
      <button
        onClick={handleReset}
        className={
          isActive
            ? "text-zinc-200 hover:text-zinc-300 active:text-zinc-400 text-2xl/[50px] p-3 px-36"
            : "text-zinc-500 text-2xl/[50px] p-3 px-36"
        }
      >
        reset
      </button>
      <button
        onClick={handleStop}
        className=" text-zinc-200 hover:text-zinc-300 active:text-zinc-400 text-2xl/[50px] p-3 px-36"
      >
        {isActive ? "stop" : "start"}
      </button>
      <button
        onClick={openModal}
        className={
          isActive
            ? "text-zinc-200 hover:text-zinc-300 active:text-zinc-400 text-2xl/[50px] p-3 px-36"
            : "text-zinc-500 text-2xl/[50px] p-3 px-36"
        }
      >
        result
      </button>
    </div>
  );
}

function Info({ missCount, time, userInput, task, getInputClass }) {
  return (
    <div>
      <p className="w-[800px] text-xl/[50px] font-mono tracking-tight text-zinc-500 ">
        Miss: {missCount}
      </p>
      <p className="w-[800px] text-xl/[50px] font-mono tracking-tight text-zinc-500">
        Time: {time}
      </p>
      <p className="w-[800px] text-2xl/[50px] tracking-tight p-4 text-zinc-200">
        {getInputClass(userInput, task)}
      </p>
    </div>
  );
}
