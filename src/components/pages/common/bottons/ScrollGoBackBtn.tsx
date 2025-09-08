import { useState, useEffect } from "react";

interface Props {
  headPage: string; // Ruta a la que se redirige
}

export default function TestingGoTo({ headPage }: Props) {
  const [isVisible, setIsVisible] = useState(false);

  // Mostrar u ocultar el enlace según el scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup al desmontar
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`
        fixed bottom-12 xs:bottom-10 right-0 left-0 z-10
        max-w-2xl mx-auto px-5
        transition-opacity duration-300
        ${
          isVisible
            ? "opacity-100 flex justify-start"
            : "pointer-events-none opacity-0 hidden"
        }`}
    >
      <a
        className="
          w-8 h-8 rounded-full flex items-center justify-center
          border border-cz-orange-goback bg-cz-orange-goback/10 cursor-pointer
          text-cz-orange-goback hover:scale-110 transition-all 
        "
        href={headPage}
      >
        ←
      </a>
    </div>
  );
}
