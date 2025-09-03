import { ScaleLoader } from "react-spinners";
import s from "./Loader.module.css";

const Loader = () => {
  return (
    <div className={s.loader}>
      <ScaleLoader color="#9e40ba" height={50} margin={4} />
    </div>
  );
};

export default Loader;
