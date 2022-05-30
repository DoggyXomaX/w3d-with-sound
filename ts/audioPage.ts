type AudioElement = HTMLAudioElement | null;
type InputAudio = string[];
type AudioPageCallback = (audioPage: AudioPage) => void;

class AudioPage {
  audios: AudioElement[];
  pattern: string[];
  pointers: number[];
  bpm: number;
  updateCallback: AudioPageCallback;

  constructor(sampleList: string[], pattern: string[], bpm: number, container: HTMLElement, updateCallback: AudioPageCallback) {
    // Search for audios in assets folder by sampleList names
    this.audios = sampleList.map<AudioElement>((sampleName) => {
      const audio = document.createElement('audio');
      audio.src = `assets/${sampleName}`;
      container.appendChild(audio);
      return audio;
    });

    // Apply pattern like: [
    //   'x-------x-------', // KICKS
    //   '----x-------x---'  // SNARES
    // ]
    this.pattern = pattern;

    // Pointers will point into position on pattern
    this.pointers = new Array<number>(this.pattern.length);
    this.ResetPointers();

    this.bpm = bpm;

    // Will update every bpm tick
    this.updateCallback = updateCallback;
  }

  StartUpdate() {
    this.Update();
  }

  ResetPointers() {
    const { length } = this.pointers;
    for (let i = 0; i < length; i++) this.pointers[i] = 0;
  }

  Update() {
    setTimeout(() => this.Update(), 60000 / this.bpm / 4);
    this.updateCallback(this);
  }
}
