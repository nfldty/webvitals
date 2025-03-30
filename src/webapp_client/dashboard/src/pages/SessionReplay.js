// src/pages/SessionReplay.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import '../style.css';

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
    <div className="form-container">
      <div className="form-wrapper" style={{ maxWidth: '878px' }}>
        <h1 className="page-heading">Session Replay</h1>

        <div className="input-group" style={{ marginBottom: '20px' }}>
          <label className="input-label">User ID</label>
          <input
            type="text"
            className="input-field"
            value={userId || ''}
            disabled
          />
        </div>

        {sessions.length > 0 && (
          <div className="input-group" style={{ marginBottom: '20px' }}>
            <label className="input-label">Select Session</label>
            <select
              value={selectedSession}
              onChange={(e) => setSelectedSession(e.target.value)}
              className="input-field"
            >
              <option value="">-- Select --</option>
              {sessions.map((session) => (
                <option key={session.id} value={session.id}>
                  {session.id} - {new Date(session.start_time).toLocaleString()}
                </option>
              ))}
            </select>
            <button className="btn" onClick={fetchSessionEvents}>
              Load Session
            </button>
          </div>
        )}

        <div className="input-group" style={{ marginBottom: '20px' }}>
          <button
            className="btn"
            onClick={startReplay}
            disabled={isPlaying || events.length === 0}
          >
            Start
          </button>
          <button
            className="btn"
            onClick={pauseReplay}
            disabled={!isPlaying}
            style={{ marginLeft: '10px' }}
          >
            Pause
          </button>
        </div>

        <div className="input-group" style={{ marginBottom: '20px' }}>
          <label className="input-label">Speed</label>
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.1"
            value={replaySpeed}
            onChange={(e) => setReplaySpeed(Number(e.target.value))}
            style={{ marginLeft: '10px' }}
          />
          <span style={{ marginLeft: '10px' }}>{replaySpeed}x</span>
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
    </div>
  );
}
