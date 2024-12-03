'use client'
import { useEffect, useState } from "react";

const DIFFICULTY_LEVELS = {
  easy: { pairs: 6, timeLimit: 60 },
  medium: { pairs: 8, timeLimit: 90 },
  hard: { pairs: 12, timeLimit: 120 }
};

const THEMES = {
  numbers: Array.from({ length: 12 }, (_, i) => i + 1),
  emojis: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮'],
  shapes: ['■', '●', '▲', '◆', '★', '♠', '♣', '♥', '♦', '▼', '◀', '▶']
};

export default function Home() {
  const [difficulty, setDifficulty] = useState('easy');
  const [theme, setTheme] = useState('numbers');
  const [gameArray, setGameArray] = useState([]);
  const [curr, setCurr] = useState([]);
  const [matched, setMatched] = useState([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [lives, setLives] = useState(6);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [streak, setStreak] = useState(0);

  const createMemoryGame = (numPairs, themeItems) => {
    const items = themeItems.slice(0, numPairs);
    const pairs = [...items, ...items];
    return pairs.sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    if (isGameStarted && !gameOver && !isGameComplete) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameOver(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isGameStarted, gameOver, isGameComplete]);

  useEffect(() => {
    if (matched.length === DIFFICULTY_LEVELS[difficulty].pairs && gameArray.length > 0) {
      setIsGameComplete(true);
      const timeBonus = Math.floor(timeLeft * 10);
      const difficultyBonus = {
        easy: 100,
        medium: 200,
        hard: 300
      }[difficulty];
      setScore(prev => prev + timeBonus + difficultyBonus);
    }
  }, [matched, gameArray, difficulty, timeLeft]);

  const startNewGame = () => {
    const numPairs = DIFFICULTY_LEVELS[difficulty].pairs;
    setGameArray(createMemoryGame(numPairs, THEMES[theme]));
    setTimeLeft(DIFFICULTY_LEVELS[difficulty].timeLimit);
    setMatched([]);
    setCurr([]);
    setMoves(0);
    setStreak(0);
    setLives(6);
    setGameOver(false);
    setIsGameComplete(false);
    setIsGameStarted(true);
    setScore(0);
  };

  const handleCardClick = (index) => {
    if (curr.length === 0) {
      setCurr([index]);
    } else if (curr.length === 1 && !curr.includes(index)) {
      const newCurr = [...curr, index];
      setCurr(newCurr);
      setMoves(prev => prev + 1);

      setTimeout(() => {
        if (gameArray[newCurr[0]] === gameArray[newCurr[1]]) {
          setMatched(prev => [...prev, gameArray[newCurr[0]]]);
          setScore(prev => prev + 50 * (streak + 1));
          setStreak(prev => prev + 1);
        } else {
          setStreak(0);
          setLives(prev => {
            if (prev <= 1) setGameOver(true);
            return prev - 1;
          });
        }
        setCurr([]);
      }, 1000);
    }
  };

  const getGridClass = () => {
    switch(difficulty) {
      case 'easy':
        return 'grid-cols-4 gap-4';
      case 'medium':
        return 'grid-cols-4 gap-3';
      case 'hard':
        return 'grid-cols-6 gap-2';
      default:
        return 'grid-cols-4 gap-4';
    }
  };

  const getCardSize = () => {
    switch(difficulty) {
      case 'easy':
        return 'h-28 w-28';
      case 'medium':
        return 'h-24 w-24';
      case 'hard':
        return 'h-20 w-20';
      default:
        return 'h-28 w-28';
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#FFFBE9] p-4">
      <div className="bg-[#E3CAA5] rounded-xl shadow-2xl p-6 max-w-3xl w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#644321]">Memory Game</h1>
          {isGameStarted && (
            <div className="flex gap-6 items-center text-[#644321] font-semibold">
              <div>Score: {score}</div>
              <div>Time: {timeLeft}s</div>
              <div>Lives: {lives}</div>
            </div>
          )}
        </div>

        {!isGameStarted ? (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="text-[#644321] font-semibold mb-2">Select Game Settings:</div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-[#644321] mb-2">Difficulty</label>
                  <select 
                    className="w-full px-4 py-2 rounded border bg-[#FFFBE9] text-[#644321] border-[#AD8B73]"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-[#644321] mb-2">Theme</label>
                  <select 
                    className="w-full px-4 py-2 rounded border bg-[#FFFBE9] text-[#644321] border-[#AD8B73]"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                  >
                    <option value="numbers">Numbers</option>
                    <option value="emojis">Emojis</option>
                    <option value="shapes">Shapes</option>
                  </select>
                </div>
              </div>
            </div>
            <button 
              onClick={startNewGame}
              className="w-full bg-[#AD8B73] hover:bg-[#8B7355] text-[#FFFBE9] font-bold py-3 px-6 rounded-lg transition duration-300"
            >
              Start Game
            </button>
          </div>
        ) : (
          <>
            {(gameOver || isGameComplete) && (
              <div className="mb-6 p-3 bg-[#FFFBE9] rounded-lg text-[#644321] text-center font-semibold">
                {isGameComplete ? 
                  `Congratulations! You completed the game with ${moves} moves and ${timeLeft} seconds left!` :
                  `Game Over! You ran out of ${lives === 0 ? 'lives' : 'time'}!`}
              </div>
            )}

            <div className={`grid ${getGridClass()} mb-6`}>
              {gameArray.map((item, index) => {
                const isMatched = matched.includes(item);
                const isVisible = curr.includes(index);
                return (
                  <div 
                    key={index}
                    className={`${getCardSize()} cursor-pointer perspective`}
                    onClick={() => !isVisible && !isGameComplete && !gameOver && !isMatched && lives > 0 && handleCardClick(index)}
                  >
                    <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${(isVisible || isMatched) ? 'rotate-y-180' : ''}`}>
                      <div className="absolute w-full h-full backface-hidden bg-[#AD8B73] rounded-lg shadow-md flex items-center justify-center text-[#FFFBE9] font-bold text-2xl">
                        ?
                      </div>
                      <div className={`absolute w-full h-full backface-hidden rounded-lg shadow-md flex items-center justify-center text-2xl font-bold rotate-y-180 ${
                        isMatched ? 'bg-[#8B7355]' : 'bg-[#AD8B73]'
                      } text-[#FFFBE9]`}>
                        {item}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {(isGameComplete || gameOver) && (
              <div className="flex gap-4 justify-center">
                <button 
                  onClick={() => {
                    setIsGameStarted(false);
                    setGameArray([]);
                  }}
                  className="bg-[#AD8B73] hover:bg-[#8B7355] text-[#FFFBE9] font-bold py-2 px-6 rounded-lg transition duration-300"
                >
                  Change Settings
                </button>
                <button 
                  onClick={startNewGame}
                  className="bg-[#AD8B73] hover:bg-[#8B7355] text-[#FFFBE9] font-bold py-2 px-6 rounded-lg transition duration-300"
                >
                  Play Again
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}