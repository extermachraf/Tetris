import Link from "next/link";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  KeySquare,
  Space,
  Pause,
  RotateCcw,
} from "lucide-react";

export default function HowToPlay() {
  return (
    <div className="page-container">
      {/* Decorative elements */}
      <div className="tetris-decoration" style={{ top: "30%", left: "5%" }}>
        <div className="w-16 h-16 bg-yellow-500/20 rotate-45"></div>
      </div>
      <div
        className="tetris-decoration"
        style={{ bottom: "20%", right: "10%" }}
      >
        <div className="w-24 h-8 bg-red-500/20 -rotate-12"></div>
      </div>

      {/* Main Content */}
      <main className="page-content">
        <h1 className="page-title">HOW TO PLAY</h1>

        <div className="content-card">
          {/* Interactive Controls Section */}
          <div className="content-section">
            <h2 className="content-section-title">CONTROLS</h2>
            <div className="controls-grid">
              <div className="control-item">
                <div className="control-key flex items-center">
                  <ArrowLeft size={16} className="mr-2" />{" "}
                  <span className="key-box">←</span>
                </div>
                <p className="control-desc">Move piece left</p>
              </div>

              <div className="control-item">
                <div className="control-key flex items-center">
                  <ArrowRight size={16} className="mr-2" />{" "}
                  <span className="key-box">→</span>
                </div>
                <p className="control-desc">Move piece right</p>
              </div>

              <div className="control-item">
                <div className="control-key flex items-center">
                  <ArrowUp size={16} className="mr-2" />{" "}
                  <span className="key-box">↑</span>
                </div>
                <p className="control-desc">Rotate piece clockwise</p>
              </div>

              <div className="control-item">
                <div className="control-key flex items-center">
                  <ArrowDown size={16} className="mr-2" />{" "}
                  <span className="key-box">↓</span>
                </div>
                <p className="control-desc">Soft drop (move down faster)</p>
              </div>

              <div className="control-item">
                <div className="control-key flex items-center">
                  <Space size={16} className="mr-2" />{" "}
                  <span className="key-box">Space</span>
                </div>
                <p className="control-desc">Hard drop (instant placement)</p>
              </div>

              <div className="control-item">
                <div className="control-key flex items-center">
                  <KeySquare size={16} className="mr-2" />{" "}
                  <span className="key-box">C</span>
                </div>
                <p className="control-desc">Hold current piece</p>
              </div>

              <div className="control-item">
                <div className="control-key flex items-center">
                  <RotateCcw size={16} className="mr-2" />{" "}
                  <span className="key-box">Z</span>
                </div>
                <p className="control-desc">Rotate piece counter-clockwise</p>
              </div>

              <div className="control-item">
                <div className="control-key flex items-center">
                  <Pause size={16} className="mr-2" />{" "}
                  <span className="key-box">P</span>
                </div>
                <p className="control-desc">Pause game</p>
              </div>
            </div>
          </div>

          {/* Tetris Pieces Section */}
          <div className="content-section mt-10">
            <h2 className="content-section-title">TETROMINOS</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-4">
              {[
                {
                  name: "I-Piece",
                  color: "bg-cyan-500",
                  shape: [[1, 1, 1, 1]],
                },
                {
                  name: "O-Piece",
                  color: "bg-yellow-500",
                  shape: [
                    [1, 1],
                    [1, 1],
                  ],
                },
                {
                  name: "T-Piece",
                  color: "bg-purple-500",
                  shape: [
                    [0, 1, 0],
                    [1, 1, 1],
                  ],
                },
                {
                  name: "S-Piece",
                  color: "bg-green-500",
                  shape: [
                    [0, 1, 1],
                    [1, 1, 0],
                  ],
                },
                {
                  name: "Z-Piece",
                  color: "bg-red-500",
                  shape: [
                    [1, 1, 0],
                    [0, 1, 1],
                  ],
                },
                {
                  name: "J-Piece",
                  color: "bg-blue-500",
                  shape: [
                    [1, 0, 0],
                    [1, 1, 1],
                  ],
                },
                {
                  name: "L-Piece",
                  color: "bg-orange-500",
                  shape: [
                    [0, 0, 1],
                    [1, 1, 1],
                  ],
                },
              ].map((piece, index) => (
                <div
                  key={index}
                  className="bg-black/30 p-4 border border-gray-800 text-center"
                >
                  <div className="mb-3 flex justify-center">
                    <div
                      className="grid gap-1"
                      style={{
                        gridTemplateRows: `repeat(${piece.shape.length}, 1fr)`,
                        gridTemplateColumns: `repeat(${piece.shape[0].length}, 1fr)`,
                      }}
                    >
                      {piece.shape.flat().map((cell, i) => (
                        <div
                          key={i}
                          className={`w-5 h-5 ${
                            cell ? piece.color : "bg-transparent"
                          }`}
                        ></div>
                      ))}
                    </div>
                  </div>
                  <div className="text-xs font-pixel text-gray-300">
                    {piece.name}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Basic Rules Section */}
          <div className="content-section mt-10">
            <h2 className="content-section-title">BASIC RULES</h2>
            <div className="bg-black/30 p-5 border border-gray-800">
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <span className="text-cyan-400 mr-2">•</span>
                  <span>
                    Tetriminos (game pieces) fall from the top of the field.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-400 mr-2">•</span>
                  <span>
                    Your goal is to create horizontal lines with the blocks.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-400 mr-2">•</span>
                  <span>
                    When a line is created, it disappears and you earn points.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-400 mr-2">•</span>
                  <span>
                    The game ends when the blocks reach the top of the field.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-400 mr-2">•</span>
                  <span>As you progress, the pieces fall faster.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Scoring Section */}
          <div className="content-section mt-10">
            <h2 className="content-section-title">SCORING</h2>
            <div className="overflow-hidden border border-gray-800">
              <table className="w-full">
                <thead>
                  <tr className="bg-black/70">
                    <th className="text-left p-3 text-cyan-400 font-pixel text-xs">
                      Action
                    </th>
                    <th className="text-left p-3 text-cyan-400 font-pixel text-xs">
                      Points
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  <tr className="bg-black/30">
                    <td className="p-3 text-gray-300">Single Line Clear</td>
                    <td className="p-3 text-cyan-400 font-mono">100 × Level</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-gray-300">Double Line Clear</td>
                    <td className="p-3 text-cyan-400 font-mono">300 × Level</td>
                  </tr>
                  <tr className="bg-black/30">
                    <td className="p-3 text-gray-300">Triple Line Clear</td>
                    <td className="p-3 text-cyan-400 font-mono">500 × Level</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-gray-300">
                      Tetris (Four Line Clear)
                    </td>
                    <td className="p-3 text-cyan-400 font-mono">800 × Level</td>
                  </tr>
                  <tr className="bg-black/30">
                    <td className="p-3 text-gray-300">Soft Drop</td>
                    <td className="p-3 text-cyan-400 font-mono">1 per cell</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-gray-300">Hard Drop</td>
                    <td className="p-3 text-cyan-400 font-mono">2 per cell</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Advanced Tips Section */}
          <div className="content-section mt-10">
            <h2 className="content-section-title">ADVANCED TIPS</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-black/30 p-4 border border-gray-800">
                <h3 className="text-cyan-400 font-pixel text-sm mb-2">
                  T-SPIN
                </h3>
                <p className="text-gray-300 text-sm">
                  Rotate a T piece into a tight spot for bonus points. T-Spins
                  can score more than a Tetris when executed properly!
                </p>
              </div>

              <div className="bg-black/30 p-4 border border-gray-800">
                <h3 className="text-cyan-400 font-pixel text-sm mb-2">
                  HOLD QUEUE
                </h3>
                <p className="text-gray-300 text-sm">
                  Use the hold queue strategically to save pieces for later or
                  to get out of difficult situations.
                </p>
              </div>

              <div className="bg-black/30 p-4 border border-gray-800">
                <h3 className="text-cyan-400 font-pixel text-sm mb-2">
                  WALL KICKS
                </h3>
                <p className="text-gray-300 text-sm">
                  When rotating near walls, pieces will try to "kick" away from
                  the wall to fit. Use this to your advantage!
                </p>
              </div>

              <div className="bg-black/30 p-4 border border-gray-800">
                <h3 className="text-cyan-400 font-pixel text-sm mb-2">
                  PERFECT CLEAR
                </h3>
                <p className="text-gray-300 text-sm">
                  Clear the entire board for a massive bonus. This is difficult
                  but extremely rewarding!
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-12 text-center">
            <p className="text-gray-300 mb-6">
              Ready to put your skills to the test?
            </p>
            <Link
              href="/play"
              className="tetris-button tetris-button-primary inline-block"
            >
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
  );
}
