import React, { useEffect, useRef } from 'react';
import './Home.css';

function Home({ onStart }) {
    const titleRef = useRef(null);
    const videoRef = useRef(null);

    useEffect(() => {
        const title = titleRef.current;
        const originalText = title.textContent;
        title.textContent = '';

        // Créer un span pour chaque lettre
        [...originalText].forEach((char, i) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.dataset.index = i;
            title.appendChild(span);
        });

        const letters = title.querySelectorAll('span');
        const sensitivity = 150;

        const handleMouseMove = (e) => {
            const mouseX = e.clientX;
            const mouseY = e.clientY;

            letters.forEach(letter => {
                const rect = letter.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const dist = Math.sqrt((mouseX - centerX) ** 2 + (mouseY - centerY) ** 2);

                if (dist < sensitivity) {
                    const intensity = 1 - dist / sensitivity;
                    letter.style.webkitTextStroke = `${1 + intensity}px rgba(255, 255, 255, ${0.4 + 0.6 * intensity})`;
                    letter.style.textShadow = `0 0 ${8 * intensity}px rgba(255, 255, 255, ${0.4 * intensity})`;
                } else {
                    letter.style.webkitTextStroke = '1px rgba(255, 255, 255, 0.4)';
                    letter.style.textShadow = 'none';
                }
            });
        };

        const handleTouchMove = (e) => {
            if (e.touches.length > 0) {
                const touch = e.touches[0];
                const simulatedMouse = new MouseEvent('mousemove', {
                    clientX: touch.clientX,
                    clientY: touch.clientY,
                });
                document.dispatchEvent(simulatedMouse);
                e.preventDefault();
            }
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('touchmove', handleTouchMove, { passive: false });

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('touchmove', handleTouchMove);
        };
        const video = videoRef.current;

        if (video) {
            const playVideo = () => {
                video.play().catch(error => {
                    console.log("Autoplay prevented:", error);
                    document.addEventListener('touchstart', handleTouch, { once: true });
                });
            };

            const handleTouch = () => {
                video.play().catch(error => {
                    console.log("Still can't play video:", error);
                });
            };

            // Pour iOS Safari spécifiquement
            video.addEventListener('loadedmetadata', playVideo);

            return () => {
                video.removeEventListener('loadedmetadata', playVideo);
                document.removeEventListener('touchstart', handleTouch);
            };
        }


    }, []);

    return (
        <div className="home-container">
            <video
                className="background-video"
                ref={videoRef}
                autoPlay
                loop
                muted
                playsInline
            >
                <source src="/videos/intro.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            <div className="home-overlay">
                <h1 className="home-title" ref={titleRef}>
                    <span className="title-word">Languo</span>{" "}
                    <span className="title-word">Guessr</span>
                </h1>
                <p className="home-subtitle"> Learn languages the fun way </p>
                <button onClick={onStart} className="home-button">
                    Start Playing
                </button>
            </div>
        </div>
    );
}

export default Home;
