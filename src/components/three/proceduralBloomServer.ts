import * as THREE from 'three';

// Module-scope reusable math helpers (zero GC inside frame loops)
const _tempVec = new THREE.Vector3();
const _tempTan = new THREE.Vector3();
const _tempQuat = new THREE.Quaternion();
const _tempScale = new THREE.Vector3();
const _tempMatrix = new THREE.Matrix4();
const _upAxis = new THREE.Vector3(0, 1, 0);

/**
 * Generates an anisotropic brushed stainless steel roughness + bump CanvasTexture.
 * Left in linear space (NoColorSpace) because it encodes surface micro-roughness/height.
 */
export function createBrushedMetalTextures(maxAnisotropy: number): {
  roughnessMap: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
} {
  const size = 512;

  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = size;
  roughCanvas.height = size;
  const rCtx = roughCanvas.getContext('2d')!;

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = size;
  bumpCanvas.height = size;
  const bCtx = bumpCanvas.getContext('2d')!;

  // Base mid-roughness for matte dark brushed stainless steel
  rCtx.fillStyle = 'rgb(134, 134, 134)';
  rCtx.fillRect(0, 0, size, size);

  bCtx.fillStyle = 'rgb(128, 128, 128)';
  bCtx.fillRect(0, 0, size, size);

  let seed = 4219;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  for (let i = 0; i < 3200; i++) {
    const x = rand() * size;
    const y = rand() * size;
    const len = 30 + rand() * 140;
    const shadeR = Math.floor(108 + rand() * 64);
    const shadeB = Math.floor(114 + rand() * 28);
    const alpha = 0.14 + rand() * 0.22;

    rCtx.strokeStyle = `rgba(${shadeR},${shadeR},${shadeR},${alpha})`;
    rCtx.lineWidth = 0.6 + rand() * 1.1;
    rCtx.beginPath();
    rCtx.moveTo(x, y);
    rCtx.lineTo(x, Math.min(size, y + len));
    rCtx.stroke();

    bCtx.strokeStyle = `rgba(${shadeB},${shadeB},${shadeB},${alpha * 0.85})`;
    bCtx.lineWidth = 0.6 + rand() * 0.9;
    bCtx.beginPath();
    bCtx.moveTo(x, y);
    bCtx.lineTo(x, Math.min(size, y + len));
    bCtx.stroke();
  }

  const roughnessMap = new THREE.CanvasTexture(roughCanvas);
  roughnessMap.wrapS = THREE.RepeatWrapping;
  roughnessMap.wrapT = THREE.RepeatWrapping;
  roughnessMap.repeat.set(3, 3);
  roughnessMap.anisotropy = maxAnisotropy;

  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.RepeatWrapping;
  bumpMap.repeat.set(3, 3);
  bumpMap.anisotropy = maxAnisotropy;

  return { roughnessMap, bumpMap };
}

/**
 * Generates a soft radial contact shadow texture for grounding the cabinet on y = 0.
 */
