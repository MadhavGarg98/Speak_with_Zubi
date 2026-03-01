import React from "react";

export default function Navbar({ aiSpeaking, conversationActive, timeLeft, onEnd, onClear }) {
  return (
    <header className="bg-forestDark/80 backdrop-blur p-4 border-b border-goldAccent/20">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="navbar-logo-shimmer">
          <h1 className="text-2xl font-bold text-goldAccent">🌲 Zubi Magical Forest</h1>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${aiSpeaking ? "bg-green-400 animate-pulse shadow-lg shadow-green-400/50" : "bg-gray-400"}`} />
            <span className="text-creamText text-sm font-medium">LIVE</span>
          </div>
          
          <span className="text-goldAccent font-mono font-semibold">
            {conversationActive ? `${timeLeft}s` : "00:00"}
          </span>
          
          <div className="flex gap-2">
            <button
              onClick={onEnd}
              className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors premium-hover"
            >
              End
            </button>
            <button
              onClick={onClear}
              className="px-3 py-1 bg-gray-500 text-white rounded-lg text-sm hover:bg-gray-600 transition-colors premium-hover"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
