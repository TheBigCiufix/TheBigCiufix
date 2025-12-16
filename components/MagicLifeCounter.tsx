import React, { useState, useEffect } from 'react';
import { MTGPlayer } from '../types';
import { RefreshCcw, Heart, Skull, Shield } from 'lucide-react';

const INITIAL_LIFE = 40;
const STORAGE_KEY = 'faellino_magic_v1';

const MagicLifeCounter: React.FC = () => {
  const [players, setPlayers] = useState<MTGPlayer[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
    return [
      { id: 1, name: 'Giocatore 1', life: INITIAL_LIFE, commanderDamage: 0, poison: 0, color: 'bg-red-900' },
      { id: 2, name: 'Giocatore 2', life: INITIAL_LIFE, commanderDamage: 0, poison: 0, color: 'bg-blue-900' },
      { id: 3, name: 'Giocatore 3', life: INITIAL_LIFE, commanderDamage: 0, poison: 0, color: 'bg-green-900' },
      { id: 4, name: 'Giocatore 4', life: INITIAL_LIFE, commanderDamage: 0, poison: 0, color: 'bg-slate-900' },
    ];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(players));
  }, [players]);

  const updateLife = (id: number, delta: number) => {
    setPlayers(prev => prev.map(p => 
      p.id === id ? { ...p, life: p.life + delta } : p
    ));
  };

  const resetGame = () => {
    if (confirm("Resettare la partita?")) {
      setPlayers(prev => prev.map(p => ({ ...p, life: INITIAL_LIFE, poison: 0, commanderDamage: 0 })));
    }
  };

  return (
    <div className="w-full h-full flex flex-col p-4 bg-faella-900 rounded-xl shadow-2xl border border-faella-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 flex items-center gap-2">
          <Shield className="w-6 h-6 text-purple-500" />
          MTG Commander
        </h2>
        <button 
          onClick={resetGame}
          className="p-2 bg-faella-700 hover:bg-red-600 rounded-full transition-colors text-white"
          title="Reset Game"
        >
          <RefreshCcw size={20} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 flex-grow">
        {players.map(player => (
          <div key={player.id} className={`${player.color} relative rounded-xl p-4 flex flex-col items-center justify-center shadow-lg border-2 border-transparent hover:border-white/20 transition-all`}>
            
            {/* Player Name */}
            <input 
              className="text-center bg-transparent text-white/70 font-semibold mb-2 outline-none border-b border-transparent focus:border-white/50 w-full"
              value={player.name}
              onChange={(e) => setPlayers(ps => ps.map(p => p.id === player.id ? {...p, name: e.target.value} : p))}
            />

            {/* Life Total */}
            <div className="text-6xl font-bold text-white mb-4 drop-shadow-md font-mono">
              {player.life}
            </div>

            {/* Controls */}
            <div className="flex gap-4 w-full justify-center">
              <button 
                onClick={() => updateLife(player.id, -1)}
                className="w-12 h-12 bg-black/30 hover:bg-red-500/50 rounded-full flex items-center justify-center text-2xl text-white transition-colors"
              >
                -
              </button>
              <button 
                onClick={() => updateLife(player.id, 1)}
                className="w-12 h-12 bg-black/30 hover:bg-green-500/50 rounded-full flex items-center justify-center text-2xl text-white transition-colors"
              >
                +
              </button>
            </div>

            {/* Poison / Life Indicators (Decorative) */}
            <div className="absolute top-2 right-2 flex gap-1">
               {player.life <= 10 && <Heart className="text-red-500 animate-pulse" size={16} />}
               {player.life <= 0 && <Skull className="text-gray-300" size={16} />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MagicLifeCounter;