export function createContactShadowTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createRadialGradient(
    size / 2,
    size / 2,
    size * 0.08,
    size / 2,
    size / 2,
    size * 0.48,
  );
  grad.addColorStop(0, 'rgba(0, 6, 14, 0.72)');
  grad.addColorStop(0.55, 'rgba(0, 10, 20, 0.34)');
  grad.addColorStop(1, 'rgba(0, 10, 20, 0.0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Soft radial sprite texture for glowing O2- cyan particles.
 */
export function createGlowSpriteTexture(): THREE.CanvasTexture {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2,
  );
  grad.addColorStop(0.0, 'rgba(255, 255, 255, 1.0)');
  grad.addColorStop(0.22, 'rgba(165, 243, 252, 0.92)');
  grad.addColorStop(0.52, 'rgba(0, 229, 255, 0.42)');
  grad.addColorStop(1.0, 'rgba(0, 229, 255, 0.0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export interface ProceduralSplitCabinet {
  group: THREE.Group;
  leftHalf: THREE.Group;
  rightHalf: THREE.Group;
}

/**
 * Builds a split-ready procedural Bloom Energy Server housing (used immediately
 * while the GLB streams and as fallback). Left and right shells slide apart along X
 * during Exploded View to reveal the glowing ceramic fuel cell stack core.
 */
export function createProceduralSplitCabinet(
  roughnessMap: THREE.Texture,
  bumpMap: THREE.Texture,
): ProceduralSplitCabinet {
  const root = new THREE.Group();
  root.name = 'ProceduralSplitBloomServer';

  const leftHalf = new THREE.Group();
  leftHalf.name = 'ProceduralLeftHousing';
  const rightHalf = new THREE.Group();
  rightHalf.name = 'ProceduralRightHousing';
  root.add(leftHalf, rightHalf);

  const totalWidth = 0.72;
  const halfW = totalWidth / 2;
  const height = 1.04;
  const depth = 0.61;
  const plinthHeight = 0.075;
  const bodyHeight = height - plinthHeight;
  const frontFillet = 0.042;
  const backFillet = 0.012;

  const darkSteelMat = new THREE.MeshPhysicalMaterial({
    color: 0x242b33,
    metalness: 0.85,
    roughness: 0.42,
    roughnessMap,
    bumpMap,
    bumpScale: 0.0024,
    anisotropy: 0.7,
    anisotropyRotation: Math.PI / 2,
    envMapIntensity: 1.35,
  });

  const innerFlangeMat = new THREE.MeshStandardMaterial({
    color: 0x161c24,
    metalness: 0.78,
    roughness: 0.36,
  });

  const seamMat = new THREE.MeshStandardMaterial({
    color: 0x0a0e14,
    metalness: 0.45,
    roughness: 0.8,
  });

  const silverPlinthMat = new THREE.MeshPhysicalMaterial({
    color: 0xcbd5e1,
    metalness: 0.92,
    roughness: 0.24,
    roughnessMap,
    anisotropy: 0.6,
    envMapIntensity: 1.4,
  });

  const louverMat = new THREE.MeshStandardMaterial({
    color: 0x181f27,
    metalness: 0.75,
    roughness: 0.5,
  });

  const hd = depth / 2;

  const buildShellHalf = (isRight: boolean, targetGroup: THREE.Group) => {
    const sign = isRight ? 1 : -1;
    const shape = new THREE.Shape();

    if (isRight) {
      shape.moveTo(0, -hd);
      shape.lineTo(halfW - backFillet, -hd);
      shape.quadraticCurveTo(halfW, -hd, halfW, -hd + backFillet);
      shape.lineTo(halfW, hd - frontFillet);
      shape.quadraticCurveTo(halfW, hd, halfW - frontFillet, hd);
      shape.lineTo(0, hd);
      shape.lineTo(0, -hd);
    } else {
      shape.moveTo(-halfW + backFillet, -hd);
      shape.lineTo(0, -hd);
      shape.lineTo(0, hd);
      shape.lineTo(-halfW + frontFillet, hd);
      shape.quadraticCurveTo(-halfW, hd, -halfW, hd - frontFillet);
      shape.lineTo(-halfW, -hd + backFillet);
      shape.quadraticCurveTo(-halfW, -hd, -halfW + backFillet, -hd);
    }

    const shellGeo = new THREE.ExtrudeGeometry(shape, {
      depth: bodyHeight - 0.014,
      bevelEnabled: true,
      bevelThickness: 0.006,
      bevelSize: 0.005,
      bevelSegments: 2,
      curveSegments: 10,
    });
    shellGeo.rotateX(-Math.PI / 2);

    const shellMesh = new THREE.Mesh(shellGeo, darkSteelMat);
    shellMesh.position.y = plinthHeight + 0.007;
    shellMesh.castShadow = true;
    shellMesh.receiveShadow = true;
    targetGroup.add(shellMesh);

    // Cutaway structural bulkhead frame on the inner split face
    const flangeGeo = new THREE.BoxGeometry(0.012, bodyHeight - 0.03, depth - 0.03);
    const flange = new THREE.Mesh(flangeGeo, innerFlangeMat);
    flange.position.set(sign * 0.006, plinthHeight + bodyHeight / 2, 0);
    targetGroup.add(flange);

    // Recessed bright silver metal plinth half
    const plinthHalfW = halfW - 0.022;
    const plinthGeo = new THREE.BoxGeometry(plinthHalfW, plinthHeight, depth - 0.045);
    const plinth = new THREE.Mesh(plinthGeo, silverPlinthMat);
    plinth.position.set(sign * (plinthHalfW / 2), plinthHeight / 2, 0);
    plinth.castShadow = true;
    plinth.receiveShadow = true;
    targetGroup.add(plinth);

    // Vertical panel seam
    const seamHeight = bodyHeight - 0.04;
    const seamY = plinthHeight + bodyHeight / 2;
    const seamFrontGeo = new THREE.BoxGeometry(0.005, seamHeight, 0.006);
    const frontSeam = new THREE.Mesh(seamFrontGeo, seamMat);
    frontSeam.position.set(sign * 0.15, seamY, hd + 0.004);
    targetGroup.add(frontSeam);

    const seamSideGeo = new THREE.BoxGeometry(0.006, seamHeight, 0.005);
    [-0.1, 0.1].forEach((zPos) => {
      const sideSeam = new THREE.Mesh(seamSideGeo, seamMat);
      sideSeam.position.set(sign * (halfW + 0.004), seamY, zPos);
      targetGroup.add(sideSeam);
    });

    // Top exhaust louver half
    const hoodGeo = new THREE.BoxGeometry(halfW - 0.06, 0.02, depth - 0.12);
    const hood = new THREE.Mesh(hoodGeo, seamMat);
    hood.position.set(sign * ((halfW - 0.06) / 2), height - 0.004, 0);
    targetGroup.add(hood);

    const louverCount = 12;
    const slatGeo = new THREE.BoxGeometry(halfW - 0.08, 0.011, 0.015);
    const louvers = new THREE.InstancedMesh(slatGeo, louverMat, louverCount);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < louverCount; i++) {
      const t = i / (louverCount - 1) - 0.5;
      dummy.position.set(sign * ((halfW - 0.08) / 2 + 0.008), height + 0.008, t * (depth - 0.18));
      dummy.rotation.set(0.38, 0, 0);
      dummy.updateMatrix();
      louvers.setMatrixAt(i, dummy.matrix);
    }
    louvers.instanceMatrix.needsUpdate = true;
    louvers.computeBoundingSphere();
    targetGroup.add(louvers);

    // Side intake louver grilles
    const sideSlatCount = 9;
    const sideSlatGeo = new THREE.BoxGeometry(0.008, 0.01, 0.16);
    const sideGrilles = new THREE.InstancedMesh(sideSlatGeo, louverMat, sideSlatCount);
    for (let i = 0; i < sideSlatCount; i++) {
      dummy.position.set(sign * (halfW + 0.003), plinthHeight + 0.15 + i * 0.02, 0);
      dummy.rotation.set(0, 0, isRight ? -0.35 : 0.35);
      dummy.updateMatrix();
      sideGrilles.setMatrixAt(i, dummy.matrix);
    }
    sideGrilles.instanceMatrix.needsUpdate = true;
    sideGrilles.computeBoundingSphere();
    targetGroup.add(sideGrilles);
  };

  buildShellHalf(false, leftHalf);
  buildShellHalf(true, rightHalf);

  return { group: root, leftHalf, rightHalf };
}

