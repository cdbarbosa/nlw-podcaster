import { useContext, useEffect, useRef, useState } from 'react'
import Slider from 'rc-slider'

import { PlayerContext } from '../../contexts/PlayerContext'

import styles from './styles.module.scss'
import 'rc-slider/assets/index.css'
import { convertDurationToTimeString } from '../../utils/convertDurationTOTimeString'


export const Player = () => {
    const audioRef = useRef<HTMLAudioElement>(null)
    const [progress, setProgress] = useState(0)

    const {
        episodeList,
        currentEpisodeIndex, 
        isPlaying, 
        togglePlay,
        setPlayingState,
        playNext,
        playPrevious,
        hasNext,
        hasPrevious,
        isLooping,
        toggleLoop,
        isShuffle,
        toggleShuffle,
        clearPlayerState
    } = useContext(PlayerContext)

    const episode = episodeList[currentEpisodeIndex]

    const setupProgressListener = () => {
        audioRef.current.currentTime = 0

        audioRef.current.addEventListener('timeupdate', () => {
            setProgress(Math.floor(audioRef.current.currentTime))
        })
    }

    const handleSeek = (amount: number) => {
        audioRef.current.currentTime = amount
        setProgress(amount)
    }

    const handleEpisodeEnded = () => {
        if (hasNext) playNext()
        else clearPlayerState()
    }

    useEffect(() => {
        if (!audioRef.current) return

        if (isPlaying)  audioRef.current.play()
        else audioRef.current.pause()

    }, [isPlaying])

    return (
        <div className={styles.playerContainer}>
            <header>
                <img src="/playing.svg" alt="Tocando agora"/>
                <strong>Tocando agora</strong>
            </header>

            {episode ? (
                <div className={styles.currentEpisode}>
                    <img src={episode.thumbnail} alt="thumbnail" />

                    <strong>{episode.title}</strong>
                    <span>{episode.members}</span>
                </div>
            ) : (
                <div className={styles.emptyPlayer}>
                    <strong>Selecione ump podcast para ouvir</strong>
                </div>
            )}

            <footer className={!episode ? styles.empty : ''}>
                <div className={styles.progress}>
                    <span>{convertDurationToTimeString(progress)}</span>
                    <div className={styles.slider}>
                        {episode ? (
                            <Slider
                                max={episode.duration}
                                value={progress}
                                onChange={handleSeek}
                                trackStyle={{ backgroundColor: '#04d361' }}
                                railStyle={{ backgroundColor: '#9f75ff'}}
                                handleStyle={{ borderColor: '#04d361', borderWidth: 4}}
                            />
                        ) : (
                            <div className={styles.emptySlider}></div>
                        )}
                    </div>
                    <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
                </div>

                {episode && (
                    <audio
                        src={episode.url}
                        ref={audioRef}
                        loop={Boolean(isLooping)}
                        onPlay={() => setPlayingState(true)}
                        onPause={() => setPlayingState(false)}
                        onEnded={handleEpisodeEnded}
                        autoPlay
                        onLoadedMetadata={setupProgressListener}
                    />
                )}

                <div className={styles.buttons}>
                    <button type="button" disabled={!episode || episodeList.length === 1} onClick={() => toggleShuffle()}>
                        <img src="/shuffle.svg" alt="Embaralhar"/>
                    </button>
                    <button type="button" disabled={!episode || !hasPrevious} onClick={() => playPrevious()}>
                        <img src="/play-previous.svg" alt="Tocar anterior"/>
                    </button>
                    <button type="button" className={styles.playButton} onClick={() => togglePlay()} disabled={!episode}>
                        {isPlaying ? (
                            <img src="/pause.svg" alt="Pausar"/>
                        ) : (
                            <img src="/play.svg" alt="Tocar"/>
                        )}
                    </button>
                    <button type="button" disabled={!episode || !hasNext} onClick={() => playNext()}>
                        <img src="/play-next.svg" alt="Tocar próximo"/>
                    </button>
                    <button type="button" disabled={!episode} onClick={() => toggleLoop()}>
                        <img src="/repeat.svg" alt="Repetir"/>
                    </button>
                </div>
            </footer>
        </div>
    )
}