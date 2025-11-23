import { useState, useEffect } from "react";

const BottomBar = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentPath, setCurrentPath] = useState("");

  // Obtener la ruta actual y mostrar los botones cuando el usuario haga scroll
  useEffect(() => {
    setCurrentPath(window.location.pathname);

    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
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

  // Calcular la ruta de retroceso
  const getBackPath = (path: string) => {
    // Normalizar la ruta removiendo barra final si existe
    const normalizedPath = path.replace(/\/$/, "") || "/";
    if (normalizedPath === "/") return null; // En la raíz, no hay retroceso
    const segments = normalizedPath.split("/").filter(Boolean);
    segments.pop(); // Remover el último segmento
    return "/" + segments.join("/") || "/";
  };

  const backPath = getBackPath(currentPath);

  return (
    <section
      className={`
        fixed bottom-12 xs:bottom-10 right-0 left-0 z-10
        max-w-3xl mx-auto px-5
        pointer-events-none
        transition-opacity duration-300
        ${isVisible ? "opacity-100" : "opacity-0"}`}
    >
      <div
        className={`flex ${
          backPath ? "justify-between" : "justify-end"
        } items-center`}
      >
        {backPath && (
          <a
            title="go back"
            className="
              w-8 h-8 rounded-full flex items-center justify-center
              border border-cz-orange-goback bg-cz-orange-goback/10 cursor-pointer
              text-cz-orange-goback hover:scale-110 transition-all
              pointer-events-auto
            "
            href={backPath}
          >
            ←
          </a>
        )}
        {/* Aquí debe ir los elementos de Share */}
        <button
          title="go to top"
          onClick={scrollToTop}
          className="scroll-totop-btn pointer-events-auto"
        >
          ↑
        </button>
      </div>
    </section>
  );
};

export default BottomBar;
