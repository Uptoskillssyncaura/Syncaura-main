import { useEffect, useRef } from 'react';

const VideoTile = ({ stream, muted = true, raisedHand = false, emoji = null }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '10px', overflow: 'hidden' }}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={muted}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: '10px'
        }}
      />

      {raisedHand && (
        <div
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            fontSize: 24,
            background: 'rgba(255,255,255,0.8)',
            borderRadius: '50%',
            padding: 4,
            textAlign: 'center'
          }}
        >
          ✋
        </div>
      )}

      {emoji && (
        <div
          style={{
            position: 'absolute',
            top: 8,
            left: 8,
            fontSize: 24,
            background: 'rgba(255,255,255,0.8)',
            borderRadius: '50%',
            padding: 4,
            textAlign: 'center'
          }}
        >
          {emoji}
        </div>
      )}
    </div>
  );
};

export default VideoTile;
