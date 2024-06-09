import { create } from 'zustand'

interface SpotifyProfileState {
    spotifyProfile: any
    setSpotifyProfile: (spotifyProfile: any) => void
}

const useSpotifyProfileStore = create<SpotifyProfileState>()((set) => ({
    spotifyProfile: null,
    setSpotifyProfile: (spotifyProfile: any) => set(() => ({ spotifyProfile: spotifyProfile })),
}))

export default useSpotifyProfileStore;