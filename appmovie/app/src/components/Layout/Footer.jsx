export function Footer() {
  return (
    <footer className="fixed bottom-0 w-full bg-neutral-900 text-white border-t border-neutral-800 flex items-center justify-center px-4 py-3">
      <div className="w-full max-w-7xl text-center">
        <p className="text-sm font-medium">ISW-613</p>
        <p className="text-xs text-neutral-300">{new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}