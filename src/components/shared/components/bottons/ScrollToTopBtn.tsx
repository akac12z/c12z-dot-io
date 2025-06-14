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
        fixed bottom-12 xs:bottom-10 right-5 md:right-auto w-full max-w-[47rem] mx-auto
        ${
          isVisible
            ? "opacity-100 flex justify-end"
            : "pointer-events-none opacity-0 hidden"
        }`}
    >
      <button
        onClick={scrollToTop}
        className="
          w-8 h-8 sm:right-10 sm:bottom-10 rounded-full cursor-pointer
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
