import React, { useEffect, useState } from 'react';
import logo from '../assets/logo.png';

const WelcomePage = ({ onExplore }) => {
  const [text, setText] = useState('');
  const fullText = 'Right Water';
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    // Delay text animation until logo fades in
    const timeout = setTimeout(() => {
      let index = 0;
      const interval = setInterval(() => {
        setText(fullText.slice(0, index + 1));
        index++;
        if (index >= fullText.length) {
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const duration = 4000; // 4 seconds total
    const interval = 30;
    const step = 100 / (duration / interval);

    const loader = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(loader);
          setTimeout(onExplore, 800);
          return 100;
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(loader);
  }, [onExplore]);

  return (
    <div className="modern-welcome">
      <div className="welcome-animation-box">
        <div className="welcome-logo-container fade-in">
          <img src={logo} alt="Right Water Logo" className="welcome-main-logo" />
        </div>
        <h1 className="animated-text">{text}<span className="cursor">|</span></h1>
        <div className="loader-container">
          <div className="loader-bar" style={{ width: `${loadingProgress}%` }}></div>
        </div>
        <p className="welcome-subtext">جاري تحضير تجربة النقاء...</p>
      </div>
    </div>
  );
};

export default WelcomePage;
