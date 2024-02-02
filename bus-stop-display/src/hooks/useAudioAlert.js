// useAudioAlert.js
import { useEffect, useState } from "react";

const useAudioAlert = (distanceToNextStop, audioFile) => {
  const [audioPlayed, setAudioPlayed] = useState(false);

  useEffect(() => {
    if (distanceToNextStop < 150 && !audioPlayed) {
      const audio = new Audio(audioFile);
      audio.play().catch((e) => console.error("Error playing audio:", e));
      setAudioPlayed(true);
    }
  }, [distanceToNextStop, audioPlayed, audioFile]);

  return [audioPlayed, setAudioPlayed];
};

export default useAudioAlert;
