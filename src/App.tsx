import React from 'react';
import WeatherWidget from './components/WeatherWidget/WeatherWidget';
import { ThemeProvider } from './context/ThemeContext';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <div className='app'>
        <WeatherWidget />
      </div>
    </ThemeProvider>
  );
};

export default App;
