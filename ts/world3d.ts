type Pointer = Array<number>;
type Context2D = CanvasRenderingContext2D | null;

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
  length: number;

  constructor(name?: string) {
    if (name !== undefined) this.name = name;
    this.position = new Vector3();
    this.eulerAngles = new Vector3();
    this.points = [];
    this.deltaPoints = [];
    this.indices = [];
    this.length = 0;
  }

  SetPoints(points: Vector3[]) {
    this.points = points;
    this.length = points.length;
    this.ResetPoints();
  }

  ResetPoints() {
    const { length } = this;
    for (let i = 0; i < length; i++) {
      this.deltaPoints[i].x = this.points[i].x;
      this.deltaPoints[i].y = this.points[i].y;
      this.deltaPoints[i].z = this.points[i].z;
    }
  }

  ApplyPosition() {
    const { length } = this;
    for (let i = 0; i < length; i++) {
      this.deltaPoints[i].x += this.position.x;
      this.deltaPoints[i].y += this.position.y;
      this.deltaPoints[i].z += this.position.z;
    }
  }

  ApplyRotationX() {
    const { length } = this;
    const cosX = Math.cos(this.eulerAngles.x);
    const sinX = Math.sin(this.eulerAngles.x);
    for (let i = 0; i < length; i++) {
      const point = this.deltaPoints[i];
      const yPoint = point.y * cosX - point.z * sinX;
      this.deltaPoints[i].z = point.z * cosX + point.y * sinX;
      this.deltaPoints[i].y = yPoint;
    }
  }

  ApplyRotationY() {
    const { length } = this;
    const cosY = Math.cos(this.eulerAngles.y);
    const sinY = Math.sin(this.eulerAngles.y);
    for (let i = 0; i < length; i++) {
      const point = this.deltaPoints[i];
      const xPoint = point.x * cosY + point.z * sinY;
      this.deltaPoints[i].z = point.z * cosY - point.x * sinY;
      this.deltaPoints[i].x = xPoint;
    }
  }

  ApplyRotationZ() {
    const { length } = this;
    const cosZ = Math.cos(this.eulerAngles.z);
    const sinZ = Math.sin(this.eulerAngles.z);
    for (let i = 0; i < length; i++) {
      const point = this.deltaPoints[i];
      const xPoint = point.x * cosZ - point.y * sinZ;
      this.deltaPoints[i].y = point.y * cosZ + point.x * sinZ;
      this.deltaPoints[i].x = xPoint;
    }
  }

  ApplyProjection() {
    const { length } = this;
    for (let i = 0; i < length; i++) {
      // https://en.wikipedia.org/wiki/3D_projection
    }
  }
}

class World3DClass {
  canvas: HTMLCanvasElement;

  constructor() {
    this.canvas = document.createElement('canvas');
    document.body.appendChild(this.canvas);
  }

  DrawObject(obj3D : Object3D) {
    const context : Context2D = this.canvas.getContext('2d');
    if (context === null) return;
    
    const { length } = obj3D;
    context.beginPath();
    for (let i = 0; i < length; i++) {
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
