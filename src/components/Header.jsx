import "./Header.css";

const Header = ({ currentScore, bestScore, gameMode, returnStart }) => {
  return (
    <header className={`header ${!gameMode && "header--center"}`}>
      <h1 onClick={returnStart}>Pokemon Memory Game</h1>

      {gameMode && (
        <div>
          <p>Score: {currentScore}</p>
          <p>Best Score: {bestScore}</p>
        </div>
      )}
    </header>
  );
};

export default Header;
