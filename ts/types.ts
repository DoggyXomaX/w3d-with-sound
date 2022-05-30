

class Color4 {
  r: number;
  g: number;
  b: number;
  a: number = 1;

  constructor(r: number, g: number, b: number, a?: number) {
    this.r = r < 0 ? 0 : (r > 255 ? 255 : r);
    this.g = g < 0 ? 0 : (g > 255 ? 255 : g);
    this.b = b < 0 ? 0 : (b > 255 ? 255 : b);
    if (a !== undefined) this.a = a < 0 ? 0 : (a > 1 ? 1 : a);
  }
}

class Vector3 {
  x: number = 0;
  y: number = 0;
  z: number = 0;

  constructor(x?: number, y?: number, z?: number) {
    if (x !== undefined) this.x = x;
    if (y !== undefined) this.y = y;
    if (z !== undefined) this.z = z;
  }

  Set(v: Vector3): Vector3 {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
    return this;
  }

  Add(v: Vector3): Vector3 {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    return this;
  }

  Multiply(n: number): Vector3 {
    this.x *= n;
    this.y *= n;
    this.z *= n;
    return this;
  }
}

class Vector2 {
  x: number = 0;
  y: number = 0;

  constructor(x?: number, y?: number) {
    if (x !== undefined) this.x = x;
    if (y !== undefined) this.y = y;
  }

  Set(v: Vector2): Vector2 {
    this.x = v.x;
    this.y = v.y;
    return this;
  }

  Add(v: Vector2): Vector2 {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  Multiply(n: number): Vector2 {
    this.x *= n;
    this.y *= n;
    return this;
  }
}

class Size2 {
  width: number = 0;
  height: number = 0;

  constructor(width?: number, height?: number) {
    if (width !== undefined) this.width = width;
    if (height !== undefined) this.height = height;
  }
}