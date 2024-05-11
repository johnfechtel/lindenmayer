export interface Vector {
  x: number;
  y: number;
  z?: number;
}

export function addVector(a: Vector, b: Vector) {
  let x = a.x + b.x;
  let y = a.y + b.y;

  let added: Vector = { x: x, y: y };

  let zA = a.z === undefined ? 0 : a.z;
  let zB = b.z === undefined ? 0 : b.z;

  let z = zA + zB;

  if (z !== 0) {
    added.z = z;
  }

  return added;
}

export function normalizeVector(a: Vector, magnitude = 1.0) {
  let components = a.x * a.x + a.y * a.y;

  if (a.z !== undefined) {
    components += a.z * a.z;
  }

  let currMag = Math.sqrt(components);

  let normalized: Vector = {
    x: (a.x / currMag) * magnitude,
    y: (a.y / currMag) * magnitude,
  };

  if (a.z !== undefined) {
    normalized.z = (a.z / currMag) * magnitude;
  }

  return normalized;
}

export function rotateVector(a: Vector, angle: number) {
  return {
    x: Math.cos(angle) * a.x - Math.sin(angle) * a.y,
    y: Math.sin(angle) * a.x + Math.cos(angle) * a.y,
  };
}
