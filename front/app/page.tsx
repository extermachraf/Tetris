import Link from "next/link"
import MobileMenu from "@/components/mobile-menu"
import TetrisGamePreview from "@/components/tetris-game-preview"

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 z-0 grid-bg"></div>

      {/* Decorative Tetris pieces */}
      <div className="tetris-decoration" style={{ top: "15%", left: "5%", transform: "rotate(15deg)" }}>
        <div className="w-16 h-4 bg-cyan-500/20"></div>
      </div>
      <div className="tetris-decoration" style={{ top: "70%", right: "10%", transform: "rotate(-20deg)" }}>
        <div className="w-8 h-8 bg-yellow-500/20"></div>
      </div>
      <div className="tetris-decoration" style={{ top: "40%", left: "8%", transform: "rotate(45deg)" }}>
        <div className="w-12 h-8 bg-purple-500/20"></div>
      </div>

      {/* Navbar */}
      <header className="relative z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-3xl font-bold text-cyan-400 tracking-wider glow-text pixel-text">
            TETRIS
          </Link>

          {/* Mobile menu button */}
          <div className="block lg:hidden">
            <MobileMenu />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-4">
            <Link href="/" className="nav-link">
              Home
            </Link>
            <Link href="/about" className="nav-link">
              About
            </Link>
            <Link href="/how-to-play" className="nav-link">
              How to Play
            </Link>
            <Link href="/high-scores" className="nav-link">
              High Scores
            </Link>

            <div className="ml-4 flex items-center gap-2">
              <Link href="/login" className="nav-button nav-button-signin">
                SIGN IN
              </Link>
              <Link href="/signup" className="nav-button nav-button-signup">
                SIGN UP
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10">
        <div className="container mx-auto px-4 py-12 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="hero-title">
                  <span className="block text-white glow-text-white">CLASSIC</span>
                  <span className="block text-cyan-400 glow-text">TETRIS</span>
                  <span className="block text-white glow-text-white">REIMAGINED</span>
                </h1>
                <p className="text-lg text-gray-300 max-w-lg font-roboto">
                  Experience the iconic block-stacking game with modern features, competitive multiplayer, and stunning
                  visuals. Challenge friends or climb the global leaderboards.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link href="/play" className="tetris-button tetris-button-primary">
                  PLAY NOW
                </Link>
                <Link href="/about" className="tetris-button tetris-button-secondary">
                  LEARN MORE
                </Link>
              </div>
            </div>

            <div className="relative">
              <TetrisGamePreview />
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="relative z-10 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="section-title">GAME MODES</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "CLASSIC",
                description: "The original Tetris gameplay with modern visuals and controls",
                color: "cyan",
              },
              {
                title: "SPRINT",
                description: "Clear 40 lines as quickly as possible to test your speed",
                color: "purple",
              },
              {
                title: "BATTLE",
                description: "Challenge friends or random players in competitive multiplayer",
                color: "yellow",
              },
            ].map((mode, index) => (
              <div key={index} className="game-mode-card">
                <h3 className={`game-mode-title text-${mode.color}-400`}>{mode.title}</h3>
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
      <section className="relative z-10 py-16 md:py-24 border-t border-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="section-title text-white glow-text-white">JOIN THE COMMUNITY</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Create an account to save your scores, compete on leaderboards, and challenge friends.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/signup" className="tetris-button tetris-button-primary">
              SIGN UP
            </Link>
            <Link href="/login" className="tetris-button tetris-button-secondary">
              LOG IN
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800 py-8">
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
    </div>
  )
}
