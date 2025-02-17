import { useEffect } from "react";
import logo from '../../src/assets/images/Logo.png'
const FaviconUpdater = () => {
  useEffect(() => {
    const link = document.querySelector("link[rel='icon']");
    if (link) {
      link.href = logo;
    } else {
      const newLink = document.createElement("link");
      newLink.rel = "icon";
      newLink.href = logo;
      document.head.appendChild(newLink);
    }
  }, []);

  return null;
};

export default FaviconUpdater;
