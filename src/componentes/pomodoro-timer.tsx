import React, { useCallback, useEffect, useState } from 'react';
import { useInterval } from '../hooks/use-interval';
import { Button } from './button';
import { Timer } from './timer';
import { secondsToMinutes } from '../utils/seconds-to-minutes';
import { secondsToTime } from '../utils/seconds-to-time';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const bellStart = require('../sounds/bell-start.mp3');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bellFinish = require('../sounds/bell-finish.mp3');

const audioStartWorking: HTMLAudioElement = new Audio(bellStart);
const audioStopWorking: HTMLAudioElement = new Audio(bellFinish);
interface Props {
  pomodoroTime: number;
  shortRestTime: number;
  longRestTime: number;
  cycles: number;
}
export function PomodoroTimer(props: Props): JSX.Element {
  const [mainTime, setMainTime] = useState(props.pomodoroTime);
  const [timeCounter, setTimeCounter] = useState(false);
  const [working, setWorking] = useState(false);
  const [resting, setResting] = useState(false);
  const [cyclesManager, setCyclesManager] = useState(
    new Array(props.cycles - 1),
  );
  const [completedCycles, setCompletedCycles] = useState(0);
  const [fullWorkingTime, setFullWorkingtime] = useState(0);
  const [numberOfPomodoros, setNumberOfPomodoros] = useState(0);

  useInterval(
    () => {
      setMainTime(mainTime - 1);
      if (working) setFullWorkingtime(fullWorkingTime + 1);
    },
    timeCounter ? 1000 : null,
  );

  const configureWork = useCallback(() => {
    setTimeCounter(true);
    setWorking(true);
    setResting(false);
    setMainTime(props.pomodoroTime);
    audioStartWorking.play();
  }, [setTimeCounter, setWorking, setResting, setMainTime, props.pomodoroTime]);

  const configureRest = useCallback(
    (long: boolean) => {
      setTimeCounter(true);
      setWorking(false);
      setResting(true);

      if (long) setMainTime(props.longRestTime);
      else setMainTime(props.shortRestTime);

      audioStopWorking.play();
    },
    [
      setTimeCounter,
      setWorking,
      setResting,
      setMainTime,
      props.longRestTime,
      props.shortRestTime,
    ],
  );

  useEffect(() => {
    console.log('tempo', mainTime);
    if (working) {
      document.body.classList.add('working');
    }
    if (resting) document.body.classList.remove('working');

    if (mainTime > 0) return;
    if (working && cyclesManager.length > 0) {
      configureRest(false);
      cyclesManager.pop();
    } else if (working && cyclesManager.length <= 0) {
      configureRest(true);
      setCyclesManager(new Array(props.cycles - 1));
      setCompletedCycles(completedCycles + 1);
    }

    if (working) {
      setNumberOfPomodoros(numberOfPomodoros + 1);
    }
    if (resting) configureWork();
  }, [
    working,
    resting,
    mainTime,
    configureRest,
    configureWork,
    completedCycles,
    cyclesManager,
    numberOfPomodoros,
    fullWorkingTime,
    props.cycles,
    props.pomodoroTime,
  ]);

  return (
    <div className="pomodoro">
      <h2>{working ? 'Working' : !resting ? 'Begin' : 'Resting'} </h2>
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
        <p>
          <b>Concluded Cycles:</b> {completedCycles}
        </p>
        <p>
          <b>Worked Time:</b> {secondsToTime(fullWorkingTime)}
        </p>
        <p>
          <b>Concluded Pomodoros: </b>
          {numberOfPomodoros}
        </p>
      </div>
    </div>
  );
}
