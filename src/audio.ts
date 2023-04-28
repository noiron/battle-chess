import archerAudio from './assets/audios/shuriken_ninja_knifes3.mp3';
import cavalryAudio from './assets/audios/cutting_with_a_katana1.mp3';
import infantryAudio from './assets/audios/Chinese_blade1.mp3';
import navyAudio from './assets/audios/dragon_sigh.mp3';

/** 根据不同的兵种播放不同的音效 */
function playAudio(type: string) {
  const audioMap: {
    [key: string]: string;
  } = {
    archer: archerAudio,
    cavalry: cavalryAudio,
    infantry: infantryAudio,
    navy: navyAudio,
  };

  if (audioMap[type]) {
    const audio = new Audio(audioMap[type]);
    audio.play();
  }
}

export default playAudio;