/**
 * Builds two slim inner structural bulkhead plates attached to the split halves of the GLB
 * so the cutaway housing displays engineered metallic wall thickness when opened.
 */
export function createCutawayEdgeBulkhead(side: 'left' | 'right'): THREE.Group {
  const group = new THREE.Group();
  const frameMat = new THREE.MeshStandardMaterial({
    color: 0x111827,
    metalness: 0.78,
    roughness: 0.36,
  });
  const cyanTrimMat = new THREE.MeshStandardMaterial({
    color: 0x00e5ff,
    emissive: 0x00e5ff,
    emissiveIntensity: 0.85,
    metalness: 0.2,
    roughness: 0.3,
  });

  const sign = side === 'right' ? 1 : -1;
  const xOffset = sign * 0.008;

  // Front/Back/Top/Bottom slim architectural frame around the split plane
  const pillarGeo = new THREE.BoxGeometry(0.014, 0.92, 0.026);
  const frontPillar = new THREE.Mesh(pillarGeo, frameMat);
  frontPillar.position.set(xOffset, 0.52, 0.275);
  const backPillar = new THREE.Mesh(pillarGeo, frameMat);
  backPillar.position.set(xOffset, 0.52, -0.275);

  const railGeo = new THREE.BoxGeometry(0.014, 0.024, 0.56);
  const topRail = new THREE.Mesh(railGeo, frameMat);
  topRail.position.set(xOffset, 0.97, 0);
  const botRail = new THREE.Mesh(railGeo, frameMat);
  botRail.position.set(xOffset, 0.075, 0);

  // Thin glowing cyan gasket line along the front cross-section edge
  const trimGeo = new THREE.BoxGeometry(0.004, 0.84, 0.005);
  const frontTrim = new THREE.Mesh(trimGeo, cyanTrimMat);
  frontTrim.position.set(xOffset, 0.52, 0.26);

  group.add(frontPillar, backPillar, topRail, botRail, frontTrim);
  return group;
}

