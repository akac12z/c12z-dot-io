export default function GoBackInTop() {
  const goBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      alert("No previous browsing history!");
    }
  };

  return (
    <button
      className="my-2 px-1 py-0.5 text-xs font-museo_moderno tracking-widest border border-mr-neon-orange text-mr-text-content rounded opacity-50 hover:opacity-100 flex items-center justify-center gap-1"
      onClick={goBack}
    >
      ← Atrás
    </button>
  );
}
