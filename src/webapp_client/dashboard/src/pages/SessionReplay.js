// src/pages/SessionReplay.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function SessionReplay() {
  const { userId } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState('');
  const [events, setEvents] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [replaySpeed, setReplaySpeed] = useState(1);

  const iframeRef = useRef(null);
  const intervalRef = useRef(null);
  const eventIndexRef = useRef(0);

  // Automatically fetch sessions when userId is available
  useEffect(() => {
    if (userId) {
      fetchSessions();
    }
  }, [userId]);

  // Fetch sessions for the current user
  const fetchSessions = async () => {
    try {
      const res = await api.get('/sessions', { params: { userId } });
      setSessions(res.data);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  // Fetch events for the selected session
  const fetchSessionEvents = async () => {
    if (!selectedSession) return;
    try {
      const res = await api.get(`/sessions/${selectedSession}/events`);
      setEvents(res.data);
      console.log('Fetched session events:', res.data);
      console.log('first element: ', res.data[0]);
      eventIndexRef.current = 0;
    } catch (error) {
      console.error('Error fetching session events:', error);
    }
  };

  // Send the next event to the iframe
  const sendNextEvent = () => {
    if (eventIndexRef.current < events.length) {
      const event = events[eventIndexRef.current];
      if (iframeRef.current) {
        iframeRef.current.contentWindow.postMessage({ type: 'event', event }, '*');
      }
      eventIndexRef.current++;
    } else {
      clearInterval(intervalRef.current);
      setIsPlaying(false);
    }
  };

  // Start replaying events
  const startReplay = () => {
    if (isPlaying || events.length === 0) return;
    setIsPlaying(true);
    sendNextEvent();
    intervalRef.current = setInterval(() => {
      sendNextEvent();
    }, 1000 / (60 * replaySpeed));
  };

  // Pause replay
  const pauseReplay = () => {
    clearInterval(intervalRef.current);
    setIsPlaying(false);
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Session Replay</h1>
      <div style={{ marginBottom: '20px' }}>
        <p>User ID: {userId}</p>
      </div>
      {sessions.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <label>
            Select Session:{' '}
            <select
              value={selectedSession}
              onChange={(e) => setSelectedSession(e.target.value)}
              style={{ marginLeft: '10px' }}
            >
              <option value="">-- Select --</option>
              {sessions.map((session) => (
                <option key={session.id} value={session.id}>
                  {session.id} - {new Date(session.start_time).toLocaleString()}
                </option>
              ))}
            </select>
          </label>
          <button onClick={fetchSessionEvents} style={{ marginLeft: '10px' }}>
            Load Session
          </button>
        </div>
      )}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={startReplay}
          disabled={isPlaying || events.length === 0}
          style={{ marginRight: '10px' }}
        >
          Start
        </button>
        <button
          onClick={pauseReplay}
          disabled={!isPlaying}
          style={{ marginLeft: '10px' }}
        >
          Pause
        </button>
        <label style={{ marginLeft: '10px' }}>
          Speed:
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.1"
            value={replaySpeed}
            onChange={(e) => setReplaySpeed(Number(e.target.value))}
            style={{ marginLeft: '10px' }}
          />
          {replaySpeed}x
        </label>
      </div>
      <iframe
        ref={iframeRef}
        src="/app/test.html?webvitals-tracking-switch=False"
        width="878"
        height="812"
        title="Session Replay"
        style={{ border: '1px solid black', marginTop: '20px' }}
      ></iframe>
    </div>
  );
}
