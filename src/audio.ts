import archerAudio from './assets/shuriken_ninja_knifes3.mp3';
import cavalryAudio from './assets/cutting_with_a_katana1.mp3';
import infantryAudio from './assets/Chinese_blade1.mp3';
import navyAudio from './assets/dragon_sigh.mp3';

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
