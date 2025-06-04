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
      className="my-2 px-1 py-0.5 text-xs font-museo_moderno tracking-widest border border-cz-orange-goback text-cz-text-content-dark rounded opacity-50 hover:opacity-100 flex items-center justify-center gap-1"
      onClick={goBack}
    >
      ← Atrás
    </button>
  );
}
