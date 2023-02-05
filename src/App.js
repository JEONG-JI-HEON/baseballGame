/* eslint-disable */ /* eslint 비활성화 */

import React, { useState, useEffect, useRef } from "react";
import Lottie from "lottie-react";
import "./App.css";
import logo from "./logo.svg";
import loadingAnimation from "./assets/loading.json";
import heartAnimation from "./assets/heart.json";

const App = () => {
  /** 각자 다른 숫자 생성함수 */
  function randomNumber(n) {
    const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    let result = "";
    for (let i = 0; i < n; i++) {
      const randomIndex = Math.floor(Math.random() * numbers.length);
      result += numbers.splice(randomIndex, 1);
    }
    return result;
  }

  const [answer, setAnswer] = useState(randomNumber(4));
  const [guess, setGuess] = useState("");
  const [strikes, setStrikes] = useState(0);
  const [balls, setBalls] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [error, setError] = useState("");
  const [lives, setLives] = useState(10);
  const [message, setMessage] = useState("");
  const [incorrectAnswers, setIncorrectAnswers] = useState([]);
  const [gameStart, setGameStart] = useState(true);

  const inputRef = useRef(null);
  /** 시작시 숫자를 정하는 중입니다 를 출력하는 함수 */

  const handleStart = () => {
    setGameStart(false);
    setMessage("숫자를 정하는 중입니다.");
    setTimeout(() => {
      setMessage("");
    }, 5000);
    setAnswer(randomNumber(4));
    setGuess("");
    setStrikes(0);
    setBalls(0);
    setGameOver(false);
    setError("");
    setLives(10);
    setIncorrectAnswers([]);
  };

  const handleReset = () => {
    setMessage("숫자를 정하는 중입니다.");
    setTimeout(() => {
      setMessage("");
    }, 5000);
    setAnswer(randomNumber(4));
    setGuess("");
    setStrikes(0);
    setBalls(0);
    setGameOver(false);
    setError("");
    setLives(10);
    setIncorrectAnswers([]);
  };

  /** input에 정답을 입력하고 제출시 답 보여주는 함수 */
  const handleGuess = (e) => {
    e.preventDefault();

    /** 각각 다른 숫자를 입력하지 않았을때 */
    if (new Set(guess).size !== guess.length) {
      setError("서로 다른 숫자를 입력하세요!!");
      setGuess("");
      inputRef.current.focus();
      return;
    }

    if (guess.length < 4) {
      setError("4자리의 숫자를 입력하세요!");
      setGuess("");
      inputRef.current.focus();
      return;
    }

    inputRef.current.focus();
    setError("");

    let newStrikes = 0;
    let newBalls = 0;

    for (let i = 0; i < answer.length; i++) {
      if (guess[i] === answer[i]) {
        newStrikes += 1;
      } else if (answer.includes(guess[i])) {
        newBalls += 1;
      }
    }

    /** 오답시 목숨 -1 */
    if (lives > 0) {
      setLives((prevLives) => prevLives - 1);
    }

    /** 오답 기록 남길때 */
    if (newStrikes !== answer.length && newBalls !== answer.length) {
      setIncorrectAnswers((prevIncorrectAnswers) => [
        ...prevIncorrectAnswers,
        { answer: guess, strikes: newStrikes, balls: newBalls },
      ]);
    }

    setStrikes(newStrikes);
    setBalls(newBalls);

    /** 정답일시 */
    if (newStrikes === answer.length) {
      setGameOver(true);
    }

    setGuess("");
  };

  return (
    <div className="App">
      {gameStart ? (
        <div className="mainSection">
          <h2 className="title">숫자 야구</h2>
          <div>
            <p>Rules</p>
            <p>랜덤으로 정해진 서로 다른 4자리의 숫자를 맞추는 게임입니다.</p>
            <p>같은 숫자는 입력할 수 없습니다. (ex. 1111, 2642)</p>
            <p>목숨 10개 안에 숫자를 맞춘다면 승리!</p>
          </div>
          <button className="start" onClick={handleStart}>
            게임 시작!
          </button>
        </div>
      ) : (
        <>
          {message ? (
            <div className="mainSection">
              <Lottie
                animationData={loadingAnimation}
                className="loadingLotties"
              />
              <div className="loadingMent">{message}</div>
            </div>
          ) : (
            <>
              {gameOver ? (
                <div className="mainSection">
                  <div className="gameOverMent">Congratulations!</div>
                  <div>정답: {answer}</div>
                  <div>
                    <button className="reset" onClick={handleReset}>
                      다시 할래?
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {lives === 0 ? (
                    <div className="mainSection">
                      <div className="gameOverMent">game over</div>
                      <div className="gameOverAnswer">정답: {answer}</div>
                      <div>
                        <button className="reset" onClick={handleReset}>
                          다시 할래?
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="mainSection">
                        <div className="incorrectAnswers">
                          {incorrectAnswers.map((incorrectAnswer, index) => (
                            <div className="incorrectAnswer-wrap" key={index}>
                              <span>{incorrectAnswer.answer} → </span>
                              {incorrectAnswer.strikes === 0 &&
                              incorrectAnswer.balls === 0 ? (
                                <div>
                                  <span>아웃!</span>
                                </div>
                              ) : (
                                <div>
                                  <span>
                                    스트라이크 : {incorrectAnswer.strikes}{" "}
                                  </span>
                                  <span>볼 : {incorrectAnswer.balls}</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        <div className="heartLotties-wrap">
                          {Array(lives)
                            .fill()
                            .map((_, index) => (
                              <Lottie
                                key={index}
                                animationData={heartAnimation}
                                className="heartLotties"
                              />
                            ))}
                        </div>
                        <form className="input-wrap" onSubmit={handleGuess}>
                          <input
                            className="answer"
                            type="text"
                            ref={inputRef}
                            value={guess}
                            pattern="[0-9]*"
                            maxLength="4"
                            onChange={(e) => setGuess(e.target.value)}
                          />
                          <button className="submit" type="submit">
                            도전!
                          </button>
                        </form>
                        {error && <div className="error-wrap">{error}</div>}
                      </div>
                    </>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default App;
