import ashrunning from "../assets/ashrunning.gif";
import "./Loading.css";

const Loading = () => {
  return (
    <div className="loading">
      <img src={ashrunning} alt="ash running" width={150} />
      <p>Loading...</p>
    </div>
  );
};

export default Loading;
