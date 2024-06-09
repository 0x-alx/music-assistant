import { create } from 'zustand'

interface UserAccountState {
    userAccount: any
    setUserAccount: (userAccount: any) => void
}

const useUserAccountStore = create<UserAccountState>()((set) => ({
    userAccount: null,
    setUserAccount: (userAccount: any) => set(() => ({ userAccount: userAccount })),
}))

export default useUserAccountStore;