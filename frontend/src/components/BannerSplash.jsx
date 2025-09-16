import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function BannerSplash({ image, duration = 3000, onFinish }) {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (window.innerWidth >= 768) {
      setShowBanner(true);
      const timer = setTimeout(() => {
        setShowBanner(false);
        if (onFinish) onFinish();
      }, duration);
      return () => clearTimeout(timer);
    } else {
      if (onFinish) onFinish();
    }
  }, [duration, onFinish]);

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="fixed inset-0 z-50 w-full h-full overflow-hidden"
        >
          <img
            src={image}
            alt="Team Butterr Flies Banner"
            className="w-full h-full object-cover"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

