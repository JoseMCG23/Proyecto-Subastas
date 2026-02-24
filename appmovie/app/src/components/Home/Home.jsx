

export function Home() {
  return (
    <div className="w-full min-h-[calc(100vh-8rem)] flex items-center justify-center bg-white">
      <div className="text-center px-4">
        <h1 className="text-5xl font-extrabold text-black mb-4">
          Subasta de Funko Pop
        </h1>
        <p className="text-black/70 mb-6">
          Descubre y consigue tus funkos favoritos.
        </p>

        <div className="flex justify-center gap-4">
          <a
            href="/funkos"
            className="px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-neutral-800 transition"
          >
            Ver Funkos
          </a>
          <a
            href="/users"
            className="px-6 py-3 border border-black text-black rounded-lg font-semibold hover:bg-neutral-100 transition"
          >
            Ver Usuarios
          </a>
        </div>
      </div>
    </div>
  );
}

