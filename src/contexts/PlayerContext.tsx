import { createContext, ReactNode, useContext, useState } from 'react'

type Episode = {
    title: string,
    members: string,
    thumbnail: string,
    duration: number,
    url: string
}


type PlayerContextData = {
    episodeList: Array<Episode>;
    currentEpisodeIndex: number;
    isPlaying: Boolean;
    isLooping: Boolean;
    isShuffle: Boolean;
    hasNext: Boolean,
    hasPrevious: Boolean,
    play: (episode: Episode) => void;
    togglePlay: () => void;
    toggleLoop: () => void;
    toggleShuffle: () => void;
    setPlayingState: (state: Boolean) => void;
    playList: (list: Array<Episode>, index: number) => void;
    playNext: () => void;
    playPrevious: () => void;
    clearPlayerState: () => void;
}

type PlayerContextProviderProps = {
    children: ReactNode // reactnode qualquer coisa que o react aceitaria para ser exibida no jsx
}

export const PlayerContext = createContext({} as PlayerContextData)


export const usePlayer = () => {
    return useContext(PlayerContext)
}


export const PlayerContextProvider = ({ children }: PlayerContextProviderProps) => {
    const [episodeList, setEpisodeList] = useState([])
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLooping, setIsLooping] = useState(false)
  const [isShuffle, setIsShuffle] = useState(false)

  const hasPrevious = currentEpisodeIndex > 0
  const hasNext = isShuffle || (currentEpisodeIndex + 1) < episodeList.length

  const play = (episode: Episode) => {
    setEpisodeList([episode])
    setCurrentEpisodeIndex(0)
    setIsPlaying(true)
  }

  const playList = (list: Array<Episode>, index: number) => {
    setEpisodeList(list)
    setCurrentEpisodeIndex(index)
    setIsPlaying(true)
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const toggleLoop = () => {
      setIsLooping(!isLooping)
  }

    const toggleShuffle = () => {
        setIsShuffle(!isShuffle)
    }

  const setPlayingState = (state: boolean) => {
    setIsPlaying(state)
  }

  const playNext = () => {
    if (isShuffle) {
        const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length)
        setCurrentEpisodeIndex(nextRandomEpisodeIndex)
    } else if (hasNext) setCurrentEpisodeIndex(currentEpisodeIndex + 1)

  }

  const playPrevious = () => {
    if (currentEpisodeIndex > 0) setCurrentEpisodeIndex(currentEpisodeIndex - 1)
    }

    const clearPlayerState = () => {
        setEpisodeList([])
        setCurrentEpisodeIndex(0)
    }

  return (
    <PlayerContext.Provider value={{ 
        currentEpisodeIndex, 
        episodeList, 
        play, 
        isPlaying, 
        togglePlay, 
        setPlayingState,
        playList,
        playNext,
        playPrevious,
        toggleLoop,
        isLooping,
        hasPrevious,
        hasNext,
        isShuffle,
        toggleShuffle,
        clearPlayerState
    }}>
        {children}
    </PlayerContext.Provider>
  )
}