type Pointer = Array<number>;

class Vector3 {
  x: number = 0;
  y: number = 0;
  z: number = 0;

  constructor(x?: number, y?: number, z?: number) {
    if (x !== undefined) this.x = x;
    if (y !== undefined) this.y = y;
    if (z !== undefined) this.z = z;
  }
}

class Object3D {
  name: string = "GenericObject";
  position: Vector3;
  eulerAngles: Vector3;
  points: Vector3[];
  deltaPoints: Vector3[];
  indices: Pointer[];

  constructor(name?: string) {
    if (name !== undefined) this.name = name;
    this.position = new Vector3();
    this.eulerAngles = new Vector3();
    this.points = [];
    this.deltaPoints = [];
    this.indices = [];
  }
}

class World3DClass {
  canvas: HTMLCanvasElement;

  constructor() {
    this.canvas = document.createElement('canvas');
    document.body.appendChild(this.canvas);
  }

  DrawObject(obj3D : Object3D) : void {
    const context : CanvasRenderingContext2D | null = this.canvas.getContext('2d');
    if (context === null) return;
    
    const pointsLength: number = obj3D.deltaPoints.length;
    context.beginPath();
    for (let i = 0; i < pointsLength; i++) {
      const selectedPointer: Pointer = obj3D.indices[i];
      const sideLength: number = selectedPointer.length;
      for (let j = 0; j < sideLength; j++) {
        const p = obj3D.deltaPoints[selectedPointer[j]];
        if (j === 0)
          context.moveTo(p.x, p.y);
        else
          context.lineTo(p.x, p.y);
      }
      context.closePath();
      context.stroke();
    }
  }
}
