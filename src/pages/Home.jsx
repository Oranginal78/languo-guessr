import React from 'react';

function Home({ onStart }) {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-sky-300 via-cyan-200 to-green-200 relative overflow-hidden">
            {/* Background Bubbles */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute w-72 h-72 bg-cyan-100 rounded-full opacity-30 animate-pulse top-20 left-10"></div>
                <div className="absolute w-96 h-96 bg-green-100 rounded-full opacity-20 animate-pulse bottom-10 right-10"></div>
                <div className="absolute w-48 h-48 bg-sky-200 rounded-full opacity-30 animate-pulse bottom-32 left-1/4"></div>
            </div>

            {/* Main Content */}
            <div className="z-10 text-center">
                <h1 className="text-5xl md:text-6xl font-bold text-white drop-shadow-lg mb-8">
                    Languo Guessr
                </h1>
                <p className="text-xl md:text-2xl text-white mb-10 drop-shadow">
                    ✨ Learn languages the fun way ✨
                </p>
                <button
                    onClick={onStart}
                    className="px-8 py-4 bg-white/80 hover:bg-white/90 backdrop-blur-md rounded-full shadow-lg text-cyan-600 font-semibold text-lg hover:scale-105 transition-all duration-300"
                >
                    Start Playing
                </button>
            </div>
        </div>
    );
}

export default Home;
