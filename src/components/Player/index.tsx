import Image from 'next/image';
import { useRef, useEffect } from 'react';
import Slider from 'rc-slider';

import 'rc-slider/assets/index.css';

import { PlayerContext, usePlayer } from '../../contexts/PlayerContext';

import styles from './styles.module.scss'; 

export function Player() {
    const audioRef = useRef<HTMLAudioElement>(null);

    const { 
        episodeList, 
        currentEpisodeIndex, 
        isPlaying, 
        isLooping,
        isShuffling,
        togglePlay,
        toggleLoop,
        toggleShuffle,
        setPlayingState,
        playNext,
        playPrevious,
        hasNext,
        hasPrevious
    } = usePlayer();

    useEffect(() => {
        if(!audioRef.current) {
            return;
        }

        if(isPlaying) {
            audioRef.current.play();
        }else {
            audioRef.current.pause();
        }
    }, [isPlaying])

    const episode = episodeList[currentEpisodeIndex]

    return (
       <div className={styles.playerConteiner}>
           <header>
               <img src="/playing.svg" alt="Tocando agora" />
               <strong>Tocando agora</strong>
           </header>

           { episode ? (
               <div className={styles.currentEpisode}>
                   <Image 
                        width={592} 
                        height={592} 
                        src={episode.thumbnail} 
                        objectFit="cover"
                    />
                    <strong>{episode.title}</strong>
                    <span>{episode.members}</span>
               </div>
           ) : (
               <div className={styles.emptyPlayer}>
               <strong>Selecione um podcast para ouvir</strong>                           
               </div>
           ) }

           <footer className={!episode ? styles.empty : ''}>
               <div className={styles.progress}>
                   <span>00:00</span>
                   <div className={styles.slider}>
                        {!episode ? (
                            <Slider
                                trackStyle={ { backgroundColor: '#04D361'}}
                                railStyle={ { backgroundColor: '#9f75ff'} }
                                handleStyle={ { borderColor: '#04D361', borderWidth: 4} }
                            />
                        ) : (
                            <div className={styles.emptySlider} />
                        )}
                   </div>
                   <span>00:00</span>
               </div>

               { episode && (
                   <audio 
                    src={episode.url}
                    ref={audioRef}
                    loop={isLooping}
                    autoPlay
                    onPlay={() => setPlayingState(true)}
                    onPause={() => setPlayingState(false)}
                   />
               ) }

               <div className={styles.buttons}>
                   <button 
                        type="button" 
                        disabled={!episode}
                        onClick={toggleShuffle}
                        className={isShuffling ? styles.isActive : ''}
                    >
                       <img src="/shuffle.svg" alt="Embaralhar"></img>
                   </button>
                   <button 
                        type="button" 
                        onClick={playPrevious} 
                        disabled={!episode || hasPrevious}
                    >
                       <img src="/play-previous.svg" alt="Tocar anterior"></img>
                   </button>
                   <button 
                        type="button" 
                        className={styles.playButton} 
                        disabled={!episode}
                        onClick={togglePlay}
                    >
                       { isPlaying
                            ? <img src="/pause.svg" alt="Tocar"/>
                            : <img src="/play.svg" alt="Tocar"/>
                        }
                   </button>
                   <button 
                        type="button" 
                        onClick={playNext} 
                        disabled={!episode || hasNext}
                    >
                       <img src="/play-next.svg" alt="Tocar pr??xima"></img>
                   </button>
                   <button 
                        type="button" 
                        disabled={!episode}
                        onClick={toggleLoop}
                        className={isLooping ? styles.isActive : ''}
                    >
                       <img src="/repeat.svg" alt="Repetir"></img>
                   </button>
               </div>
           </footer>
       </div>
    );
}