import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

import { Alphabet, Operation, SymbolMap, Rule, isVariable } from "./system";
import { turtle } from "./turtle";

export function lindenmayer() {
  const a: Alphabet = {
    variables: ["X", "F"],
    constants: ["+", "-", "[", "]"],
  };

  const r: Rule[] = [
    {
      input: "X",
      output: "F+[[X]-X]-F[-FX]+X",
    },
    {
      input: "F",
      output: "FF",
    },
  ];

  let result = construct(a, r, "X", 6);

  let symbolMap: SymbolMap = new Map([
    ["X", { key: "X" }],
    [
      "F",
      {
        key: "F",
        command: {
          description: "forward",
          operation: Operation.Forward,
        },
      },
    ],
    [
      "+",
      {
        key: "+",
        command: {
          description: "turn left 25d",
          operation: Operation.Turn,
          angle: 0.436332,
        },
      },
    ],
    [
      "-",
      {
        key: "-",
        command: {
          description: "turn right 25d",
          operation: Operation.Turn,
          angle: -0.436332,
        },
      },
    ],
    [
      "[",
      {
        key: "[",
        command: {
          description: "push",
          operation: Operation.Push,
        },
      },
    ],
    [
      "]",
      {
        key: "]",
        command: {
          description: "pop",
          operation: Operation.Pop,
        },
      },
    ],
  ]);

  const { segments, description, min, max } = turtle(result, symbolMap);

  return {
    result: result,
    segments: segments,
    description: description,
    min: min,
    max: max,
  };
}

export function construct(a: Alphabet, r: Rule[], s: string, n: number) {
  let result = s;
  while (n > 0) {
    let generationResult = "";
    result.split("").forEach((char) => {
      let rule = r.find((e) => e.input === char);

      if (rule != undefined && isVariable(a, char)) {
        generationResult += rule.output;
      } else {
        generationResult += char;
      }
    });

    result = generationResult;
    n--;
  }

  return result;
}

export function init() {
  const { segments, min, max } = lindenmayer();

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  const c = new THREE.Vector3((max.x + min.x) / 2, (max.y + min.y) / 2, 0);

  const padding = 10;
  const halfFov = camera.fov / 2;

  const maxWH =
    Math.max(Math.abs(max.x - min.x), Math.abs(max.y - min.y)) / 2 + padding;

  const z = maxWH / Math.tan(halfFov * 0.0174533);

  camera.position.set(c.x, c.y, z);

  console.log(JSON.stringify({ maxWH, z, halfFov }));

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);

  controls.enableRotate = false;
  controls.position0.set(c.x, c.y, z);
  controls.target.set(c.x, c.y, 0);
  controls.update();

  let tSegments: THREE.Line[] = [];

  const startColor = new THREE.Color(Math.random() * 0xffffff);
  const endColor = new THREE.Color(Math.random() * 0xffffff);

  for (let i = 0; i < segments.length; i++) {
    const s = segments[i];

    const positions: THREE.Vector3[] = [];

    const alpha = i / segments.length;

    const color = new THREE.Color().lerpColors(startColor, endColor, alpha);

    const material = new THREE.LineBasicMaterial({ color });

    positions.push(new THREE.Vector3(s.start.x, s.start.y, 0));
    positions.push(new THREE.Vector3(s.end.x, s.end.y, 0));

    const geometry = new THREE.BufferGeometry().setFromPoints(positions);
    const line = new THREE.Line(geometry, material);

    tSegments.push(line);
  }

  const bL = new THREE.Vector3(min.x, min.y, 0);
  const tL = new THREE.Vector3(min.x, max.y, 0);
  const tR = new THREE.Vector3(max.x, max.y, 0);
  const bR = new THREE.Vector3(max.x, min.y, 0);

  const vectors = [bL, tL, tR, bR];
  const points = new THREE.Points(
    new THREE.BufferGeometry().setFromPoints(vectors)
  );

  const crosshairSize = 1;
  const crossHairMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
  vectors.forEach((v) => {
    const posVert = [
      new THREE.Vector3(v.x - crosshairSize, v.y, 0),
      new THREE.Vector3(v.x + crosshairSize, v.y, 0),
    ];
    const posHoriz = [
      new THREE.Vector3(v.x, v.y - crosshairSize, 0),
      new THREE.Vector3(v.x, v.y + crosshairSize, 0),
    ];

    const vertical = new THREE.BufferGeometry().setFromPoints(posVert);
    const horizontal = new THREE.BufferGeometry().setFromPoints(posHoriz);

    const lineVertical = new THREE.Line(vertical, crossHairMaterial);
    const lineHorizontal = new THREE.Line(horizontal, crossHairMaterial);

    scene.add(lineVertical);
    scene.add(lineHorizontal);
  });

  scene.add(points);

  let idx = 0;
  function animate() {
    requestAnimationFrame(animate);

    renderer.render(scene, camera);

    if (tSegments.length > idx - 1) {
      scene.add(tSegments[idx]);
    }

    idx++;

    setTimeout(() => {}, 100);
  }

  animate();
}
