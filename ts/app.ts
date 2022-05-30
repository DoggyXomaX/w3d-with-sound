const GlobalSampleListLegacy = ['0.mp3', '1.mp3', '2.mp3', '3.mp3'];
const GlobalSampleList = [
  // Drums
  'pack1/kick.mp3',
  'pack1/hat.mp3',
  'pack1/snare.mp3',
  'pack1/808.mp3',

  // Bass
  'pack1/bass1.mp3',
  'pack1/bass2.mp3',

  // Melody
  'pack1/plunk1.mp3',
  'pack1/plunk2.mp3',
  'pack1/plunk3.mp3',

  // Vocal
  'pack1/smoke1.mp3',
  'pack1/smoke2.mp3',
  'pack1/amogus.mp3',
  'pack1/maslous.mp3',
  'pack1/maslous2.mp3'
];
const GlobalPattern: string[] = [
  'x---------x-----'.repeat(3) + 'x-----x---------',
  '--xx--xxxx-x--x-'.repeat(3) + '--x-x-----x-x---',
  '----x-------x--x'.repeat(3) + '--------x-----x-',
  'x---------------'.repeat(3) + 'x---------------',

  'x-b-x--bx--bx-b-'.repeat(3) + 'xxxxxxbxxxxxxxbx',
  '--xxb---------x-'.repeat(3) + '------x-------x-',

  '---x----x-------'.repeat(3) + 'x---------------',
  '------x---x---x-'.repeat(3) + '------x---------',
  'x-x-x-------x---'.repeat(3) + '------------x---',

  '--------' + '--------' + '--------' + '------x-',
  '--------' + '------x-' + '--------' + '--------',
  '--------' + '--x-----' + '--------' + '--------',
  '--------' + '--------' + '--------' + '-x------' + '--------' + '--------' + '--------' + '--------',
  '--------' + '--------' + '--------' + '--------' + '--------' + '--------' + '--------' + '-x------',
];
const GlobalBPM: number = 90;

class App {
  mainContainer: HTMLDivElement;
  testObject: Object3D;
  rotationVelocity: Vector3 = new Vector3(0, 0, 0);

  constructor() {
    // Create Main Container
    const div = document.createElement('div');
    div.className = 'page-container';
    document.body.appendChild(div);
    this.mainContainer = div;

    // Create test object for spinnin :O
    this.testObject = new Object3D('Test object', new Color4(0, 255, 0));
    this.testObject.position = new Vector3(0, 0, 500);
    this.testObject.SetPoints([
      new Vector3(0 - 50, 0 - 50, 0 - 50),
      new Vector3(100 - 50, 0 - 50, 0 - 50),
      new Vector3(100 - 50, 100 - 50, 0 - 50),
      new Vector3(0 - 50, 100 - 50, 0 - 50),
      new Vector3(0 - 50, 0 - 50, 100 - 50),
      new Vector3(100 - 50, 0 - 50, 100 - 50),
      new Vector3(100 - 50, 100 - 50, 100 - 50),
      new Vector3(0 - 50, 100 - 50, 100 - 50)
    ]);
    this.testObject.SetIndices([
      [0, 1, 2, 3],
      [4, 5, 6, 7],
      [0, 4],
      [1, 5],
      [2, 6],
      [3, 7]
    ]);

    const world3D = new World3D(
      800, 800,
      this.mainContainer,
      (world3D: World3D) => this.DrawFrame(world3D)
    );
    world3D.Add(this.testObject);
    world3D.clearColor = new Color4(0, 0, 0, 0.4);

    const audioPage = new AudioPage(
      GlobalSampleList,
      GlobalPattern,
      GlobalBPM,
      this.mainContainer,
      (audioPage: AudioPage) => this.AudioFrame(audioPage)
    );

    world3D.StartUpdate();
    audioPage.StartUpdate();
  }

  AudioFrame(audioPage: AudioPage) {
    const { length } = audioPage.pointers;
    const logEntry: string[] = [];
    for (let p = 0; p < length; p++) {
      const pattern = audioPage.pattern[p];
      const symbol = pattern[audioPage.pointers[p]];

      if (symbol === 'x') {
        const audio = audioPage.audios[p];
        if (audio === null) continue;
        audio.pause();
        audio.currentTime = 0;
        audio.play().catch(() => undefined);

        const names = GlobalSampleList;
        logEntry.push(names[p]);

        const power = new Array<number>(names.length).fill(0);
        power[0] = 0.006;
        power[2] = 0.003;
        power[3] = 0.012;

        this.rotationVelocity.Add(new Vector3(1, 1, 1).Multiply(power[p] * 0.8 + Math.random() * power[p] * 0.2));
      } else if (symbol === 'b') {
        const audio = audioPage.audios[p];
        if (audio === null) continue;
        audio.pause();
      }

      audioPage.pointers[p]++;
      if (audioPage.pointers[p] === pattern.length)
        audioPage.pointers[p] = 0;
    }
    if (logEntry.length !== 0)
      console.log(`[${logEntry.join(' ')}]`);
  }

  DrawFrame(world3D: World3D) {
    world3D.Render();

    // Add some velocity
    this.testObject.eulerAngles.Add(this.rotationVelocity);

    // Color
    const value = this.rotationVelocity.x * 100 > 1 ? 1 : this.rotationVelocity.x * 100;
    this.testObject.color = new Color4(value * 255, 255 - value * 255, 0, value * value);
    world3D.canvas.style.filter = `blur(${value * 2}px)`

    // Scale
    const scale = 1 + this.rotationVelocity.x * 100;
    const one = new Vector3(1, 1, 1);
    this.testObject.scale.Set(one.Multiply(scale));

    // Line width
    this.testObject.lineWidth = 1 + this.rotationVelocity.x * 100;

    // Fade velocity
    this.rotationVelocity.Multiply(0.98);
  }
}

let app: App;
window.onload = () => app = new App();