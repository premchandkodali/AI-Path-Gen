import React, { useState, useEffect } from "react";

// CSS Keyframes for the pulsing glow animation
const animationStyle = `
  @keyframes pulseGlow {
    0% { box-shadow: 0 0 10px 3px #22c55e; }
    50% { box-shadow: 0 0 20px 6px #22c55e; }
    100% { box-shadow: 0 0 10px 3px #22c55e; }
  }
`;

function TalkingAvatar({ text, setCurrentWordIndex }) {
  const [speaking, setSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Cleanup effect: stop speaking if the text content changes or component unmounts
  useEffect(() => {
    window.speechSynthesis.cancel();
    return () => {
      window.speechSynthesis.cancel();
    };
  }, [text]);

  const findCurrentWordIndex = (text, charIndex) => {
    const words = text.slice(0, charIndex + 1).split(/\s+/);
    return words.length - 1;
  };

  const speakText = () => {
    if (!text || speaking) return;
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const defaultVoice = voices.find(voice => voice.lang.startsWith('en'));
    utterance.voice = defaultVoice;

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => {
      setSpeaking(false);
      setIsPaused(false);
      setCurrentWordIndex(-1);
    };
    utterance.onerror = () => {
      setSpeaking(false);
      setIsPaused(false);
      setCurrentWordIndex(-1);
    };

    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        const wordIndex = findCurrentWordIndex(text, event.charIndex);
        setCurrentWordIndex(wordIndex);
      }
    };
    
    window.speechSynthesis.speak(utterance);
  };

  const handleStartStopClick = () => {
    if (speaking) {
      window.speechSynthesis.cancel();
    } else {
      speakText();
    }
  };
  
  const handlePauseResumeClick = () => {
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  // Simple, clean styles
  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    backgroundColor: 'hsl(0, 0%, 100%)',
    borderRadius: '12px',
    border: '1px solid hsl(220, 13%, 91%)',
    marginBottom: '16px'
  };

  const avatarStyle = {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    objectFit: 'cover',
    backgroundColor: '#6366f1',
    animation: speaking && !isPaused ? "pulseGlow 2s infinite ease-in-out" : "none",
    transition: 'all 0.3s ease'
  };

  const buttonStyle = {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    backgroundColor: speaking ? '#ef4444' : '#22c55e',
    color: 'white',
    transition: 'all 0.2s ease'
  };

  return (
    <>
      <style>{animationStyle}</style>
      <div style={containerStyle}>
        <img 
          src="/placeholder.svg"
          alt="AI Instructor" 
          style={avatarStyle}
          onError={(e) => {
            e.target.style.backgroundColor = '#6366f1';
            e.target.style.border = '2px solid #e5e7eb';
          }}
        />
        
        <div style={{ flex: 1, marginLeft: '12px' }}>
          <div style={{ 
            fontSize: '14px', 
            fontWeight: '500', 
            color: '#374151',
            marginBottom: '4px'
          }}>
            AI Course Instructor
          </div>
          <div style={{ 
            fontSize: '12px', 
            color: '#6b7280'
          }}>
            {speaking ? (isPaused ? "Paused" : "Speaking") : "Ready to help"}
          </div>
        </div>
        
        <button 
          onClick={handleStartStopClick} 
          disabled={!text}
          style={buttonStyle}
        >
          {speaking ? "Stop" : "Start Speaking"}
        </button>
        
        {speaking && (
          <button 
            onClick={handlePauseResumeClick}
            style={{
              ...buttonStyle,
              backgroundColor: '#f59e0b',
              marginLeft: '8px'
            }}
          >
            {isPaused ? "Resume" : "Pause"}
          </button>
        )}
      </div>
    </>
  );
}

export default TalkingAvatar;