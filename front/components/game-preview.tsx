"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"

// Tetris block colors
const COLORS = [
  "#FF0D72", // I
  "#0DC2FF", // J
  "#0DFF72", // L
  "#F538FF", // O
  "#FF8E0D", // S
  "#FFE138", // T
  "#3877FF", // Z
]

export default function GamePreview() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [animationFrame, setAnimationFrame] = useState<number | null>(null)

  // Simple animation to show falling tetris pieces
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const blockSize = 30
    const cols = Math.floor(canvas.width / blockSize)
    const rows = Math.floor(canvas.height / blockSize)

    // Create some falling blocks for animation
    const blocks: { x: number; y: number; color: string; speed: number }[] = []

    for (let i = 0; i < 15; i++) {
      blocks.push({
        x: Math.floor(Math.random() * cols),
        y: -Math.floor(Math.random() * rows * 2),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        speed: 0.5 + Math.random() * 1.5,
      })
    }

    const animate = () => {
      ctx.fillStyle = "#111"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw grid
      ctx.strokeStyle = "#222"
      ctx.lineWidth = 1

      for (let i = 0; i <= cols; i++) {
        ctx.beginPath()
        ctx.moveTo(i * blockSize, 0)
        ctx.lineTo(i * blockSize, canvas.height)
        ctx.stroke()
      }

      for (let i = 0; i <= rows; i++) {
        ctx.beginPath()
        ctx.moveTo(0, i * blockSize)
        ctx.lineTo(canvas.width, i * blockSize)
        ctx.stroke()
      }

      // Draw and update blocks
      blocks.forEach((block) => {
        ctx.fillStyle = block.color
        ctx.fillRect(block.x * blockSize, block.y * blockSize, blockSize, blockSize)

        // Add shadow/highlight for 3D effect
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)"
        ctx.fillRect(block.x * blockSize, block.y * blockSize, blockSize, blockSize / 5)

        ctx.fillStyle = "rgba(0, 0, 0, 0.3)"
        ctx.fillRect(block.x * blockSize, block.y * blockSize + blockSize / 5, blockSize, blockSize - blockSize / 5)

        // Update position
        block.y += block.speed / 10

        // Reset if off screen
        if (block.y > rows) {
          block.y = -1
          block.x = Math.floor(Math.random() * cols)
        }
      })

      const frame = requestAnimationFrame(animate)
      setAnimationFrame(frame)
    }

    animate()

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [])

  return (
    <div className="relative aspect-[4/3] w-full">
      <canvas ref={canvasRef} width={360} height={480} className="w-full h-full" />
      <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-md text-sm font-mono">
        Score: 12,540
      </div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-sm px-6 py-3 rounded-lg">
        <div className="text-center">
          <p className="text-gray-400 mb-2">Preview</p>
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
            Play Now
          </Button>
        </div>
      </div>
    </div>
  )
}

// Simple button component for the preview
function Button({ children, className }: { children: React.ReactNode; className?: string }) {
  return <button className={`px-4 py-2 rounded-md font-medium ${className}`}>{children}</button>
}
