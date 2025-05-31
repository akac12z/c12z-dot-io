import type { TableOfContentsProps } from "@interfaces/TableOfContent.interface";
import { useState, useEffect, useRef } from "react";

const TableOfContents: React.FC<TableOfContentsProps> = ({ headings }) => {
  const [isVisible, setIsVisible] = useState(false);
  const tocRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!tocRef.current?.contains(event.target as Node)) setIsVisible(false);
    };

    if (isVisible) document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isVisible]);

  const handleLinkClick = () => setIsVisible(false);

  return (
    <section className="flex flex-col justify-start items-start text-left w-full max-w-2xl mb-6">
      <div className="relative " ref={tocRef}>
        <button
          aria-expanded={isVisible}
          onClick={() => setIsVisible(!isVisible)}
          className="flex items-center text-mr-text-headers text-sm cursor-pointer"
        >
          Tabla de Contenidos
          <span
            className={`ml-2 transform transition-transform duration-500 ${
              isVisible ? "rotate-180 text-mr-neon-orange" : "rotate-0"
            }`}
          >
            ▿
          </span>
        </button>
        {isVisible && (
          <div className="backdrop-blur-lg border border-mr-text-relax p-1 z-10 overflow-y-auto absolute w-72 xs:w-96 left-0 pt-4 rounded-tr-lg rounded-br-lg rounded-bl-lg">
            <ul>
              {headings.map(({ slug, text }) => (
                <li key={slug} className="ml-2 mr-1 mb-1">
                  <a
                    className="font-rubik text-xs"
                    href={`#${slug}`}
                    onClick={handleLinkClick}
                  >
                    · {text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};

export default TableOfContents;
