import React, { useState, useEffect } from 'react';
import { useSocket } from './SocketContext';

const SetQuestion = () => {
    const socket = useSocket();
    const [inputQuestion, setInputQuestion] = useState("");
    const [currentQuestion, setCurrentQuestion] = useState("What's on your mind?");

    useEffect(() => {
        if (!socket) return;
        socket.on('questionUpdate', (newQuestion) => {
            setCurrentQuestion(newQuestion);
        });
        return () => socket.off('questionUpdate');
    }, [socket]);

    const handleSetQuestion = () => {
        if (socket && inputQuestion.trim()) {
            socket.emit('setQuestion', inputQuestion);
            setInputQuestion("");
        }
    };

    const handleReset = () => {
        if (socket) {
            if (window.confirm("Are you sure you want to completely clear the word cloud?")) {
                socket.emit('reset');
            }
        }
    };

    return (
        <div className="mobile-container">
            <div className="glass p-8 animate-fade-in" style={{ padding: '2rem' }}>
                <h1 style={{ textAlign: 'center', fontSize: '2rem' }}>Set New Question</h1>
                <p style={{ color: 'var(--text-main)', textAlign: 'center', marginBottom: '2rem', fontSize: '1.2rem' }}>
                    <strong>Current:</strong> {currentQuestion}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input
                        type="text"
                        className="input-field"
                        placeholder="Type new question here..."
                        value={inputQuestion}
                        onChange={(e) => setInputQuestion(e.target.value)}
                        maxLength={200}
                        style={{ marginBottom: '0' }}
                    />
                    <button className="btn btn-primary" onClick={handleSetQuestion}>
                        Update Question
                    </button>
                </div>

                <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#ef4444' }}>Danger Zone</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                        This will delete all submitted words from the current session.
                    </p>
                    <button
                        className="btn"
                        style={{ background: '#ef4444', color: 'white', width: '100%' }}
                        onClick={handleReset}
                    >
                        Reset Word Cloud
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SetQuestion;
