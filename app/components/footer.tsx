export function Footer() {
  return (
    <footer className=" right-0 w-full bg-gray-50  font-light md:fixed md:bottom-0 md:left-1/2 md:-translate-x-1/2">
      <div className="p-4 text-primary/80 text-center font-mono text-xs leading-loose">
        <a
          href="https://github.com/rutopio"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div>Made by ChingRu (Github@rutopio)</div>
        </a>
        <div>
          Noted that Color Font format is not supported on some devices and
          browsers. Use Desktop Chrome for best experience.
        </div>
      </div>
    </footer>
  );
}
