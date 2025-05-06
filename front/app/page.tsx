import Link from "next/link";
import TetrisGamePreview from "@/components/tetris-game-preview";

export default function Home() {
  return (
    <>
      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="hero-title">
                <span className="block text-white glow-text-white">
                  CLASSIC
                </span>
                <span className="block text-cyan-400 glow-text">TETRIS</span>
                <span className="block text-white glow-text-white">
                  REIMAGINED
                </span>
              </h1>
              <p className="text-lg text-gray-300 max-w-lg font-roboto">
                Experience the iconic block-stacking game with modern features,
                competitive multiplayer, and stunning visuals. Challenge friends
                or climb the global leaderboards.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/play"
                className="tetris-button tetris-button-primary"
              >
                PLAY NOW
              </Link>
              <Link
                href="/about"
                className="tetris-button tetris-button-secondary"
              >
                LEARN MORE
              </Link>
            </div>
          </div>

          <div className="relative">
            <TetrisGamePreview />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="section-title">GAME MODES</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "CLASSIC",
                description:
                  "The original Tetris gameplay with modern visuals and controls",
                color: "cyan",
              },
              {
                title: "BATTLE",
                description:
                  "Challenge friends or random players in competitive multiplayer",
                color: "yellow",
              },
            ].map((mode, index) => (
              <div key={index} className="game-mode-card">
                <h3 className={`game-mode-title text-${mode.color}-400`}>
                  {mode.title}
                </h3>
                <p className="text-gray-400">{mode.description}</p>
                <div className="mt-4">
                  <Link
                    href={`/play/${mode.title.toLowerCase()}`}
                    className="text-cyan-400 hover:text-cyan-300 font-bold pixel-text text-xs"
                  >
                    PLAY NOW →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sign Up Section */}
      <section className="py-16 md:py-24 border-t border-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="section-title text-white glow-text-white">
            JOIN THE COMMUNITY
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Create an account to save your scores, compete on leaderboards, and
            challenge friends.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/signup"
              className="tetris-button tetris-button-primary"
            >
              SIGN UP
            </Link>
            <Link
              href="/login"
              className="tetris-button tetris-button-secondary"
            >
              LOG IN
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-cyan-400 glow-text mb-4 md:mb-0 pixel-text text-sm">
              TETRIS © {new Date().getFullYear()}
            </div>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-gray-400 hover:text-white">
                Privacy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white">
                Terms
              </Link>
              <Link href="/contact" className="text-gray-400 hover:text-white">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
