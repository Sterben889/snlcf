export function CopyrightFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black px-4 py-8 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-center text-center">
        <p className="text-sm font-medium sm:text-base">
          &copy; {currentYear} Saskatoon New Life Community Fellowship. All
          rights reserved.
        </p>
      </div>
    </footer>
  );
}
