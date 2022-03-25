import React from 'react';
import { PomodoroTimer } from './componentes/pomodoro-timer';

function App(): JSX.Element {
  return (
    <div className="container">
      <PomodoroTimer defaultPomodoroTime={3600} />
    </div>
  );
}

export default App;
