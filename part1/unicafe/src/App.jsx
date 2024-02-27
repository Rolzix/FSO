import { useState } from "react";

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const [all, setAll] = useState(0);
  const [average, setAverage] = useState(0);
  const [positive, setPositive] = useState(0);

  const handleClick = (e) => {
    if (e.target.name === "good") {
      const newGood = good + 1;
      const newAll = all + 1;
      const newPositive = (newGood / newAll) * 100;
      setGood(newGood);
      setAll(newAll);
      setAverage((newGood * 1 + bad * -1) / newAll);
      setPositive(newPositive);
    }

    if (e.target.name === "neutral") {
      const newNeutral = neutral + 1;
      const newAll = all + 1;
      const newPositive = (good / newAll) * 100;
      setNeutral(newNeutral);
      setAll(newAll);
      setAverage((good * 1 + bad * -1) / newAll);
      setPositive(newPositive);
    }

    if (e.target.name === "bad") {
      const newBad = bad + 1;
      const newAll = all + 1;
      setBad(newBad);
      setAll(newAll);
      setAverage((good * 1 + newBad * -1) / newAll);
      setPositive((good / newAll) * 100);
    }
  };
  return (
    <div>
      <div>give feedback</div>
      <br></br>
      <button name="good" onClick={handleClick}>
        good
      </button>

      <button name="neutral" onClick={handleClick}>
        neutral
      </button>
      <button name="bad" onClick={handleClick}>
        bad
      </button>
      <br></br>
      <br></br>
      <br></br>
      <div>Statistics:</div>
      <br></br>
      <div>good {good}</div>
      <div>neutral {neutral}</div>
      <div>bad {bad}</div>
      <div>all {all}</div>
      <div>average {average}</div>
      <div>positive {positive}%</div>
    </div>
  );
};

export default App;
