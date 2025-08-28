
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import Home from './components/Home';
import About from './components/About';
// import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';

function App() {
  const [theme, setTheme] = useState('dark');
  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  }, []);

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <Header theme={theme} toggleTheme={toggleTheme} />
      <main>
        <Home theme={theme} />
        <About theme={theme} />
        {/* <Skills theme={theme} /> */}
        <Projects theme={theme} />
        <Contact theme={theme} />
      </main>
    </div>
  );
}

export default App;

