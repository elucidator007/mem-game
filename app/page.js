'use client'
import { createMemoryGame } from "@/utility/lib";
import { useEffect, useState } from "react";
import Confetti from 'react-confetti';

export default function Home() {
    const [curr, setCurr] = useState([]);
    const [gameArray, setGameArray] = useState([]);
    const [matched, setMatched] = useState([]);
    const [isGameComplete, setIsGameComplete] = useState(false);
    const difficulty_level = 4;

    useEffect(() => {
        startNewGame();
    }, []);

    useEffect(() => {
        if (matched.length === gameArray.length / 2 && gameArray.length > 0) {
            setIsGameComplete(true);
        }
    }, [matched, gameArray]);

    const startNewGame = () => {
        setGameArray(createMemoryGame(difficulty_level));
        setMatched([]);
        setCurr([]);
        setIsGameComplete(false);
    };

    const handleCardClick = (index) => {
        if (curr.length === 0) {
            setCurr([index]);
        } else if (curr.length === 1 && !curr.includes(index)) {
            const newCurr = [...curr, index];
            setCurr(newCurr);

            setTimeout(() => {
                if (gameArray[newCurr[0]] === gameArray[newCurr[1]]) {
                    setMatched(prev => [...prev, gameArray[newCurr[0]]]);
                }
                setCurr([]);
            }, 1000);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-8">
            {isGameComplete && <Confetti />}
            <div className="bg-white rounded-xl shadow-2xl p-6">
                <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Memory Game</h1>
                <div className="grid grid-cols-4 gap-4 mb-6">
                    {gameArray.map((item, index) => {
                        const isMatched = matched.includes(item);
                        const isVisible = curr.includes(index);
                        return (
                            <div 
                                key={index}
                                className="h-16 w-16 cursor-pointer perspective"
                                onClick={() => !isVisible && !isGameComplete && !isMatched && handleCardClick(index)}
                            >
                                <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${(isVisible || isMatched) ? 'rotate-y-180' : ''}`}>
                                    <div className="absolute w-full h-full backface-hidden bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-md flex items-center justify-center text-white font-bold text-xl">
                                        ?
                                    </div>
                                    <div className="absolute w-full h-full backface-hidden bg-gradient-to-br from-green-400 to-blue-500 rounded-lg shadow-md flex items-center justify-center text-white font-bold text-xl rotate-y-180">
                                        {item}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                {isGameComplete && (
                    <div className="text-center">
                        <p className="text-2xl font-bold mb-4 text-green-600">Congratulations! You&apos;ve completed the game!</p>
                        <button 
                            onClick={startNewGame}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
                        >
                            Play Again
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}