export interface FuelCellCoreAssembly {
  group: THREE.Group;
  update: (elapsed: number, explodeFactor: number) => void;
}

/**
 * Builds the internal glowing Ceramic Solid Oxide Fuel Cell (SOFC) Stack Modules
 * revealed inside the split housing:
 * - Central base manifold & top collector manifold
 * - 4 modular SOFC ceramic stack columns
 * - 112 ceramic wafer plates + glowing cyan electrolyte edge emitters
 * - Vertical titanium tie-rods & compression headers
 */
export function createFuelCellCoreGroup(
  roughnessMap: THREE.Texture,
  bumpMap: THREE.Texture,
): FuelCellCoreAssembly {
  const group = new THREE.Group();
  group.name = 'CeramicFuelCellCore';

  const frameMetalMat = new THREE.MeshPhysicalMaterial({
    color: 0x1e293b,
    metalness: 0.88,
    roughness: 0.32,
    roughnessMap,
    bumpMap,
    bumpScale: 0.0018,
    envMapIntensity: 1.4,
  });

  const copperBusMat = new THREE.MeshPhysicalMaterial({
    color: 0xd97706,
    metalness: 0.92,
    roughness: 0.25,
    emissive: 0xf59e0b,
    emissiveIntensity: 0.45,
  });

  const silverManifoldMat = new THREE.MeshPhysicalMaterial({
    color: 0x94a3b8,
    metalness: 0.9,
    roughness: 0.28,
    envMapIntensity: 1.35,
  });

  const ceramicBodyMat = new THREE.MeshPhysicalMaterial({
    color: 0xe2e8f0,
    metalness: 0.15,
    roughness: 0.28,
    clearcoat: 0.6,
    clearcoatRoughness: 0.15,
    emissive: 0x0284c7,
    emissiveIntensity: 0.13,
  });

  const ceramicGlowMat = new THREE.MeshStandardMaterial({
    color: 0x67e8f9,
    emissive: 0x00e5ff,
    emissiveIntensity: 0.6,
    metalness: 0.1,
    roughness: 0.2,
  });

  // 1. Base fuel distribution & DC collector plinth inside the cabinet
  const basePlateGeo = new THREE.BoxGeometry(0.46, 0.045, 0.42);
  const basePlate = new THREE.Mesh(basePlateGeo, frameMetalMat);
  basePlate.position.set(0, 0.095, 0);
  basePlate.castShadow = true;
  basePlate.receiveShadow = true;
  group.add(basePlate);

  const subPlinthGeo = new THREE.BoxGeometry(0.38, 0.065, 0.34);
  const subPlinth = new THREE.Mesh(subPlinthGeo, silverManifoldMat);
  subPlinth.position.set(0, 0.04, 0);
  group.add(subPlinth);

  // Central reformer / fuel pre-heater cylinder core
  const centralCoreGeo = new THREE.CylinderGeometry(0.046, 0.046, 0.78, 24);
  const centralCore = new THREE.Mesh(centralCoreGeo, silverManifoldMat);
  centralCore.position.set(0, 0.51, 0);
  group.add(centralCore);

  // Glowing cyan energy rings around central reformer column
  const coreRingMat = new THREE.MeshStandardMaterial({
    color: 0x00e5ff,
    emissive: 0x00e5ff,
    emissiveIntensity: 0.7,
    roughness: 0.2,
  });
  for (let r = 0; r < 5; r++) {
    const ringGeo = new THREE.TorusGeometry(0.05, 0.004, 10, 28);
    ringGeo.rotateX(Math.PI / 2);
    const ring = new THREE.Mesh(ringGeo, coreRingMat);
    ring.position.set(0, 0.22 + r * 0.14, 0);
    group.add(ring);
  }

  // 2. Top exhaust collector manifold
  const topManifoldGeo = new THREE.BoxGeometry(0.44, 0.042, 0.38);
  const topManifold = new THREE.Mesh(topManifoldGeo, frameMetalMat);
  topManifold.position.set(0, 0.92, 0);
  group.add(topManifold);

  const exhaustPipeGeo = new THREE.CylinderGeometry(0.036, 0.044, 0.06, 20);
  const exhaustPipe = new THREE.Mesh(exhaustPipeGeo, silverManifoldMat);
  exhaustPipe.position.set(0, 0.96, 0);
  group.add(exhaustPipe);

  // 3. Four Modular Ceramic Fuel Cell Stack Columns (2x2 grid)
  const stackPositions: [number, number][] = [
    [-0.125, 0.105],
    [0.125, 0.105],
    [-0.125, -0.105],
    [0.125, -0.105],
  ];

  const layersPerStack = 26;
  const totalLayers = stackPositions.length * layersPerStack;

  const waferGeo = new THREE.BoxGeometry(0.165, 0.011, 0.145);
  const glowLayerGeo = new THREE.BoxGeometry(0.171, 0.0055, 0.151);

  const waferInstanced = new THREE.InstancedMesh(waferGeo, ceramicBodyMat, totalLayers);
  const glowInstanced = new THREE.InstancedMesh(glowLayerGeo, ceramicGlowMat, totalLayers);

  const capGeo = new THREE.BoxGeometry(0.185, 0.02, 0.165);
  const rodGeo = new THREE.CylinderGeometry(0.0055, 0.0055, 0.77, 10);
  const busPlateGeo = new THREE.BoxGeometry(0.016, 0.74, 0.038);

  const dummy = new THREE.Object3D();
  let instanceIdx = 0;

  stackPositions.forEach(([sx, sz]) => {
    // Bottom & Top stack compression endplates
    const botCap = new THREE.Mesh(capGeo, frameMetalMat);
    botCap.position.set(sx, 0.135, sz);
    const topCap = new THREE.Mesh(capGeo, frameMetalMat);
    topCap.position.set(sx, 0.885, sz);
    group.add(botCap, topCap);

    // 4 Corner tie-rods per stack
    const rodDx = 0.082;
    const rodDz = 0.072;
    [
      [-rodDx, -rodDz],
      [rodDx, -rodDz],
      [-rodDx, rodDz],
      [rodDx, rodDz],
    ].forEach(([rx, rz]) => {
      const rod = new THREE.Mesh(rodGeo, silverManifoldMat);
      rod.position.set(sx + rx, 0.51, sz + rz);
      group.add(rod);
    });

    // Amber-gold DC collector busbar strip running down the outer side of each stack
    const bus = new THREE.Mesh(busPlateGeo, copperBusMat);
    bus.position.set(sx + (sx > 0 ? 0.095 : -0.095), 0.505, sz);
    group.add(bus);

    // Populate ceramic wafers & glowing electrolyte layers
    for (let l = 0; l < layersPerStack; l++) {
      const y = 0.162 + l * 0.0272;
      dummy.position.set(sx, y, sz);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      waferInstanced.setMatrixAt(instanceIdx, dummy.matrix);

      dummy.position.set(sx, y + 0.013, sz);
      dummy.updateMatrix();
      glowInstanced.setMatrixAt(instanceIdx, dummy.matrix);

      instanceIdx++;
    }
  });

  waferInstanced.instanceMatrix.needsUpdate = true;
  waferInstanced.computeBoundingSphere();
  waferInstanced.castShadow = true;

  glowInstanced.instanceMatrix.needsUpdate = true;
  glowInstanced.computeBoundingSphere();

  group.add(waferInstanced, glowInstanced);

  const update = (elapsed: number, explodeFactor: number) => {
    // Subtle breathing glow on the ceramic electrolyte layers + central reformer rings
    const pulse = 0.88 + 0.22 * Math.sin(elapsed * 2.4);
    const visibilityBoost = 0.45 + 0.75 * explodeFactor;
    ceramicGlowMat.emissiveIntensity = 0.54 * pulse * visibilityBoost;
    coreRingMat.emissiveIntensity = 0.62 * (0.9 + 0.15 * Math.cos(elapsed * 3.1));
    copperBusMat.emissiveIntensity = 0.15 + 0.1 * Math.sin(elapsed * 3.0);
  };

  return { group, update };
}

