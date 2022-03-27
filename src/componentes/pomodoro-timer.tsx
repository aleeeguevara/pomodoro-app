import React from 'react';
import { ScriptTarget } from 'typescript';
import { useInterval } from '../hooks/use-interval';
import { Button } from './button';
import { Timer } from './timer';
import { useEffect } from 'react';

interface Props {
  pomodoroTime: number;
  shortRestTime: number;
  longRestTime: number;
  cycles: number;
}
export function PomodoroTimer(props: Props): JSX.Element {
  const [mainTime, setMainTime] = React.useState(props.pomodoroTime);
  const [timeCounter, setTimeCounter] = React.useState(false);
  const [working, setWorking] = React.useState(false);
  const [resting, setResting] = React.useState(false);

  useEffect(() => {
    if (working) document.body.classList.add('working');
    if (resting) document.body.classList.remove('working');
  }, [working]);

  useInterval(
    () => {
      setMainTime(mainTime - 1);
    },
    timeCounter ? 1000 : null,
  );
  const configureWork = () => {
    setTimeCounter(true);
    setWorking(true);
    setResting(false);
    setMainTime(props.pomodoroTime);
  };
  const configureRest = (long: boolean) => {
    setTimeCounter(true);
    setWorking(false);
    setResting(true);
    if (long) setMainTime(props.longRestTime);
    else setMainTime(props.shortRestTime);
  };
  return (
    <div className="pomodoro">
      <h2>You are: working </h2>
      <Timer mainTime={mainTime} />

      <div className="controls">
        <Button
          className={resting ? 'hidden' : ''}
          text="Start"
          onClick={() => configureWork()}
        />
        <Button
          className={!working && !resting ? 'hidden' : ''}
          text="Rest"
          onClick={() => configureRest(false)}
        />
        <Button
          className={!working && !resting ? 'hidden' : ''}
          text={timeCounter ? 'Pause' : 'Play'}
          onClick={() => setTimeCounter(!timeCounter)}
        />
      </div>
      <div className="details">
        <p>testing: the time you need is the time you have</p>
        <p>testing: the time you need is the time you have</p>
        <p>testing: the time you need is the time you have</p>
        <p>testing: the time you need is the time you have</p>
        <p>testing: the time you need is the time you have</p>
      </div>
    </div>
  );
}
