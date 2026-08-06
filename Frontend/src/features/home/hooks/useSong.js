import { getSong } from "../services/song.api"
import { useContext } from 'react'
import { SongContext } from "../song.context"

export const useSong = () => {
    const context = useContext(SongContext)
    const { song, setSong, loading, setLoading } = context

    async function handleGetSong({ mood }) {
        setLoading(true)
        try {
            const data = await getSong({ mood })
            setSong(data.song)
        } catch (err) {
            console.error("Failed to fetch song:", err?.response?.data?.message || err.message)
        } finally {
            setLoading(false)
        }
    }

    return ({ loading, song, handleGetSong })
}