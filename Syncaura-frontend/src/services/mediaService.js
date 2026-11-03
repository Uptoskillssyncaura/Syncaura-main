// src/services/mediaService.js

export const getCameraAndMic = async () => {
  return await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });
};

export const stopAllTracks = (stream) => {
  if (!stream) return;
  stream.getTracks().forEach(track => track.stop());
};

export const toggleAudioTrack = (stream, enabled) => {
  if (!stream) return;
  stream.getAudioTracks().forEach(track => {
    track.enabled = enabled;
  });
};

export const toggleVideoTrack = (stream, enabled) => {
  if (!stream) return;
  stream.getVideoTracks().forEach(track => {
    track.enabled = enabled;
  });
};

export const getScreenStream = async () => {
  return await navigator.mediaDevices.getDisplayMedia({
    video: true,
    audio: false,
  });
};
