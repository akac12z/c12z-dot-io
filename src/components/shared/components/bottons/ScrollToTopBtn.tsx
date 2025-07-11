import { useState, useEffect } from "react";

const ScrollToTopBtn = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Mostrar el botón cuando el usuario haga scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        // Aparece después de hacer scroll 300px
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup al desmontar
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className={`
        fixed bottom-12 xs:bottom-10 right-0 left-0 z-10
        max-w-2xl mx-auto px-5
        ${
          isVisible
            ? "opacity-100 flex justify-end"
            : "pointer-events-none opacity-0 hidden"
        }`}
    >
      <button
        onClick={scrollToTop}
        className="
          w-8 h-8 rounded-full cursor-pointer
          border border-cz-primary bg-cz-primary/10
          text-cz-primary hover:scale-110 transition-all flex items-center justify-center
        "
      >
        ↑
      </button>
    </div>
  );
};

export default ScrollToTopBtn;
