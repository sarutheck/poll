import React, { useState, useEffect } from 'react';
import { useSocket } from './SocketContext';

const ParticipantView = () => {
    const [word, setWord] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [question, setQuestion] = useState("What's on your mind?");
    const socket = useSocket();

    useEffect(() => {
        if (!socket) return;

        socket.on('questionUpdate', (newQuestion) => {
            setQuestion(newQuestion);
        });

        return () => socket.off('questionUpdate');
    }, [socket]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (word.trim() && socket) {
            socket.emit('submitWord', word.trim());
            setWord('');
            setSubmitted(true);
            setTimeout(() => setSubmitted(false), 2000);
        }
    };

    return (
        <div className="mobile-container">
            <div className="glass p-8 animate-fade-in" style={{ padding: '2rem' }}>
                <h1 style={{ textAlign: 'center', fontSize: '2rem' }}>{question}</h1>
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '2rem' }}>   Submit a word to join the cloud!    </p>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        className="input-field"
                        placeholder="Type a word..."
                        value={word}
                        onChange={(e) => setWord(e.target.value)}
                        disabled={submitted}
                        maxLength={20}
                    />
                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%' }}
                        disabled={submitted || !word.trim()}
                    >
                        {submitted ? 'Submitted!' : 'Submit'}
                    </button>
                </form>

                {submitted && (
                    <p style={{ color: '#10b981', textAlign: 'center', marginTop: '1rem', fontWeight: 'bold' }}>
                        Word sent!
                    </p>
                )}
            </div>
        </div>
    );
};

export default ParticipantView;
