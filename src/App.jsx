import "./App.css";

import { useState, useEffect } from "react";
import Header from "./components/Header";
import Card from "./components/Card";

const App = () => {
  const [pokeData, setPokeData] = useState([]);
  const [currentScore, setCurrentScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  // const [gameMode, setGameMode] = useState("normal");
  const [gameMode, setGameMode] = useState(null);
  const [showingPokemons, setShowingPokemons] = useState([]);
  const [gameStatus, setGameStatus] = useState("playing");

  function getRandomNumber() {
    const numbers = [0, 1, 2];
    const randomIndex = Math.floor(Math.random() * numbers.length);
    return numbers[randomIndex];
  }

  const getRandomElements = (pokemons, numElements, notClicked) => {
    const shuffled = pokemons.sort(() => 0.5 - Math.random());
    shuffled.splice(getRandomNumber(), 0, notClicked);
    return shuffled.slice(0, numElements);
  };

  const restartGame = () => {
    setCurrentScore(0);
    setBestScore(Math.max(currentScore, bestScore));
    setGameStatus("playing");
    setShowingPokemons([]);
    setPokeData(
      pokeData.map((pokemon) => {
        return {
          ...pokemon,
          clicked: false,
        };
      })
    );
  };

  const selectRandomPokemons = (pokemons) => {
    const notClicked = pokemons.findIndex(
      (pokemon) => pokemon.clicked === false
    );

    //* If all pokemons are clicked the user won
    if (notClicked !== -1) {
      const options = [];

      pokemons.forEach((pokemon) =>
        pokemon.id !== pokemons[notClicked].id
          ? options.push(pokemon.id)
          : pokemon
      );

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

      setShowingPokemons(selectedPokemons);
    } else {
      setGameStatus("You Won");
      setShowingPokemons([]);
    }
  };

  const fetchPokeData = (pokemons) => {
    const fetchPromises = pokemons.map((pokemon) =>
      fetch(pokemon.url).then((res) => res.json())
    );

    Promise.all(fetchPromises).then((data) => {
      const dataNeeded = data.map((pokemon) => {
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
    if (gameMode === "normal" || gameMode === "easy" || gameMode === "hard") {
      const limit = gameMode === "normal" ? 7 : gameMode === "easy" ? 5 : 10;
      fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=0`)
        .then((res) => res.json())
        .then((data) => fetchPokeData(data.results));
    }
  }, [gameMode]);

  const handleCardClick = (pokemonParam) => {
    //* If the pokemon clicked was already clicked before the user loses
    if (pokemonParam.clicked) {
      setGameStatus("Game Over!");
      setShowingPokemons([]);
      return;
    }

    const index = pokeData.findIndex(
      (pokemon) => pokemon.id === pokemonParam.id
    );
    if (index !== -1) {
      // fix: scoring
      setCurrentScore(currentScore + 1);
      if (currentScore + 1 > bestScore) {
        setBestScore(currentScore + 1);
      }
      setPokeData(
        pokeData.map((pokemon) => {
          if (pokemon.id === pokemonParam.id) {
            return {
              ...pokemon,
              clicked: true,
            };
          } else {
            return pokemon;
          }
        })
      );
    }
  };

  useEffect(() => {
    if (pokeData.length > 0) {
      selectRandomPokemons(pokeData);
    }
  }, [pokeData]);

  useEffect(() => {
    pokeData.map((pokemon) =>
      showingPokemons.includes(pokemon.id) ? console.log(pokemon) : pokemon
    );
    console.log(showingPokemons, "showing pokemons");
  }, [showingPokemons, pokeData]);

  return (
    <>
      <Header
        currentScore={currentScore}
        bestScore={bestScore}
        gameMode={gameMode}
      />

      <div className="cards">
        {gameMode &&
          showingPokemons.length > 0 &&
          showingPokemons
            .map((id) => pokeData.find((pokemon) => pokemon.id === id))
            .map((pokemon, index) => (
              <Card
                key={`${index}${pokemon.name}`}
                pokemon={pokemon}
                handleCardClick={handleCardClick}
              />
            ))}
      </div>

      {gameStatus !== "playing" && (
        <div className="restart">
          <h2>{gameStatus}</h2>
          <button onClick={restartGame}>Restart</button>
        </div>
      )}

      {!gameMode && (
        <div className="select-modes">
          <h2>Select Mode</h2>
          <div className="modes">
            <button onClick={() => setGameMode("normal")}>Normal Mode</button>
            <button onClick={() => setGameMode("easy")}>Easy Mode</button>
            <button onClick={() => setGameMode("hard")}>Hard Mode</button>
          </div>
        </div>
      )}
    </>
  );
};

export default App;
