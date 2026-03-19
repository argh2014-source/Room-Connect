"use client";

import { useState, useEffect } from 'react';

const targetDate = new Date("2026-04-07T00:00:00");

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState({
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +targetDate - +new Date();
      let newTimeLeft = { months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };

      if (difference > 0) {
        newTimeLeft = {
          months: Math.floor(difference / (1000 * 60 * 60 * 24 * 30.44)),
          days: Math.floor((difference / (1000 * 60 * 60 * 24)) % 30.44),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      return newTimeLeft;
    };

    // Set initial value
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="countdown-container animate-up delay-2">
      <div className="countdown-item">
        <span className="countdown-number">{formatNumber(timeLeft.months)}</span>
        <span className="countdown-label">MOIS</span>
      </div>
      <div className="countdown-separator">:</div>
      
      <div className="countdown-item">
        <span className="countdown-number">{formatNumber(timeLeft.days)}</span>
        <span className="countdown-label">JOURS</span>
      </div>
      <div className="countdown-separator">:</div>
      
      <div className="countdown-item">
        <span className="countdown-number">{formatNumber(timeLeft.hours)}</span>
        <span className="countdown-label">HEURES</span>
      </div>
      <div className="countdown-separator">:</div>
      
      <div className="countdown-item">
        <span className="countdown-number">{formatNumber(timeLeft.minutes)}</span>
        <span className="countdown-label">MIN</span>
      </div>
      <div className="countdown-separator">:</div>
      
      <div className="countdown-item">
        <span className="countdown-number">{formatNumber(timeLeft.seconds)}</span>
        <span className="countdown-label">SEC</span>
      </div>
    </div>
  );
}
