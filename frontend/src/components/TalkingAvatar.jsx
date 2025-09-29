import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, Square } from 'lucide-react';
import avatarImage from '../assets/avatar.png';

// CSS Keyframes for the pulsing blue light animation
const animationStyle = `
  @keyframes pulseBlueLight {
    0% {
      box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
      background: radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%);
    }
    50% {
      box-shadow: 0 0 20px 10px rgba(59, 130, 246, 0.4);
      background: radial-gradient(circle, rgba(59, 130, 246, 0.5) 0%, transparent 70%);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
      background: radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%);
    }
  }

  @keyframes avatarPulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
`;

function TalkingAvatar({ text, setCurrentWordIndex }) {
  const [speaking, setSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentWordIndex, setLocalCurrentWordIndex] = useState(-1);
  const speechSynthesisRef = useRef(null);
  const utteranceRef = useRef(null);

  // Sample texts for demonstration if no text is provided
  const sampleTexts = [
    "Welcome to SkillPath AI! I'm here to help you learn and grow.",
    "Let's explore new technologies and build amazing projects together.",
    "Ask me anything about programming, AI, or career development."
  ];

  // Cleanup effect: stop speaking if the text content changes or component unmounts
  useEffect(() => {
    window.speechSynthesis.cancel();
    return () => {
      window.speechSynthesis.cancel();
    };
  }, [text]);

  const findCurrentWordIndex = (text, charIndex) => {
    if (!text || charIndex < 0) return -1;
    
    // Split text into words and track their positions
    const wordsWithPositions = [];
    let currentPos = 0;
    const wordMatches = text.matchAll(/\S+/g);
    
    for (const match of wordMatches) {
      wordsWithPositions.push({
        word: match[0],
        start: match.index,
        end: match.index + match[0].length - 1
      });
    }
    
    // Find which word the character index falls into
    for (let i = 0; i < wordsWithPositions.length; i++) {
      if (charIndex >= wordsWithPositions[i].start && charIndex <= wordsWithPositions[i].end) {
        return i;
      }
    }
    
    // If character is between words, return the next word
    for (let i = 0; i < wordsWithPositions.length; i++) {
      if (charIndex < wordsWithPositions[i].start) {
        return Math.max(0, i - 1);
      }
    }
    
    return wordsWithPositions.length - 1;
  };

  const speakText = () => {
    if (speaking) return;
    
    const textToSpeak = text || sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utteranceRef.current = utterance;
    
    // Configure voice settings for better word boundary detection
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.lang.startsWith('en') && voice.name.includes('Google')
    ) || voices.find(voice => voice.lang.startsWith('en'));
    
    if (preferredVoice) utterance.voice = preferredVoice;
    utterance.rate = 0.8; // Slower for accurate word tracking
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      setSpeaking(true);
      setLocalCurrentWordIndex(0);
      if (setCurrentWordIndex) setCurrentWordIndex(0);
    };
    
    utterance.onend = () => {
      setSpeaking(false);
      setIsPaused(false);
      setLocalCurrentWordIndex(-1);
      if (setCurrentWordIndex) setCurrentWordIndex(-1);
    };
    
    utterance.onerror = (error) => {
      console.log('Speech error:', error);
      setSpeaking(false);
      setIsPaused(false);
      setLocalCurrentWordIndex(-1);
      if (setCurrentWordIndex) setCurrentWordIndex(-1);
    };

    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        const wordIndex = findCurrentWordIndex(textToSpeak, event.charIndex);
        if (wordIndex >= 0) {
          setLocalCurrentWordIndex(wordIndex);
          if (setCurrentWordIndex) setCurrentWordIndex(wordIndex);
        }
      }
    };
    
    // Start speaking
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
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    padding: '0',
    backgroundColor: 'transparent',
    position: 'relative'
  };

  const avatarContainerStyle = {
    position: 'relative',
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    animation: speaking && !isPaused ? "pulseBlueLight 2s infinite ease-in-out" : "none",
    transition: 'all 0.3s ease'
  };

  const avatarStyle = {
    width: '130px',
    height: '130px',
    borderRadius: '50%',
    objectFit: 'cover',
    backgroundColor: 'transparent',
    animation: speaking && !isPaused ? "avatarPulse 2s infinite ease-in-out" : "none",
    transition: 'all 0.3s ease',
    border: '3px solid #ffffff',
    zIndex: 2,
    position: 'relative'
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
        <div style={avatarContainerStyle}>
          <img 
            src={avatarImage}
            alt="AI Instructor" 
            style={avatarStyle}
            onError={(e) => {
              e.target.src = '/placeholder.svg';
            }}
          />
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={handleStartStopClick} 
            style={{
              ...buttonStyle,
              backgroundColor: speaking ? '#ef4444' : '#22c55e',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
            title={speaking ? 'Stop Speaking' : 'Start Speaking'}
          >
            {speaking ? <Square size={16} /> : <Play size={16} />}
            {speaking ? "Stop" : "Start"}
          </button>
          
          {speaking && (
            <button 
              onClick={handlePauseResumeClick}
              style={{
                ...buttonStyle,
                backgroundColor: isPaused ? '#22c55e' : '#f59e0b',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
              title={isPaused ? 'Resume Speaking' : 'Pause Speaking'}
            >
              {isPaused ? <Play size={16} /> : <Pause size={16} />}
              {isPaused ? "Resume" : "Pause"}
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default TalkingAvatar;