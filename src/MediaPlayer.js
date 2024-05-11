import React, { useState, useRef, useEffect } from 'react';
import './App.css'; // Import your CSS file

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const videoRef = useRef(null);
  const mediaList = [
    "https://cdn.pixabay.com/video/2016/01/29/1992-153555258_tiny.mp4",
    "https://cdn.pixabay.com/video/2017/03/20/8453-209292199_tiny.mp4",
    "https://cdn.pixabay.com/video/2023/08/11/175594-853887904_tiny.mp4",
    "https://cdn.pixabay.com/video/2019/11/21/29312-374760994_tiny.mp4",
    "https://cdn.pixabay.com/video/2022/04/11/113631-698820445_tiny.mp4"
  ];

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleTimeUpdate = () => setCurrentTime(video.currentTime);
      const handleLoadedData = () => setDuration(video.duration);
      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('loadeddata', handleLoadedData);
      return () => {
        video.removeEventListener('timeupdate', handleTimeUpdate);
        video.removeEventListener('loadeddata', handleLoadedData);
      };
    }
  }, [currentVideoIndex]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      switch (event.key) {
        case ' ':
          togglePlayPause();
          break;
        case 'ArrowUp':
          adjustVolume(0.1);
          break;
        case 'ArrowDown':
          adjustVolume(-0.1);
          break;
        case 'ArrowRight':
          handleSkipForward();
          break;
        case 'ArrowLeft':
          handleSkipBackward();
          break;
        case 'm':
        case 'M':
          toggleMute();
          break;
        case 'f':
        case 'F':
          toggleFullScreen();
          break;
        case 'Escape':
          exitFullScreen();
          break;
        case 'w':
        case 'W':
          togglePiP();
          break;
        case 'n':
        case 'N':
          handleNextVideo();
          break;
        case 'p':
        case 'P':
          handlePrevVideo();
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [currentVideoIndex]);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (video) {
      if (video.paused) {
        video.play();
        setIsPlaying(true);
      } else {
        video.pause();
        setIsPlaying(false);
      }
    }
  };

  const adjustVolume = (increment) => {
    let newVolume = volume + increment;
    newVolume = Math.max(0, Math.min(1, newVolume)); // Clamp volume between 0 and 1
    setVolume(newVolume);
    const video = videoRef.current;
    if (video) {
      video.volume = newVolume;
    }
  };

  const handleSkipBackward = () => {
    const video = videoRef.current;
    if (video) {
      video.currentTime -= 10;
    }
  };

  const handleSkipForward = () => {
    const video = videoRef.current;
    if (video) {
      video.currentTime += 10;
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (video) {
      video.muted = !video.muted;
      setVolume(video.muted ? 0 : 0.5);
    }
  };

  const toggleFullScreen = () => {
    const video = videoRef.current;
    if (video) {
      if (!document.fullscreenElement) {
        video.requestFullscreen().catch((err) => {
          console.error('Error attempting to enable full-screen mode:', err.message);
        });
      } else {
        document.exitFullscreen();
      }
    }
  };

  const exitFullScreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  };

  const togglePiP = () => {
    const video = videoRef.current;
    if (video) {
      if (document.pictureInPictureElement) {
        document.exitPictureInPicture().catch((err) => {
          console.error('Error while exiting PiP mode:', err.message);
        });
      } else {
        video.requestPictureInPicture().catch((err) => {
          console.error('Error while entering PiP mode:', err.message);
        });
      }
    }
  };

  const handlePrevVideo = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1);
    }
  };

  const handleNextVideo = () => {
    if (currentVideoIndex < mediaList.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    }
  };

  const formatTime = (time) => {
    let seconds = Math.floor(time % 60);
    let minutes = Math.floor(time / 60) % 60;
    let hours = Math.floor(time / 3600);

    seconds = seconds < 10 ? `0${seconds}` : seconds;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    hours = hours < 10 ? `0${hours}` : hours;

    if (hours === 0) {
      return `${minutes}:${seconds}`;
    }
    return `${hours}:${minutes}:${seconds}`;
  };

  const handleVolumeChange = (event) => {
    setVolume(event.target.value);
    const video = videoRef.current;
    if (video) {
      video.volume = event.target.value;
    }
  };

  const handlePlaybackRateChange = (event) => {
    const speed = parseFloat(event.target.value);
    setPlaybackRate(speed);
    const video = videoRef.current;
    if (video) {
      video.playbackRate = speed;
    }
  };

  return (
    <div className="container show-controls">
      <div className="wrapper">
        <div className="video-timeline">
          <div className="progress-area">
            <span>{formatTime(currentTime)}</span>
            <div
              className="progress-bar"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            ></div>
          </div>
        </div>
        <ul className="video-controls">
          <li className="options left">
            <button className="volume">
              <i className={`fa-solid ${volume === 0 ? 'fa-volume-xmark' : 'fa-volume-high'}`}></i>
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="any"
              value={volume}
              onChange={handleVolumeChange}
            />
            <div className="video-timer">
              <p className="current-time">{formatTime(currentTime)}</p>
              <p className="separator"> / </p>
              <p className="video-duration">{formatTime(duration)}</p>
            </div>
          </li>
          <li className="options center">
            <button onClick={handleSkipBackward}>
              <i className="fas fa-backward"></i>
            </button>
            <button onClick={togglePlayPause}>
              <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
            </button>
            <button onClick={handleSkipForward}>
              <i className="fas fa-forward"></i>
            </button>
          </li>
          <li className="options right">
            <div className="playback-content">
              <select onChange={handlePlaybackRateChange} value={playbackRate}>
                {[0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 3.25, 3.5, 3.75, 4].map(speed => (
                  <option key={speed} value={speed}>{speed}x</option>
                ))}
              </select>
            </div>
            <button onClick={toggleFullScreen}>
              <i className="fa-solid fa-expand"></i>
            </button>
            <button onClick={togglePiP}>
              <span className="material-icons">picture_in_picture_alt</span>
            </button>
            <button className='prev' onClick={handlePrevVideo} disabled={currentVideoIndex === 0}>
              Prev
            </button>
            <button className='prev' onClick={handleNextVideo} disabled={currentVideoIndex === mediaList.length - 1}>
              Next
            </button>
          </li>
        </ul>
      </div>
      <video ref={videoRef} src={mediaList[currentVideoIndex]} volume={volume} playbackRate={playbackRate}></video>
    </div>
  );
}

export default App;
