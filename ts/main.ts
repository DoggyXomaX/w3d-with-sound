type AudioElement = HTMLAudioElement | null;
type InputAudio = string[];

class AudioPageClass {
  audios: AudioElement[];
  pattern: string[];
  patternPointer: number;
  bpm: number;

  constructor(audioElementPattern: InputAudio, pattern: string[], bpm: number) {
    this.audios = audioElementPattern.map<AudioElement>((letter: string) => document.getElementById(`audio_${letter}`) as AudioElement); 
    this.pattern = pattern;
    this.patternPointer = 0;
    this.bpm = bpm;

    this.Update();
  }

  Update() {
    setTimeout(() => this.Update(), 60000 / this.bpm / 4);

    const currentBlock: string = this.pattern[this.patternPointer];
    const blockLength: number = currentBlock.length;
    for (let i = 0; i < blockLength; i++)
      if (currentBlock[i] === 'x') {
        const audio: AudioElement = this.audios[i];
        if (audio === null) continue;
        audio.pause();
        audio.currentTime = 0;
        audio.play().catch(() => undefined);

        const names = ['kick', 'snare', 'a', 'a#'];
        console.log(names[i]);
      }

    this.patternPointer++;
    if (this.patternPointer === this.pattern.length)
      this.patternPointer = 0;
    // console.log(this.patternPointer);
  }
}

const GlobalInputAudioClasses: string[] = ['a', 'b', 'c', 'd'];
const GlobalPattern: string[] = [
  'x-x-', '----', '----', 'x---',
  '-x--', '----', 'x---', '----',
  '---x', 'x---', '----', '----',
  'xx--', '----', '----', '----',
  '----', '----', 'x---', '----',
  '-x--', '----', '----', '----',
  '----', '----', '----', '----',
  '-x--', '----', '----', '----',
];
const GlobalBPM : number = 128;

let AudioPage: AudioPageClass;
let World3D: World3DClass;

window.onload = function() : void {
  AudioPage = new AudioPageClass(GlobalInputAudioClasses, GlobalPattern, GlobalBPM);
  World3D = new World3DClass();
};
