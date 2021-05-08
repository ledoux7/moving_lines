/* eslint-disable jsx-a11y/media-has-caption */
import React, { Component } from 'react';

const VideoPlayer = ({ url }) => (
  <div style={{
    width: '100%',
  }}
  >
    <video
      style={{
        width: '100%',
      }}
      controls
      // autoPlay
      src={url}
    />
  </div>
);
export default VideoPlayer;
