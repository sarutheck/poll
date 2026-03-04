import React, { useEffect, useState, useRef } from 'react';
import { useSocket } from './SocketContext';
import { QRCodeSVG } from 'qrcode.react';
import cloud from 'd3-cloud';
import * as d3 from 'd3';

const HostDashboard = () => {
    const socket = useSocket();
    const [words, setWords] = useState({});
    const [question, setQuestion] = useState("What's on your mind?");
    const cloudRef = useRef(null);
    const joinUrl = `${window.location.origin}/join`;

    useEffect(() => {
        if (!socket) return;

        socket.on('wordUpdate', (newWords) => {
            setWords(newWords);
        });
        socket.on('questionUpdate', (newQuestion) => {
            setQuestion(newQuestion);
        });

        return () => {
            socket.off('wordUpdate');
            socket.off('questionUpdate');
        };
    }, [socket]);

    useEffect(() => {
        drawCloud();
    }, [words]);

    const drawCloud = () => {
        if (!cloudRef.current) return;

        const data = Object.entries(words).map(([text, size]) => ({
            text,
            size: 20 + size * 10
        }));

        const width = cloudRef.current.offsetWidth;
        const height = cloudRef.current.offsetHeight;

        d3.select(cloudRef.current).select("svg").remove();

        const layout = cloud()
            .size([width, height])
            .words(data)
            .padding(5)
            .rotate(() => 0)
            .font("Inter")
            .fontSize(d => d.size)
            .on("end", draw);

        layout.start();

        function draw(words) {
            d3.select(cloudRef.current)
                .append("svg")
                .attr("width", layout.size()[0])
                .attr("height", layout.size()[1])
                .append("g")
                .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
                .selectAll("text")
                .data(words)
                .enter()
                .append("text")
                .style("font-size", d => d.size + "px")
                .style("font-family", "Inter")
                .style("font-weight", "800")
                .style("fill", () => d3.interpolateRainbow(Math.random()))
                .attr("text-anchor", "middle")
                .attr("transform", d => "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")")
                .text(d => d.text)
                .style("transition", "all 0.5s ease");
        }
    };

    const handleReset = () => {
        if (socket) socket.emit('reset');
    };

    return (
        <div className="container animate-fade-in">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1>Pollcloud https://pollcloud.onrender.com/join</h1>
                    <p style={{ color: 'var(--text-muted)' }}>by Theckyam Labs</p>
                </div>
                <button className="btn" style={{ background: 'rgba(255,255,255,0.05)', color: 'white' }} onClick={handleReset}>
                    Reset Cloud
                </button>
            </header>

            <div className="dashboard-layout">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: 0 }}>
                    <div className="glass" style={{ padding: '1.5rem', textAlign: 'center' }}>
                        <h2 style={{ fontSize: '2rem', margin: 0, color: 'var(--text-main)' }}>{question}</h2>
                    </div>
                    <div className="glass word-cloud-container" ref={cloudRef}>
                        {Object.keys(words).length === 0 && (
                            <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                                <h2>Waiting for responses...</h2>
                                <p>Participants can scan the QR code to submit words.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="side-panel">
                    <div className="glass qr-card">
                        <h3>Join the Poll</h3>
                        <div className="qr-code-wrapper">
                            <QRCodeSVG value={joinUrl} size={400} />
                        </div>
                        <p style={{ marginTop: '1rem', color: 'var(--text-main)', fontWeight: '600' }}>
                            Scan the QR Code
                        </p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem', wordBreak: 'break-all' }}>
                            {joinUrl}
                        </p>
                    </div>

                    <div className="glass" style={{ padding: '1.5rem' }}>
                        <h4 style={{ marginBottom: '1rem' }}>Total Responses</h4>
                        <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#6366f1' }}>
                            {Object.values(words).reduce((a, b) => a + b, 0)}
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default HostDashboard;
