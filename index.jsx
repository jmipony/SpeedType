import { useEffect, useRef, useState } from "react";
import { Modal, Info, Buttons, BadKeysClick } from "../components/main/index";

export default function MainPage() {
  const [time, setTime] = useState(0); //timer
  const [userInput, setUserInput] = useState([""]); //userInput
  const [task, setTask] = useState(""); // task
  const [missCount, setMissCount] = useState(0); //Miss
  const [isActive, setIsActive] = useState(true); // Active
  const [result, setResult] = useState(0); // result
  const [isModalOpen, setIsModalOpen] = useState(false); //IsOpenModal
  const [modalPercent, setModalPercent] = useState(0);
  const [modalTime, setModalTime] = useState(0);
  const inputRef = useRef(null); // zalupi

  useEffect(() => {
    const takeRes = async () => {
      try {
        const res = await fetch("https://api.quotable.io/random");
        if (!res.ok) {
          throw new Error("Network is not ok");
        }

        const data = await res.json();
        setTask(data.content);
      } catch (err) {
        setTask(`${err.message}`);
      }
    };
    takeRes();
  }, []);

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
      if (userInput.length >= task.length - 1) {
        handelOpenModal();
      }
      setMissCount(errorCount);
    }
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

  //button start/stop
  const handelStartStop = () => {
    isActive ? setIsActive(false) : setIsActive(true);
    setTime(0);
    setMissCount(0);
    setUserInput("");
    setIsModalOpen(false);
  };

  //button reset
  const handleReset = () => {
    if (isActive) {
      setTime(0);
      setMissCount(0);
      setUserInput("");
      setIsModalOpen(false);
    }
  };

  // button modal
  const handelOpenModal = () => {
    if (isActive) {
      isActive ? setIsActive(false) : setIsActive(true);
      setModalTime(time);
      setIsModalOpen(true);
      const timeInMinute = time / 60;
      if (userInput.length !== 0) {
        setResult(Math.round((userInput.length - missCount) / timeInMinute));
        setModalPercent(Math.round((missCount * 100) / userInput.length));
      } else {
        setResult(0);
        setModalPercent(0);
      }
    }
    setTime(0);
    setMissCount(0);
    setUserInput("");
  };

  // button close Modal
  const handleCloseModal = () => setIsModalOpen(false);

  // 2 zalupi
  BadKeysClick(userInput);
  return (
    <div className="bg-neutral-800 min-h-screen flex flex-col items-center p-5">
      <Info
        missCount={missCount}
        time={time}
        userInput={userInput}
        task={task}
      />
      <textarea
        className="w-[1000px] font-mono tracking-tight text-2xl/[50px] p-4 bg-neutral-800 text-zinc-300 rounded-lg h-80 resize-none border border-white invisible"
        onChange={changeUserInput}
        type="text"
        onKeyDown={BadKeysClick.handleKeyDown}
        onClick={BadKeysClick.targetClick}
        ref={inputRef}
        value={userInput}
        getInputClass
      />
      <Buttons
        isActive={isActive}
        handleReset={handleReset}
        handelStartStop={handelStartStop}
        openModal={handelOpenModal}
      />
      <Modal
        onClose={handleCloseModal}
        isOpen={isModalOpen}
        result={result}
        modalPercent={modalPercent}
        modalTime={modalTime}
        handelStartStop={handelStartStop}
        handleReset={handleReset}
      />
    </div>
  );
}
