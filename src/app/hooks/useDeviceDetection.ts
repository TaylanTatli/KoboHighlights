import { useEffect, useState } from "react";

const useDeviceDetection = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const handleDeviceDetection = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobile =
        /iphone|ipad|ipod|android|blackberry|windows phone|tablet|playbook|silk/g.test(
          userAgent,
        );
      const isAndroid = /android/g.test(userAgent);
      const isIOS = /iphone|ipad|ipod/g.test(userAgent);

      setIsMobile(isMobile);
      setIsAndroid(isAndroid);
      setIsIOS(isIOS);
    };

    handleDeviceDetection();
    window.addEventListener("resize", handleDeviceDetection);

    return () => {
      window.removeEventListener("resize", handleDeviceDetection);
    };
  }, []);

  return { isMobile, isAndroid, isIOS };
};

export default useDeviceDetection;
