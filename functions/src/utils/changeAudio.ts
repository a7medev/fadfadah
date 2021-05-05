import * as ffmpeg from 'fluent-ffmpeg';

export const genRandom = () => {
  const isHigh = Math.random() > 0.5;
  const high = Math.random() * (1.75 - 1.25) + 1.25;
  const low = Math.random() * (0.75 - 0.25) + 0.25;

  return isHigh ? high : low;
};

const changeAudio = (input: string, output: string) =>
  new Promise((resolve, reject) => {
    const value = genRandom().toFixed(3);

    ffmpeg(input)
      .audioFilters([
        `asetrate=44100*${value}`,
        'aresample=44100',
        `atempo=1/${value}`
      ])
      .on('end', () => resolve(null))
      .on('error', (err: Error) => reject(err))
      .save(output);
  });

export default changeAudio;
