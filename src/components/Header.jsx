import "./Header.css";

const Header = ({ currentScore, bestScore, gameMode }) => {
  return (
    <header className={`header ${!gameMode && "header--center"}`}>
      <h1>
        <a href="/">Pokemon Memory Game</a>
      </h1>

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