export interface OxygenIonParticleSystem {
  points: THREE.Points;
  update: (elapsed: number, explodeFactor: number) => void;
}

/**
 * Glowing cyan (O²⁻) particles flowing upward and weaving horizontally
 * between the ceramic fuel cell stack layers.
 */
export function createOxygenIonParticles(
  glowTexture: THREE.Texture,
): OxygenIonParticleSystem {
  const count = 360;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  // Precomputed deterministic per-particle phase/column metadata (zero GC in loop)
  const stackOffsets: [number, number][] = [
    [-0.125, 0.105],
    [0.125, 0.105],
    [-0.125, -0.105],
    [0.125, -0.105],
  ];
  const particleMeta = new Float32Array(count * 5); // [stackIdx, speed, phase, radiusX, radiusZ]

  let seed = 9173;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  const c1 = new THREE.Color(0x00e5ff);
  const c2 = new THREE.Color(0xa5f3fc);
  const mixCol = new THREE.Color();

  for (let i = 0; i < count; i++) {
    const stackIdx = i % 4;
    const speed = 0.14 + rand() * 0.22;
    const phase = rand();
    const radiusX = 0.04 + rand() * 0.068;
    const radiusZ = 0.04 + rand() * 0.058;

    particleMeta[i * 5 + 0] = stackIdx;
    particleMeta[i * 5 + 1] = speed;
    particleMeta[i * 5 + 2] = phase;
    particleMeta[i * 5 + 3] = radiusX;
    particleMeta[i * 5 + 4] = radiusZ;

    mixCol.copy(c1).lerp(c2, rand());
    colors[i * 3 + 0] = mixCol.r;
    colors[i * 3 + 1] = mixCol.g;
    colors[i * 3 + 2] = mixCol.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.036,
    map: glowTexture,
    vertexColors: true,
    transparent: true,
    opacity: 0.92,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });

  const points = new THREE.Points(geometry, material);
  points.name = 'OxygenIonParticles';
  points.frustumCulled = false;

  const update = (elapsed: number, explodeFactor: number) => {
    const posAttr = geometry.getAttribute('position') as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const stackIdx = particleMeta[i * 5 + 0];
      const speed = particleMeta[i * 5 + 1];
      const phase = particleMeta[i * 5 + 2];
      const rx = particleMeta[i * 5 + 3];
      const rz = particleMeta[i * 5 + 4];

      const [cx, cz] = stackOffsets[stackIdx];
      const rawT = phase + elapsed * speed;
      const t = ((rawT % 1) + 1) % 1;

      // Vertical climb across ceramic stack layers (y: 0.15 -> 0.88)
      const y = 0.15 + t * 0.73;

      // Lateral serpentine weave through the ceramic gaps
      const angle = elapsed * 2.2 + phase * Math.PI * 6 + t * Math.PI * 4;
      const spread = 0.85 + 0.28 * explodeFactor;
      const x = cx + Math.cos(angle) * rx * spread;
      const z = cz + Math.sin(angle * 1.15) * rz * spread;

      arr[i * 3 + 0] = x;
      arr[i * 3 + 1] = y;
      arr[i * 3 + 2] = z;
    }

    material.opacity = 0.14 + 0.24 * Math.min(1, explodeFactor * 1.25);
    posAttr.needsUpdate = true;
  };

  // Initialize positions immediately
  update(0, 0.75);

  return { points, update };
}

