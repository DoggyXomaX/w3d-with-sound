const GlobalSampleList = ['0.mp3', '1.mp3', '2.mp3', '3.mp3'];
const GlobalPattern: string[] = [
  'x---------x-----'.repeat(3) + 'x---------x--xx-' + 'x--x--x--x------'.repeat(3) + 'x--x--x--x---xx-',
  '----x-------x---'.repeat(3) + '----x-------x--x' + '----x-------x---'.repeat(3) + '----x-------x--x',
  'x-x-x-x-x-x-x-x-'.repeat(3) + 'x-x-x-x-----x---' + 'xxxxxxxxxxxxxxxx'.repeat(3) + 'xxxxxxxxx-x---x-',
  'xxxxxxxxxxxxxxxx'.repeat(3) + 'xxxxxxxxx-x---x-' + 'x-x-x-x-x-x-x-x-'.repeat(3) + 'x-x-x-x-----x---',
];
const GlobalBPM: number = 70;

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
    for (let p = 0; p < length; p++) {
      const pattern = audioPage.pattern[p];
      if (pattern[audioPage.pointers[p]] === 'x') {
        const audio = audioPage.audios[p];
        if (audio === null) continue;
        audio.pause();
        audio.currentTime = 0;
        audio.play().catch(() => undefined);

        const names = ['kick', 'snare', 'a', 'a#'];
        console.log(names[p]);

        const power = [0.06, 0.03, 0, 0];
        this.rotationVelocity.Add(new Vector3(1, 1, 1).Multiply(power[p] * 0.5 + Math.random() * power[p] * 0.5));
      }
      audioPage.pointers[p]++;
      if (audioPage.pointers[p] === pattern.length)
        audioPage.pointers[p] = 0;
    }
  }

  DrawFrame(world3D: World3D) {
    world3D.Render();

    // Add some velocity
    this.testObject.eulerAngles.Add(this.rotationVelocity);

    // Scale
    const scale = 1 + this.rotationVelocity.x * 20;
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