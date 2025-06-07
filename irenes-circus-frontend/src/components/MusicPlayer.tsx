
import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";

interface Track {
  id: number;
  title: string;
  duration: string;
  audioSrc: string;
  albumArt: string;
}

const MusicPlayer = ({ tracks }: { tracks: Track[] }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const currentTrack = tracks[currentIndex];
  
  const handlePlayPause = () => {
    if (!currentTrack && tracks.length > 0) {
      setCurrentIndex(0);
    }
    setIsPlaying(prev => !prev);
  };
  
  const handleTrackSelect = (track: Track) => {
    const index = tracks.findIndex(t => t.id === track.id);
    if (index !== -1) {
      setCurrentIndex(index);
      setIsPlaying(true);
    }
  };
  
  const handleNext = () => {
    if (tracks.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % tracks.length);
    setIsPlaying(true);
  };
  
  const handlePrev = () => {
    if (tracks.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
    setIsPlaying(true);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;
    audio.src = currentTrack.audioSrc;
    audio.currentTime = 0;
    setProgress(0);
    if (isPlaying) {
      audio.play();
    }
  }, [currentTrack]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.play();
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };
    const handleEnded = () => {
      handleNext();
    };
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentIndex]);

  return (
    <div className="bg-circus-dark/90 text-circus-cream rounded-lg p-4 shadow-lg">
      <audio ref={audioRef} hidden />
      <div className="flex flex-col md:flex-row gap-6">
        {/* Album Art */}
        <div className="w-full md:w-64 h-64 overflow-hidden rounded-lg">
          <img 
            src={currentTrack?.albumArt || "/placeholder.svg"} 
            alt={currentTrack?.title || "Select a track"} 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Player Controls */}
        <div className="flex-1">
          <h3 className="font-circus text-xl font-bold text-circus-gold mb-1">
            {currentTrack?.title || "Select a track"}
          </h3>
          <p className="font-alt text-sm mb-4 text-circus-cream/80">
            {currentTrack ? "Irene's Circus" : ""}
          </p>
          
          {/* Progress Bar */}
          <div className="w-full h-1 bg-circus-cream/20 rounded-full mb-4">
            <div
              className="bg-circus-gold h-full rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <button 
              onClick={handlePrev}
              className="text-circus-cream hover:text-circus-gold transition-colors"
            >
              <SkipBack size={24} />
            </button>
            
            <button 
              onClick={handlePlayPause}
              className="bg-circus-gold text-circus-dark p-2 rounded-full hover:bg-circus-red hover:text-circus-cream transition-colors"
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
            
            <button 
              onClick={handleNext}
              className="text-circus-cream hover:text-circus-gold transition-colors"
            >
              <SkipForward size={24} />
            </button>
            
            <div className="flex items-center ml-4">
              <Volume2 size={18} className="text-circus-cream/80 mr-2" />
              <div className="w-20 h-1 bg-circus-cream/20 rounded-full">
                <div className="bg-circus-gold h-full rounded-full w-3/4"></div>
              </div>
            </div>
          </div>
          
          {/* Track List */}
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
            {tracks.map(track => (
              <div 
                key={track.id}
                onClick={() => handleTrackSelect(track)}
                className={`flex justify-between items-center p-2 rounded cursor-pointer hover:bg-circus-dark transition-colors 
                  ${currentTrack?.id === track.id ? 'bg-circus-dark border-l-2 border-circus-gold' : ''}`}
              >
                <div className="flex items-center gap-2">
                  {currentTrack?.id === track.id && isPlaying ? (
                    <Pause size={16} className="text-circus-gold" />
                  ) : (
                    <Play size={16} />
                  )}
                  <span className="font-alt">{track.title}</span>
                </div>
                <span className="text-circus-cream/60 text-sm font-alt">{track.duration}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