export interface AmberCircuitAssembly {
  group: THREE.Group;
  update: (elapsed: number) => void;
}

/**
 * Builds external amber-gold clean electricity circuit lines & DC busbars
 * routing out from the fuel cell stack core to architectural grid terminals,
 * complete with animated glowing energy flow pulses (zero GC inside update).
 */
export function createAmberCircuitAssembly(): AmberCircuitAssembly {
  const group = new THREE.Group();
  group.name = 'AmberPowerCircuits';

  const conduitCasingMat = new THREE.MeshStandardMaterial({
    color: 0x161d27,
    metalness: 0.82,
    roughness: 0.32,
  });

  const amberLineMat = new THREE.MeshStandardMaterial({
    color: 0xfbbf24,
    emissive: 0xf59e0b,
    emissiveIntensity: 1.25,
    metalness: 0.35,
    roughness: 0.25,
  });

  const terminalMat = new THREE.MeshPhysicalMaterial({
    color: 0x1e293b,
    metalness: 0.85,
    roughness: 0.28,
    envMapIntensity: 1.3,
  });

  const pulseMat = new THREE.MeshStandardMaterial({
    color: 0xfef08a,
    emissive: 0xf59e0b,
    emissiveIntensity: 2.35,
    metalness: 0.1,
    roughness: 0.15,
  });

  // Define external power circuit curves exiting the central stack plinth to grid nodes
  const circuitSpecs: THREE.Vector3[][] = [
    // Front-right main DC bus output
    [
      new THREE.Vector3(0.21, 0.13, 0.12),
      new THREE.Vector3(0.27, 0.04, 0.24),
      new THREE.Vector3(0.46, 0.022, 0.42),
      new THREE.Vector3(0.82, 0.022, 0.56),
      new THREE.Vector3(1.12, 0.022, 0.56),
    ],
    // Front-left auxiliary DC bus output
    [
      new THREE.Vector3(-0.21, 0.13, 0.12),
      new THREE.Vector3(-0.27, 0.04, 0.24),
      new THREE.Vector3(-0.46, 0.022, 0.44),
      new THREE.Vector3(-0.84, 0.022, 0.56),
      new THREE.Vector3(-1.12, 0.022, 0.56),
    ],
    // Right lateral power trace
    [
      new THREE.Vector3(0.22, 0.28, -0.02),
      new THREE.Vector3(0.29, 0.06, -0.06),
      new THREE.Vector3(0.56, 0.02, -0.14),
      new THREE.Vector3(0.98, 0.02, -0.22),
      new THREE.Vector3(1.22, 0.02, -0.22),
    ],
    // Left lateral power trace
    [
      new THREE.Vector3(-0.22, 0.28, -0.02),
      new THREE.Vector3(-0.29, 0.06, -0.06),
      new THREE.Vector3(-0.56, 0.02, -0.14),
      new THREE.Vector3(-0.98, 0.02, -0.22),
      new THREE.Vector3(-1.22, 0.02, -0.22),
    ],
    // Front center inverter output rail
    [
      new THREE.Vector3(0.0, 0.12, 0.20),
      new THREE.Vector3(0.0, 0.032, 0.36),
      new THREE.Vector3(0.0, 0.02, 0.72),
      new THREE.Vector3(0.0, 0.02, 1.04),
    ],
  ];

  const curves = circuitSpecs.map((pts) => new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.16));

  // Build glowing amber-gold conduits + terminal node pads
  const padGeo = new THREE.BoxGeometry(0.11, 0.032, 0.085);
  const padGlowGeo = new THREE.BoxGeometry(0.065, 0.01, 0.045);

  curves.forEach((curve) => {
    const outerGeo = new THREE.TubeGeometry(curve, 44, 0.011, 8, false);
    const outerMesh = new THREE.Mesh(outerGeo, conduitCasingMat);
    group.add(outerMesh);

    const innerGeo = new THREE.TubeGeometry(curve, 44, 0.0055, 8, false);
    const innerMesh = new THREE.Mesh(innerGeo, amberLineMat);
    group.add(innerMesh);

    // End terminal node
    const endPt = curve.getPoint(1);
    const pad = new THREE.Mesh(padGeo, terminalMat);
    pad.position.set(endPt.x, 0.016, endPt.z);
    group.add(pad);

    const padGlow = new THREE.Mesh(padGlowGeo, amberLineMat);
    padGlow.position.set(endPt.x, 0.033, endPt.z);
    group.add(padGlow);
  });

  // Pre-sample curve LUTs (point + tangent) so per-frame animation does zero allocations
  const samplesPerCurve = 64;
  const pulsesPerCurve = 12;
  const totalPulses = curves.length * pulsesPerCurve;

  const lutPoints: THREE.Vector3[][] = curves.map((curve) => {
    const pts: THREE.Vector3[] = [];
    for (let s = 0; s <= samplesPerCurve; s++) {
      pts.push(curve.getPointAt(s / samplesPerCurve));
    }
    return pts;
  });

  const lutTangents: THREE.Vector3[][] = curves.map((curve) => {
    const tans: THREE.Vector3[] = [];
    for (let s = 0; s <= samplesPerCurve; s++) {
      tans.push(curve.getTangentAt(s / samplesPerCurve).normalize());
    }
    return tans;
  });

  const pulseGeo = new THREE.CapsuleGeometry(0.0075, 0.038, 4, 8);
  const pulseInstanced = new THREE.InstancedMesh(pulseGeo, pulseMat, totalPulses);
  pulseInstanced.frustumCulled = false;
  group.add(pulseInstanced);

  const update = (elapsed: number) => {
    amberLineMat.emissiveIntensity = 1.15 + 0.25 * Math.sin(elapsed * 2.8);

    let idx = 0;
    for (let c = 0; c < curves.length; c++) {
      const pts = lutPoints[c];
      const tans = lutTangents[c];
      const speed = 0.28 + (c % 2) * 0.06;

      for (let p = 0; p < pulsesPerCurve; p++) {
        const rawT = (p / pulsesPerCurve) + elapsed * speed;
        const t = ((rawT % 1) + 1) % 1;
        const fIdx = t * samplesPerCurve;
        const i0 = Math.max(0, Math.min(samplesPerCurve, Math.floor(fIdx)));
        const i1 = Math.max(0, Math.min(samplesPerCurve, i0 + 1));
        const frac = fIdx - i0;

        _tempVec.lerpVectors(pts[i0], pts[i1], frac);
        _tempTan.lerpVectors(tans[i0], tans[i1], frac).normalize();
        _tempQuat.setFromUnitVectors(_upAxis, _tempTan);

        // Smooth fade scale at start/end of circuit path
        const edgeFade = Math.sin(t * Math.PI);
        const s = 0.45 + 0.75 * edgeFade;
        _tempScale.set(s, s * 1.15, s);

        _tempMatrix.compose(_tempVec, _tempQuat, _tempScale);
        pulseInstanced.setMatrixAt(idx++, _tempMatrix);
      }
    }

    pulseInstanced.instanceMatrix.needsUpdate = true;
  };

  update(0);

  return { group, update };
}

