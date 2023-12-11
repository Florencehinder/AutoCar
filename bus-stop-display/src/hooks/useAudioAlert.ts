// useAudioAlert.ts
import { useEffect, useState } from "react";

const useAudioAlert = (
  distanceToNextStop: number,
  audioFile: string
): [boolean, React.Dispatch<React.SetStateAction<boolean>>] => {
  const [audioPlayed, setAudioPlayed] = useState<boolean>(false);

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
