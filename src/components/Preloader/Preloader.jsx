import { useEffect, useState } from "react";
import useMedia from "../../hooks/UseMadia";
import s from "./Preloader.module.css";

const Preloader = () => {
  const [visible, setVisible] = useState(true);
  const { isTablet, isDesktop } = useMedia();

  const firstPart = "<div>eveloper";
  const secondPart = "studio";

  const totalLetters = firstPart.length + secondPart.length;

  useEffect(() => {
    const animationDuration =
      totalLetters * 100 + secondPart.length * 100 + 2000;
    const timer = setTimeout(() => {
      setVisible(false);
    }, animationDuration);

    return () => clearTimeout(timer);
  }, [totalLetters]);

  if (!visible) return null;

  let fontSize = "14px";
  if (isTablet) fontSize = "40px";
  if (isDesktop) fontSize = "80px";

  let loaderFontSize = "10px";
  if (isTablet) loaderFontSize = "18px";
  if (isDesktop) loaderFontSize = "22px";

  return (
    <div className={s.preloader}>
      <p className={s["preloader-txt"]} style={{ fontSize }}>
        {firstPart.split("").map((char, index) => (
          <span
            key={`first-${index}`}
            className={s.letter}
            style={{ animationDelay: `${(index + 1) * 0.1}s`, fontSize }}
          >
            {char}
          </span>
        ))}
        <span style={{ display: "inline-block", width: "20px" }}></span>
        {secondPart.split("").map((char, index) => (
          <span
            key={`second-${index}`}
            className={`${s.letter} ${s.studio}`}
            style={{
              animationDelay: `${(firstPart.length + index + 1) * 0.1}s`,
              fontSize,
            }}
          >
            {char}
          </span>
        ))}
      </p>
      <span className={s.loader} style={{ fontSize: loaderFontSize }}>
        Please wait, loading
      </span>
    </div>
  );
};

export default Preloader;
