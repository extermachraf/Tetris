import Link from "next/link"
import { Gamepad2, Trophy, Users, BarChart3, Sparkles, Smartphone, Globe, Clock } from "lucide-react"

export default function About() {
  return (
    <div className="page-container">
      {/* Grid Background */}
      <div className="absolute inset-0 z-0 grid-bg"></div>

      {/* Decorative elements */}
      <div className="tetris-decoration" style={{ top: "20%", right: "10%" }}>
        <div className="w-20 h-20 bg-purple-500/20 rotate-12"></div>
      </div>
      <div className="tetris-decoration" style={{ bottom: "30%", left: "5%" }}>
        <div className="w-32 h-8 bg-cyan-500/20 -rotate-12"></div>
      </div>

      {/* Navbar */}
      <header className="page-header">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-3xl font-bold text-cyan-400 tracking-wider glow-text pixel-text">
            TETRIS
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-4">
            <Link href="/" className="nav-link">
              Home
            </Link>
            <Link href="/about" className="nav-link text-cyan-400 border-b-2 border-cyan-400">
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
      <main className="page-content">
        <h1 className="page-title">ABOUT TETRIS</h1>

        <div className="content-card">
          {/* Intro Section with animated background */}
          <div className="content-section relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 -z-10"></div>
            <h2 className="content-section-title">THE GAME</h2>
            <p className="text-gray-300 mb-6 relative">
              <span className="block mb-4">
                Tetris is a tile-matching puzzle game created by Russian software engineer Alexey Pajitnov in 1984. The
                game has sold more than 200 million copies worldwide since its creation, making it one of the
                best-selling video game franchises of all time.
              </span>
              <span className="block">
                Our reimagined version brings the classic gameplay to modern browsers with enhanced visuals, competitive
                features, and online multiplayer. We've stayed true to the original mechanics while adding
                quality-of-life improvements and new game modes to keep things fresh.
              </span>
            </p>
          </div>

          {/* Features Section with icons */}
          <div className="content-section mt-10">
            <h2 className="content-section-title">FEATURES</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="about-feature">
                <div className="about-feature-icon">
                  <Gamepad2 size={24} />
                </div>
                <div className="about-feature-text">Classic Tetris gameplay with modern visuals and controls</div>
              </div>

              <div className="about-feature">
                <div className="about-feature-icon">
                  <Clock size={24} />
                </div>
                <div className="about-feature-text">Multiple game modes including Sprint, Marathon, and Battle</div>
              </div>

              <div className="about-feature">
                <div className="about-feature-icon">
                  <Trophy size={24} />
                </div>
                <div className="about-feature-text">Global leaderboards to compete with players worldwide</div>
              </div>

              <div className="about-feature">
                <div className="about-feature-icon">
                  <Users size={24} />
                </div>
                <div className="about-feature-text">Account system to track your progress and stats</div>
              </div>

              <div className="about-feature">
                <div className="about-feature-icon">
                  <BarChart3 size={24} />
                </div>
                <div className="about-feature-text">Detailed statistics to analyze and improve your gameplay</div>
              </div>

              <div className="about-feature">
                <div className="about-feature-icon">
                  <Sparkles size={24} />
                </div>
                <div className="about-feature-text">Customizable controls and display options</div>
              </div>

              <div className="about-feature">
                <div className="about-feature-icon">
                  <Smartphone size={24} />
                </div>
                <div className="about-feature-text">Mobile-friendly design for gaming on the go</div>
              </div>

              <div className="about-feature">
                <div className="about-feature-icon">
                  <Globe size={24} />
                </div>
                <div className="about-feature-text">Cross-platform play between desktop and mobile</div>
              </div>
            </div>
          </div>

          {/* Timeline Section */}
          <div className="content-section mt-10">
            <h2 className="content-section-title">TETRIS EVOLUTION</h2>
            <div className="relative border-l-2 border-cyan-800 ml-4 pl-8 py-4">
              {/* Timeline items */}
              {[
                { year: "1984", event: "Original Tetris created by Alexey Pajitnov" },
                { year: "1989", event: "Nintendo releases Tetris for Game Boy" },
                { year: "1990s", event: "Tetris becomes available on virtually every gaming platform" },
                { year: "2000s", event: "Online competitive Tetris emerges" },
                { year: "2010s", event: "Tetris Effect and other modern adaptations" },
                { year: "2023", event: "Our reimagined version launches with new features" },
              ].map((item, index) => (
                <div key={index} className="mb-8 relative">
                  <div className="absolute -left-10 w-2 h-2 rounded-full bg-cyan-400"></div>
                  <div className="text-cyan-400 font-pixel text-sm mb-1">{item.year}</div>
                  <div className="text-gray-300">{item.event}</div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-12 text-center">
            <p className="text-gray-300 mb-6">Ready to experience the evolution of a classic?</p>
            <Link href="/play" className="tetris-button tetris-button-primary inline-block">
              PLAY NOW
            </Link>
          </div>
        </div>
      </main>

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
