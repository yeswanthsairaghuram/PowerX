import React from 'react';
import './YouTubeVideos.css';

import ShimmerYT from './ShimmerYt';

const YouTubeVideos = ({ Videos, name }) => {
  if (!Videos.length) return <div><ShimmerYT /></div>;

  return (
    <div className="exercise-videos-container">
      <h2 className="exercise-videos-heading">
        Watch <span className="highlight">{name}</span> Videos
      </h2>
      <div className="exercise-videos-list">
        {Videos?.slice(0, 3)?.map((item, index) => (
          item.video && item.video.videoId ? (  // Safely check if item.video and videoId exist
            <a
              key={index}
              className="exercise-video"
              href={`https://www.youtube.com/watch?v=${item.video.videoId}`}
              target="_blank"
              rel="noreferrer"
            >
              <div className="video-thumbnail-wrapper">
                <img
                  className="video-thumbnail"
                  src={item.video.thumbnails[0].url}
                  alt={item.video.title}
                />
              </div>
              <div className="video-info">
                <h3 className="video-title">{item.video.title}</h3>
                <p className="video-channel">{item.video.channelName}</p>
              </div>
            </a>
          ) : null
        ))}
      </div>
    </div>
  );
};

export default YouTubeVideos;
