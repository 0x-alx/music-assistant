import { create } from 'zustand'

interface SearchResultState {
    searchResult: any
    setSearchResult: (searchResult: any) => void
    isLoading: boolean
    setIsLoading: (isLoading: boolean) => void
}

const useSearchResultStore = create<SearchResultState>()((set) => ({
    isLoading: false,
    searchResult: [],
    setSearchResult: (searchResult: any) => set(() => ({ searchResult: searchResult })),
    setIsLoading: (isLoading: boolean) => set(() => ({ isLoading: isLoading })),
}))

export default useSearchResultStore;