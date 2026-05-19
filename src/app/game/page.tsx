import { Metadata } from 'next'
import { readFileSync } from 'fs'
import path from 'path'
import GameClient from '@/components/higher-lower/GameClient'

export const metadata: Metadata = {
  title: 'Higher / Lower — Deutscher Rap',
  description: 'Weißt du, welcher deutsche Rap-Song mehr Streams hat?',
}

interface Song {
  id: number
  artist: string
  title: string
  streams: number
}

function getSongs(): Song[] {
  const filePath = path.join(process.cwd(), 'data', 'songs.json')
  const raw = readFileSync(filePath, 'utf-8')
  return JSON.parse(raw) as Song[]
}

export default function GamePage() {
  const songs = getSongs()
  return <GameClient songs={songs} />
}
