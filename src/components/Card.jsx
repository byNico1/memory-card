import "./Card.css";

const Card = ({ pokemon, handleCardClick }) => {
  return (
    <div className="card" onClick={() => handleCardClick(pokemon)}>
      <h2>{pokemon.name}</h2>
      <img
        width={200}
        height={200}
        src={pokemon.sprites.front_default}
        alt={pokemon.name}
      />
    </div>
  );
};

export default Card;
