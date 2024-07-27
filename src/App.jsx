import "./App.css";

import { useState, useEffect, useCallback } from "react";
import Header from "./components/Header";
import Card from "./components/Card";
import Loading from "./components/Loading";
import video from "./assets/pokemonvid.mp4";

const App = () => {
  const [pokeData, setPokeData] = useState([]);
  const [modesPokemons, setModesPokemons] = useState([]);
  const [showingPokemons, setShowingPokemons] = useState([]);

  const [gameStatus, setGameStatus] = useState("playing");
  const [gameMode, setGameMode] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [shuffling, setShuffling] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const [rounds, setRounds] = useState(1);
  const [currentScore, setCurrentScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  function getRandomNumber() {
    const numbers = [0, 1, 2];
    const randomIndex = Math.floor(Math.random() * numbers.length);
    return numbers[randomIndex];
  }

  const getRandomElements = useCallback((pokemons, numElements, notClicked) => {
    const shuffled = pokemons.sort(() => 0.5 - Math.random());
    shuffled.splice(getRandomNumber(), 0, notClicked);
    return shuffled.slice(0, numElements);
  }, []);

  const returnStart = () => {
    setIsClicked(false);
    setShuffling(false);
    setRounds(1);
    setCurrentScore(0);
    setBestScore(0);
    setGameMode(null);
    setGameStatus("playing");
    setShowingPokemons([]);
    setModesPokemons([]);
  };

  const restartGame = () => {
    setIsClicked(false);
    setShuffling(false);
    setRounds(1);
    setCurrentScore(0);
    setBestScore(Math.max(currentScore, bestScore));
    setGameStatus("playing");
    setShowingPokemons([]);
    setModesPokemons(
      modesPokemons.map((pokemon) => {
        return {
          ...pokemon,
          clicked: false,
        };
      })
    );
  };

  const selectRandomPokemons = useCallback(
    (pokemons) => {
      // try if gameMode is null to return
      if (gameMode === null) return;

      const notClicked = pokemons.findIndex(
        (pokemon) => pokemon.clicked === false
      );

      //* If all pokemons are clicked the user won
      if (notClicked !== -1) {
        const options = pokemons
          .filter((pokemon) => pokemon.id !== pokemons[notClicked].id)
          .map((pokemon) => pokemon.id);

        const numberOfPokemons =
          gameMode === "easy"
            ? 3
            : gameMode === "normal"
            ? 4
            : gameMode === "hard" && 5;

        const selectedPokemons = getRandomElements(
          options,
          numberOfPokemons,
          pokemons[notClicked].id
        );

        console.log(selectedPokemons, "selectedPokemons");

        setShowingPokemons(
          selectedPokemons.map((id) =>
            pokemons.find((pokemon) => pokemon.id === id)
          )
        );
      } else {
        setGameStatus("You Won");
        setShowingPokemons([]);
      }
    },
    [gameMode, getRandomElements]
  );

  const handleCardClick = (pokemonParam) => {
    setIsClicked(true);
    if (isClicked) return;

    //* If the pokemon clicked was already clicked before the user loses
    if (pokemonParam.clicked) {
      setGameStatus("Game Over!");
      setShowingPokemons([]);
      return;
    }

    setShuffling(true);

    setTimeout(() => {
      setModesPokemons((prevPokemons) =>
        prevPokemons.map((pokemon) =>
          pokemon.id === pokemonParam.id
            ? { ...pokemon, clicked: true }
            : pokemon
        )
      );

      setRounds(rounds + 1);
      setCurrentScore((currentScore) => {
        const newScore = currentScore + 1;
        if (newScore > bestScore) {
          setBestScore(newScore);
        }
        return newScore;
      });
    }, 800);

    setTimeout(() => {
      setShuffling(false);
      setIsClicked(false);
    }, 1500);
  };

  function updateGameMode(gameMode) {
    setGameMode(gameMode);
    const numberOfPokemons =
      gameMode === "easy"
        ? 5
        : gameMode === "normal"
        ? 7
        : gameMode === "hard" && 10;

    const shuffled = pokeData.sort(() => 0.5 - Math.random());
    setModesPokemons(shuffled.slice(0, numberOfPokemons));
  }

  const fetchPokeData = (pokemons) => {
    const fetchPromises = pokemons.map((pokemon) =>
      fetch(pokemon.url).then((res) => res.json())
    );

    const timeoutPromise = new Promise((resolve) => {
      setTimeout(() => {
        setLoaded(true);
        resolve();
      }, 2000);
    });

    Promise.all([...fetchPromises, timeoutPromise]).then((data) => {
      const dataNeeded = data
        .filter((item) => item !== undefined)
        .map((pokemon) => {
          return {
            id: pokemon.id,
            name: pokemon.name,
            sprites: pokemon.sprites,
            clicked: false,
          };
        });
      setPokeData(dataNeeded);
    });
  };

  useEffect(() => {
    const limit = 10;
    fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=0`)
      .then((res) => res.json())
      .then((data) => fetchPokeData(data.results));
  }, []);

  useEffect(() => {
    if (modesPokemons.length > 0) {
      selectRandomPokemons(modesPokemons);
    }

    console.log(modesPokemons, "modesPokemons");
  }, [modesPokemons, selectRandomPokemons]);

  useEffect(() => {
    modesPokemons.map((pokemon) =>
      showingPokemons.includes(pokemon.id) ? console.log(pokemon) : pokemon
    );
    console.log(showingPokemons, "showing pokemons");
  }, [showingPokemons, modesPokemons]);

  const totalOfRounds =
    gameMode === "easy"
      ? 5
      : gameMode === "normal"
      ? 7
      : gameMode === "hard" && 10;

  return (
    <>
      <Header
        currentScore={currentScore}
        bestScore={bestScore}
        gameMode={gameMode}
        returnStart={returnStart}
      />

      <video autoPlay muted loop id="myVideo">
        <source src={video} type="video/mp4" />
        Your browser does not support HTML5 video.
      </video>

      <div className="cards">
        {gameMode &&
          showingPokemons.length > 0 &&
          showingPokemons.map((pokemon, index) => (
            <Card
              shuffling={shuffling}
              key={`${index}${pokemon.name}`}
              pokemon={pokemon}
              handleCardClick={handleCardClick}
            />
          ))}
      </div>

      {gameMode && showingPokemons.length > 0 && (
        <p className="rounds-count">
          Round: {rounds}/{totalOfRounds}
        </p>
      )}

      {gameStatus !== "playing" && (
        <div className="restart">
          <h2>{gameStatus}</h2>
          <button onClick={restartGame}>Restart</button>
        </div>
      )}

      {!loaded && <Loading />}

      {!gameMode && loaded && (
        <div className="select-modes">
          <h2>Select Mode</h2>
          <div className="modes">
            <button onClick={() => updateGameMode("easy")}>Easy</button>
            <button onClick={() => updateGameMode("normal")}>Normal</button>
            <button onClick={() => updateGameMode("hard")}>Hard</button>
          </div>
        </div>
      )}
    </>
  );
};

export default App;
