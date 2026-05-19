'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Song {
  id: number
  artist: string
  title: string
  streams: number
}

interface Props {
  songs: Song[]
}

type GameState = 'playing' | 'reveal' | 'gameover'

function formatStreams(n: number): string {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1).replace('.', ',') + ' Mrd.'
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(0) + ' Mio.'
  return n.toLocaleString('de-DE')
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function initRound(songs: Song[]): { deck: Song[]; left: Song; right: Song } {
  const deck = shuffle(songs)
  return { deck: deck.slice(2), left: deck[0], right: deck[1] }
}

export default function GameClient({ songs }: Props) {
  const [{ deck, left, right }, setRound] = useState(() => initRound(songs))
  const [score, setScore] = useState(0)
  const [gameState, setGameState] = useState<GameState>('playing')
  const [wasCorrect, setWasCorrect] = useState(false)

  const guess = useCallback(
    (higher: boolean) => {
      if (gameState !== 'playing') return
      const correct = higher ? right.streams > left.streams : right.streams < left.streams
      setWasCorrect(correct)
      setGameState('reveal')

      setTimeout(() => {
        if (correct) {
          setScore((s) => s + 1)
          if (deck.length === 0) {
            setGameState('gameover')
            return
          }
          setRound({ deck: deck.slice(1), left: right, right: deck[0] })
          setGameState('playing')
        } else {
          setGameState('gameover')
        }
      }, 1800)
    },
    [gameState, left, right, deck],
  )

  const restart = useCallback(() => {
    setRound(initRound(songs))
    setScore(0)
    setGameState('playing')
  }, [songs])

  if (gameState === 'gameover') {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-8 px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center gap-6 text-center"
        >
          <p className="text-2xl text-white/60 font-semibold tracking-widest uppercase">Game Over</p>
          <p className="text-8xl font-black text-white">{score}</p>
          <p className="text-xl text-white/60">
            {score === 0
              ? 'Schade! Versuch es nochmal.'
              : score < 5
              ? 'Guter Start! Nochmal?'
              : score < 10
              ? 'Stark! Kannst du das toppen?'
              : 'Rap-Experte! Unglaublich!'}
          </p>
          <button
            onClick={restart}
            className="mt-4 px-10 py-5 rounded-2xl text-xl font-black tracking-wide text-black uppercase"
            style={{ backgroundColor: '#9B5DE5', minHeight: 60 }}
          >
            Nochmal spielen
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Score bar */}
      <div className="flex items-center justify-between px-6 py-4">
        <span className="text-white/40 text-sm font-semibold uppercase tracking-widest">Score</span>
        <span className="text-3xl font-black text-white">{score}</span>
      </div>

      {/* Cards */}
      <div className="flex-1 flex flex-col md:flex-row gap-4 px-4 pb-4 md:gap-6 md:px-6">
        {/* Left — revealed */}
        <SongCard song={left} streamsVisible label="Bekannt" />

        {/* Divider label */}
        <div className="hidden md:flex items-center">
          <span className="text-white/20 font-black text-2xl">VS</span>
        </div>
        <div className="flex md:hidden items-center justify-center">
          <span className="text-white/20 font-black text-xl">VS</span>
        </div>

        {/* Right — hidden or revealing */}
        <SongCard
          song={right}
          streamsVisible={gameState === 'reveal'}
          label="Mehr oder weniger?"
          highlight={gameState === 'reveal' ? (wasCorrect ? 'correct' : 'wrong') : undefined}
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-4 px-4 pb-8 md:px-6">
        <button
          onClick={() => guess(true)}
          disabled={gameState === 'reveal'}
          className="flex-1 rounded-2xl font-black text-xl uppercase tracking-wide text-white transition-opacity disabled:opacity-40"
          style={{ backgroundColor: '#9B5DE5', minHeight: 64 }}
        >
          Höher
        </button>
        <button
          onClick={() => guess(false)}
          disabled={gameState === 'reveal'}
          className="flex-1 rounded-2xl font-black text-xl uppercase tracking-wide text-white transition-opacity disabled:opacity-40"
          style={{ backgroundColor: '#1a1a1a', border: '2px solid #9B5DE5', minHeight: 64 }}
        >
          Niedriger
        </button>
      </div>
    </div>
  )
}

function SongCard({
  song,
  streamsVisible,
  label,
  highlight,
}: {
  song: Song
  streamsVisible: boolean
  label: string
  highlight?: 'correct' | 'wrong'
}) {
  const borderColor =
    highlight === 'correct'
      ? '#22c55e'
      : highlight === 'wrong'
      ? '#ef4444'
      : '#2a2a2a'

  return (
    <div
      className="flex-1 rounded-3xl p-6 flex flex-col justify-between gap-4 transition-all duration-300"
      style={{
        backgroundColor: '#111111',
        border: `2px solid ${borderColor}`,
        minHeight: 220,
      }}
    >
      <p className="text-xs font-semibold uppercase tracking-widest text-white/30">{label}</p>

      <div className="flex flex-col gap-1">
        <p className="text-white/60 text-base font-semibold">{song.artist}</p>
        <p className="text-white text-2xl font-black leading-tight">{song.title}</p>
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-white/30 text-xs uppercase tracking-widest">Spotify Streams</p>
        <AnimatePresence mode="wait">
          {streamsVisible ? (
            <motion.p
              key={song.id + '-streams'}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="font-black text-4xl"
              style={{ color: '#9B5DE5' }}
            >
              {formatStreams(song.streams)}
            </motion.p>
          ) : (
            <motion.p
              key={song.id + '-hidden'}
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-black text-4xl text-white/20 tracking-[0.3em]"
            >
              ???
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
