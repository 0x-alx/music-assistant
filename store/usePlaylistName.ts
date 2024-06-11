import { create } from 'zustand'

interface PlaylistNameState {
    playlistName: string
    setPlaylistName: (playlistName: string) => void
}

const usePlaylistNameStore = create<PlaylistNameState>()((set) => ({
    playlistName: "",
    setPlaylistName: (playlistName: string) => set(() => ({ playlistName: playlistName })),
}))

export default usePlaylistNameStore;