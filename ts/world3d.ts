type Pointer = Array<number>;
type Context2D = CanvasRenderingContext2D | null;
type World3DCallback = (world3D: World3D) => void;

class Object3D {
  name: string = 'GenericObject';
  color: Color4 = new Color4(255, 255, 255, 1);
  position: Vector3 = new Vector3(0, 0, 0);
  eulerAngles: Vector3 = new Vector3(0, 0, 0);
  scale: Vector3 = new Vector3(1, 1, 1);
  lineWidth: number = 1;
  points: Vector3[] = [];
  deltaPoints: Vector3[] = [];
  indices: Pointer[] = [];

  constructor(name?: string, color?: Color4) {
    if (name !== undefined) this.name = name;
    if (color !== undefined) this.color = color;
  }

  SetPoints(points: Vector3[]) {
    this.points = points;
    this.deltaPoints = new Array<Vector3>(points.length);
    const { length } = points;
    for (let i = 0; i < length; i++)
      this.deltaPoints[i] = new Vector3(
        points[i].x,
        points[i].y,
        points[i].z
      );
  }

  SetIndices(indices: Pointer[]) {
    this.indices = indices;
  }

  ResetPoints() {
    const { length } = this.deltaPoints;
    for (let i = 0; i < length; i++) {
      this.deltaPoints[i].x = this.points[i].x;
      this.deltaPoints[i].y = this.points[i].y;
      this.deltaPoints[i].z = this.points[i].z;
    }
  }

  ApplyPosition() {
    const { length } = this.deltaPoints;
    for (let i = 0; i < length; i++) {
      this.deltaPoints[i].x += this.position.x;
      this.deltaPoints[i].y += this.position.y;
      this.deltaPoints[i].z += this.position.z;
    }
  }

  ApplyRotationX() {
    /* | x |   | 1  0  0 |   | x         |
       | y | * | 0  c -s | = | y*c - z*s |
       | z |   | 0  s  c |   | z*c + y*s | */
    const { length } = this.deltaPoints;
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
    /* | x |   | c  0  s |   | x*c + z*s |
       | y | * | 0  1  0 | = | y         |
       | z |   |-s  0  c |   | z*c - x*s | */
    const { length } = this.deltaPoints;
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
    /* | x |   | c -s  0 |   | x*c - y*s |
       | y | * | s  c  0 | = | y*c + x*s |
       | z |   | 0  0  1 |   | z         | */
    const { length } = this.deltaPoints;
    const cosZ = Math.cos(this.eulerAngles.z);
    const sinZ = Math.sin(this.eulerAngles.z);
    for (let i = 0; i < length; i++) {
      const point = this.deltaPoints[i];
      const xPoint = point.x * cosZ - point.y * sinZ;
      this.deltaPoints[i].y = point.y * cosZ + point.x * sinZ;
      this.deltaPoints[i].x = xPoint;
    }
  }

  ApplyScale() {
    const { length } = this.deltaPoints;
    for (let i = 0; i < length; i++) {
      this.deltaPoints[i].x *= this.scale.x;
      this.deltaPoints[i].y *= this.scale.y;
      this.deltaPoints[i].z *= this.scale.z;
    }
  }

  ApplyProjection(screen: Size2, distance: number) {
    const { length } = this.deltaPoints;
    for (let i = 0; i < length; i++) {
      // https://en.wikipedia.org/wiki/3D_projection
      const point = this.deltaPoints[i];
      if (point.z === 0) point.z = 0.01;

      const dz = distance / point.z;
      this.deltaPoints[i].x = point.x * dz + screen.width * 0.5;
      this.deltaPoints[i].y = point.y * dz + screen.height * 0.5;
      this.deltaPoints[i].z = 0;
    }
  }
}

class World3D {
  canvas: HTMLCanvasElement;
  context: Context2D;
  objects: Object3D[];
  clearColor: Color4 = new Color4(0, 0, 0, 1);
  updateCallback: World3DCallback;

  constructor(width: number, height: number, container: HTMLElement, updateCallback: World3DCallback) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    this.canvas.className = 'viewport';
    container.appendChild(this.canvas);

    this.context = this.canvas.getContext('2d');
    if (this.context !== null) {
      this.context.lineCap = 'round';
      this.context.lineJoin = 'round';
    }

    this.objects = [];
    this.updateCallback = updateCallback;
    this.Clear();
  }

  StartUpdate() {
    this.Update();
  }

  Add(obj3D: Object3D) {
    this.objects.push(obj3D);
  }

  Clear() {
    if (this.context === null) return;

    this.context.fillStyle = `rgba(${this.clearColor.r},${this.clearColor.g},${this.clearColor.b},${this.clearColor.a})`;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  DrawObject(obj3D: Object3D) {
    if (this.context === null) return;

    obj3D.ResetPoints();
    obj3D.ApplyRotationZ();
    obj3D.ApplyRotationX();
    obj3D.ApplyRotationY();
    obj3D.ApplyScale();
    obj3D.ApplyPosition();
    obj3D.ApplyProjection(new Size2(this.canvas.width, this.canvas.height), 400);

    const { color, lineWidth } = obj3D;
    this.context.strokeStyle = `rgba(${color.r},${color.g},${color.b},${color.a})`;
    this.context.lineWidth = lineWidth;

    const { length } = obj3D.indices;
    for (let i = 0; i < length; i++) {
      const side = obj3D.indices[i];
      this.context.beginPath();
      const sideLength = side.length;
      for (let j = 0; j < sideLength; j++) {
        const p = obj3D.deltaPoints[side[j]];
        if (j === 0)
          this.context.moveTo(p.x, p.y);
        else
          this.context.lineTo(p.x, p.y);
      }
      this.context.closePath();
      this.context.stroke();
    }
  }

  Render() {
    this.Clear();
    const { length } = this.objects;
    for (let i = 0; i < length; i++)
      this.DrawObject(this.objects[i]);
  }

  Update() {
    setTimeout(() => this.Update(), 1000 / 60);
    this.updateCallback(this);
  }
}
