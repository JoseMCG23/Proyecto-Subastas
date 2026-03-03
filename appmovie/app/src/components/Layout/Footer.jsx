export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-neutral-950/60 backdrop-blur">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-10 md:grid-cols-4">
        <div>
          <p className="text-sm font-semibold">SubastasFunko</p>
          <p className="mt-2 text-sm text-white/60">
            Marketplace premium de subastas de Funko Pop para coleccionistas.
          </p>
          <p className="mt-4 text-xs text-white/40">© {new Date().getFullYear()} ISW-613</p>
        </div>

        <div>
          <p className="text-sm font-semibold">Marketplace</p>
          <ul className="mt-3 space-y-2 text-sm text-white/60">
            <li>Explorar</li>
            <li>Vender</li>
            <li>Tendencias</li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold">Soporte</p>
          <ul className="mt-3 space-y-2 text-sm text-white/60">
            <li>Centro de ayuda</li>
            <li>Guía del comprador</li>
            <li>Contacto</li>
          </ul>
        </div>


      </div>
    </footer>
  );
}