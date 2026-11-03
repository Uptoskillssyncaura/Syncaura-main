<div className="video-grid">
  {participants.map((p) => {
    const isLocal = p.id === 1; // Local participant ID

    // Check if hand is raised for this participant
    const isHandRaised = raisedHands.includes(p.id);

    // Check emoji for this participant
    const currentEmoji = emojiReactions[p.id] || null;

    return (
      <div
        key={p.id}
        className="video-tile"
        style={{
          backgroundColor: p.color,
          position: 'relative',
          borderRadius: '10px',
          overflow: 'hidden',
        }}
      >
        {/* LOCAL USER VIDEO */}
        {isLocal && localStream && isCameraOn ? (
          <VideoTile
            stream={localStream}
            raisedHand={isHandRaised}
            emoji={currentEmoji}
          />
        ) : (
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <div className="tile-gradient"></div>

            {/* Avatar */}
            <div
              className="avatar"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <span className="avatar-text">{p.initial}</span>

              {/* Hand Overlay */}
              {isHandRaised && (
                <div
                  style={{
                    position: 'absolute',
                    top: -4,
                    right: -4,
                    fontSize: 20,
                    background: 'rgba(255,255,255,0.9)',
                    borderRadius: '50%',
                    padding: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 20,
                  }}
                >
                  ✋
                </div>
              )}

              {/* Emoji Overlay */}
              {currentEmoji && (
                <div
                  style={{
                    position: 'absolute',
                    top: -4,
                    left: -4,
                    fontSize: 20,
                    background: 'rgba(255,255,255,0.9)',
                    borderRadius: '50%',
                    padding: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 20,
                  }}
                >
                  {currentEmoji}
                </div>
              )}
            </div>
          </div>
        )}

        {/* NAME TAG */}
        <div className="name-tag">
          <span className="name-text">{p.name}</span>
        </div>

        {/* MIC INDICATOR */}
        <div className="mic-indicator">
          {isLocal
            ? isMicOn
              ? <Mic size={14} color="#fff" />
              : <MicOff size={14} color="#fff" />
            : p.isMicOn
              ? <Mic size={14} color="#fff" />
              : <MicOff size={14} color="#fff" />}
        </div>
      </div>
    );
  })}
</div>
