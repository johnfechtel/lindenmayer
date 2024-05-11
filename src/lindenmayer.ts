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
  const { result, segments, description, min, max } = lindenmayer();

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    90,
    window.innerWidth / window.innerHeight,
    1,
    500
  );

  camera.position.set((max.x + min.x) / 2, (max.y, min.y), 1000);

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);

  const material = new THREE.LineBasicMaterial({ color: 0xffffff });

  const colors = [];

  let tSegments: THREE.Line[] = [];

  let i = 0;
  segments.forEach((s) => {
    const positions: THREE.Vector3[] = [];

    positions.push(new THREE.Vector3(s.start.x, s.start.y, 0));
    positions.push(new THREE.Vector3(s.end.x, s.end.y, 0));

    const geometry = new THREE.BufferGeometry().setFromPoints(positions);
    const line = new THREE.Line(geometry, material);

    tSegments.push(line);

    console.log(JSON.stringify(s));
  });

  camera.position.z = 5;
  camera.lookAt(0, 0, 0);

  let idx = 0;
  function animate() {
    requestAnimationFrame(animate);

    // required if controls.enableDamping or controls.autoRotate are set to true
    controls.update();

    renderer.render(scene, camera);

    if (tSegments.length > idx - 1) {
      scene.add(tSegments[idx]);
    }

    idx++;

    setTimeout(() => {}, 100);
  }

  animate();
}
