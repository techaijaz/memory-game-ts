import { useEffect, useState } from 'react';

const data: string[] = ['❤', '😎', '🎄', '👓', '🎈', '🎆', '🎡', '🧶', '🎀'];

function MemoryGame() {
  const [cards, setCard] = useState<string[]>([]);
  const [reset, setReset] = useState<boolean>(false);
  const [bestScore, setBestScore] = useState<number>(0);

  const [firstClickIndex, setFirstClickIndex] = useState<number | null>(null);
  const [secondClickIndex, setSecondClickIndex] = useState<number | null>(null);
  const [turns, setTurns] = useState<number>(0);
  const [matchingIndexes, setMatchingIndexes] = useState<number[]>([]);

  useEffect(() => {
    const duplicateCards = [...data, ...data];
    for (let i = duplicateCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [duplicateCards[i], duplicateCards[j]] = [
        duplicateCards[j],
        duplicateCards[i],
      ];
    }
    setCard(() => duplicateCards);
  }, [reset]);

  useEffect(() => {
    let interval: number | undefined = undefined;
    if (
      matchingIndexes.length !== 0 &&
      matchingIndexes.length === cards.length
    ) {
      if (bestScore === 0 || turns <= bestScore) setBestScore(turns);
      interval = setTimeout(() => {
        setFirstClickIndex(null);
        setSecondClickIndex(null);
        setMatchingIndexes([]);
        setTurns(0);
        setReset((prev) => !prev);
        alert('You won!');
      }, 500);
    }
    return () => {
      clearInterval(interval);
    };
  }, [cards.length, matchingIndexes.length, bestScore, turns]);

  function handleClick(index: number) {
    return () => {
      if (firstClickIndex === null) {
        setFirstClickIndex(index);
        setTurns((prevTurns) => prevTurns + 1);
      } else {
        setTurns((prevTurns) => prevTurns + 1);
        const firstValue = cards[firstClickIndex];
        const secondValue = cards[index];
        if (firstValue === secondValue) {
          setFirstClickIndex(null);
          setMatchingIndexes([...matchingIndexes, firstClickIndex, index]);
        } else {
          setSecondClickIndex(index);
          setTimeout(() => {
            setFirstClickIndex(null);
            setSecondClickIndex(null);
          }, 2000);
        }
      }
    };
  }

  function resetFun(): void {
    setFirstClickIndex(null);
    setSecondClickIndex(null);
    setMatchingIndexes([]);
    setReset((prev) => !prev);
    setTurns(0);
  }

  return (
    <div className="memory-game">
      <div className="memory-game-header">
        <div className="memory-game-header-score">Move: {turns}</div>
        <div className="memory-game-header-score">Best Score: {bestScore}</div>
        <h1>Memory Game</h1>
        <button onClick={resetFun}>New Game</button>
      </div>
      <div className="memory-game-body">
        {cards.map((card, index) => (
          <div
            className="card"
            key={index}
            onClick={handleClick(index)}
            data-active={matchingIndexes.includes(index)}
            data-toggled={
              index === firstClickIndex || index === secondClickIndex
            }
            data-disabled={
              index === firstClickIndex || index === secondClickIndex
            }
            data-disabled-all={
              firstClickIndex !== null && secondClickIndex !== null
            }
          >
            {/* {console.log(firstClickIndex, secondClickIndex, index)} */}

            <div className="front"></div>
            <div className="back">{card}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MemoryGame;
