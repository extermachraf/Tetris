import Link from "next/link"
import { Trophy, Medal, Star, Crown } from "lucide-react"

export default function HighScores() {
  // Mock data for high scores
  const highScores = [
    { rank: 1, username: "TETRISMASTER", score: 999999, level: 29, lines: 293, date: "2023-04-15" },
    { rank: 2, username: "BLOCKSTACKER", score: 876543, level: 26, lines: 265, date: "2023-04-12" },
    { rank: 3, username: "LINECLEARER", score: 765432, level: 24, lines: 241, date: "2023-04-10" },
    { rank: 4, username: "PIXELGAMER", score: 654321, level: 22, lines: 220, date: "2023-04-08" },
    { rank: 5, username: "TETRONIMO", score: 543210, level: 20, lines: 198, date: "2023-04-05" },
    { rank: 6, username: "ARCADEPRO", score: 432109, level: 18, lines: 176, date: "2023-04-03" },
    { rank: 7, username: "RETROGAMER", score: 321098, level: 16, lines: 154, date: "2023-04-01" },
    { rank: 8, username: "HIGHSCORER", score: 210987, level: 14, lines: 132, date: "2023-03-28" },
    { rank: 9, username: "GAMEMASTER", score: 109876, level: 12, lines: 110, date: "2023-03-25" },
    { rank: 10, username: "PLAYER1", score: 98765, level: 10, lines: 88, date: "2023-03-22" },
  ]

  return (
    <div className="page-container">
      {/* Grid Background */}
      <div className="absolute inset-0 z-0 grid-bg"></div>

      {/* Decorative elements */}
      <div className="tetris-decoration" style={{ top: "15%", right: "8%" }}>
        <div className="w-12 h-24 bg-blue-500/20 rotate-12"></div>
      </div>
      <div className="tetris-decoration" style={{ bottom: "25%", left: "5%" }}>
        <div className="w-20 h-20 bg-green-500/20 rotate-45"></div>
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
            <Link href="/about" className="nav-link">
              About
            </Link>
            <Link href="/how-to-play" className="nav-link">
              How to Play
            </Link>
            <Link href="/high-scores" className="nav-link text-cyan-400 border-b-2 border-cyan-400">
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
        <h1 className="page-title">HIGH SCORES</h1>

        <div className="content-card">
          {/* Top Players Highlight */}
          <div className="content-section">
            <h2 className="content-section-title">TOP PLAYERS</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {highScores.slice(0, 3).map((score, index) => (
                <div
                  key={index}
                  className={`bg-black/40 border border-gray-800 p-5 relative overflow-hidden ${
                    index === 0 ? "border-yellow-500/50" : index === 1 ? "border-gray-400/50" : "border-orange-700/50"
                  }`}
                >
                  <div className="absolute top-0 right-0 p-2 text-2xl opacity-10">
                    {index === 0 ? <Crown size={64} /> : index === 1 ? <Medal size={64} /> : <Star size={64} />}
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`text-2xl font-bold ${
                        index === 0 ? "text-yellow-400" : index === 1 ? "text-gray-300" : "text-orange-600"
                      }`}
                    >
                      #{score.rank}
                    </div>
                    <div className="text-lg font-pixel text-white">{score.username}</div>
                  </div>
                  <div className="text-2xl font-mono text-cyan-400 mb-2">{score.score.toLocaleString()}</div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-400">
                    <div>
                      Level: <span className="text-white">{score.level}</span>
                    </div>
                    <div>
                      Lines: <span className="text-white">{score.lines}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Leaderboard Table */}
          <div className="content-section">
            <h2 className="content-section-title">LEADERBOARD</h2>
            <div className="overflow-hidden border border-gray-800 bg-black/30">
              <table className="score-table">
                <thead>
                  <tr>
                    <th className="score-header">RANK</th>
                    <th className="score-header">PLAYER</th>
                    <th className="score-header">SCORE</th>
                    <th className="score-header">LEVEL</th>
                    <th className="score-header">LINES</th>
                    <th className="score-header">DATE</th>
                  </tr>
                </thead>
                <tbody>
                  {highScores.map((score, index) => (
                    <tr key={index} className={`score-row ${index < 3 ? "score-highlight" : ""}`}>
                      <td className="score-cell">
                        <span className="score-rank">
                          {index === 0 ? <Trophy className="inline-block text-yellow-400 mr-1" size={14} /> : null}
                          {score.rank}
                        </span>
                      </td>
                      <td className="score-cell font-pixel text-sm">{score.username}</td>
                      <td className="score-cell score-value">{score.score.toLocaleString()}</td>
                      <td className="score-cell">{score.level}</td>
                      <td className="score-cell">{score.lines}</td>
                      <td className="score-cell text-gray-400">{score.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Game Modes Tabs */}
          <div className="content-section mt-10">
            <h2 className="content-section-title">GAME MODES</h2>
            <div className="flex border-b border-gray-800 mb-6">
              <button className="px-4 py-2 text-cyan-400 border-b-2 border-cyan-400 font-pixel text-xs">CLASSIC</button>
              <button className="px-4 py-2 text-gray-400 hover:text-gray-300 font-pixel text-xs">SPRINT</button>
              <button className="px-4 py-2 text-gray-400 hover:text-gray-300 font-pixel text-xs">BATTLE</button>
            </div>

            <p className="text-gray-300 mb-6">
              These are the top scores for the Classic game mode. Switch tabs to view other game modes.
            </p>
          </div>

          {/* CTA Section */}
          <div className="mt-12 text-center">
            <p className="text-gray-300 mb-6">Think you can beat these scores?</p>
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
