'use client';

import { useState, useEffect, useCallback } from 'react';

interface Props {
  text: string;
  duration?: number;
  interval?: number;
}

const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

export default function TextGlitchEffect({ text, duration = 50, interval = 25 }: Props) {
  const [displayText, setDisplayText] = useState<string>(text);
  const [isGlitching, setIsGlitching] = useState<boolean>(false);

  const startGlitch = useCallback(() => {
    if (isGlitching) return;
    setIsGlitching(true)

    let currentText = text.split('');
    let timeoutIds: NodeJS.Timeout[] = [];
    
    for (let i = 0; i < text.length; i++) {
      timeoutIds.push(
        setTimeout(() => {
          currentText[i] = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
          setDisplayText(currentText.join(''));
        }, i * interval)
      );
    }

    timeoutIds.push(
      setTimeout(() => {
        for (let i = 0; i < text.length; i++) {
          timeoutIds.push(
            setTimeout(() => {
              currentText[i] = text[i];
              setDisplayText(currentText.join(''));

              if (i === text.length - 1) {
                setIsGlitching(false)
              }
            }, i * interval)
          );
        }
      }, duration)
    );

    return () => timeoutIds.forEach(clearTimeout);
  }, [text, duration, interval, isGlitching]);

  return (
    <span
      onMouseEnter={startGlitch}
    >
      {displayText}
    </span>
  );
}
