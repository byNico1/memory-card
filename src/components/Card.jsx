// import Tilt from "react-parallax-tilt";
import "./Card.css";

const Card = ({ pokemon, handleCardClick, shuffling }) => {
  return (
    <div
      className={shuffling ? `card card-shuffling` : `card`}
      onClick={() => handleCardClick(pokemon)}
    >
      <div className="tilt">
        <div className="card-front">
          <h2>{pokemon.name}</h2>
          <img
            width={200}
            height={200}
            src={pokemon.sprites.front_default}
            alt={pokemon.name}
          />
        </div>
        <div className="card-back"></div>
      </div>
    </div>
  );
};

export default Card;