/**
 * Builds precision dark-tech isometric grid lines and datum rings around y = 0.
 */
export function createTechGridFloor(): {
  group: THREE.Group;
  setTheme: (isDark: boolean) => void;
} {
  const group = new THREE.Group();
  group.name = 'TechIsometricFloorGrid';

  const gridHelper = new THREE.GridHelper(6.4, 28, 0x0e7490, 0x162233);
  gridHelper.position.y = 0.001;
  const gridMats = Array.isArray(gridHelper.material)
    ? gridHelper.material
    : [gridHelper.material];
  gridMats.forEach((m) => {
    m.transparent = true;
    m.opacity = 0.34;
    m.depthWrite = false;
  });
  group.add(gridHelper);

  // Inner cyan datum ring
  const innerRingGeo = new THREE.RingGeometry(0.56, 0.57, 64);
  innerRingGeo.rotateX(-Math.PI / 2);
  const innerRingMat = new THREE.MeshBasicMaterial({
    color: 0x00e5ff,
    transparent: true,
    opacity: 0.42,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const innerRing = new THREE.Mesh(innerRingGeo, innerRingMat);
  innerRing.position.y = 0.002;
  group.add(innerRing);

  // Outer amber-gold datum ring
  const outerRingGeo = new THREE.RingGeometry(0.86, 0.87, 72);
  outerRingGeo.rotateX(-Math.PI / 2);
  const outerRingMat = new THREE.MeshBasicMaterial({
    color: 0xf59e0b,
    transparent: true,
    opacity: 0.28,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
  outerRing.position.y = 0.002;
  group.add(outerRing);

  const setTheme = (isDark: boolean) => {
    gridMats.forEach((m) => {
      m.opacity = isDark ? 0.34 : 0.16;
    });
    innerRingMat.opacity = isDark ? 0.42 : 0.28;
    outerRingMat.opacity = isDark ? 0.28 : 0.22;
  };

  return { group, setTheme };
}
