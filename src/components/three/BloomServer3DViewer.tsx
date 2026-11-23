import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import {
  RotateCw,
  Pause,
  Play,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Layers,
} from 'lucide-react';
import {
  createBrushedMetalTextures,
  createContactShadowTexture,
  createGlowSpriteTexture,
  createProceduralSplitCabinet,
  createCutawayEdgeBulkhead,
  createFuelCellCoreGroup,
  createOxygenIonParticles,
  createAmberCircuitAssembly,
  createTechGridFloor,
} from './proceduralBloomServer';

type CameraPresetId = 'default' | 'ions' | 'circuit';

interface CameraPreset {
  id: Exclude<CameraPresetId, 'default'>;
  label: string;
  position: [number, number, number];
  target: [number, number, number];
}

const DEFAULT_CAMERA: {
  position: [number, number, number];
  target: [number, number, number];
} = {
  position: [2.05, 1.48, 2.25],
  target: [0, 0.46, 0],
};

const CAMERA_PRESETS: CameraPreset[] = [
  {
    id: 'ions',
    label: 'O²⁻ 이온 흐름',
    position: [-1.08, 0.68, 1.3],
    target: [0, 0.48, 0],
  },
  {
    id: 'circuit',
    label: '청정 전력 회로',
    position: [1.55, 0.92, 1.72],
    target: [0, 0.25, 0.1],
  },
];

// Reusable module-scope math helpers (zero GC inside animation loop)
const _desiredPos = new THREE.Vector3();
const _desiredTarget = new THREE.Vector3();
const _box = new THREE.Box3();
const _center = new THREE.Vector3();
const _size = new THREE.Vector3();

interface BloomServer3DViewerProps {
  className?: string;
}

export const BloomServer3DViewer: React.FC<BloomServer3DViewerProps> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  const [activePreset, setActivePreset] = useState<CameraPresetId>('default');
  const [explodePercent, setExplodePercent] = useState<number>(78);
  const [flowPlaying, setFlowPlaying] = useState<boolean>(true);
  const [autoRotate, setAutoRotate] = useState<boolean>(false);
  const [dockCollapsed, setDockCollapsed] = useState<boolean>(false);
  const [loadState, setLoadState] = useState<{
    status: 'loading' | 'loaded' | 'fallback';
    progress: number;
  }>({ status: 'loading', progress: 0 });

  // Mutable refs accessed by the WebGL loop without recreating WebGL context
  const targetExplodeRef = useRef<number>(explodePercent / 100);
  const flowPlayingRef = useRef<boolean>(flowPlaying);
  const autoRotateRef = useRef<boolean>(autoRotate);
  const transitionRef = useRef<{
    active: boolean;
    pos: THREE.Vector3;
    target: THREE.Vector3;
  }>({
    active: false,
    pos: new THREE.Vector3(...DEFAULT_CAMERA.position),
    target: new THREE.Vector3(...DEFAULT_CAMERA.target),
  });
  const requestRenderCallbackRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    targetExplodeRef.current = explodePercent / 100;
    requestRenderCallbackRef.current?.();
  }, [explodePercent]);

  useEffect(() => {
    flowPlayingRef.current = flowPlaying;
    requestRenderCallbackRef.current?.();
  }, [flowPlaying]);

  useEffect(() => {
    autoRotateRef.current = autoRotate;
    requestRenderCallbackRef.current?.();
  }, [autoRotate]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Software WebGL detection from GPU renderer string
    const isSoftwareGl = (() => {
      try {
        const probe = document.createElement('canvas');
        const gl = probe.getContext('webgl2') || probe.getContext('webgl');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param) || '');
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    const initialWidth = Math.max(container.clientWidth, 320);
    const initialHeight = Math.max(container.clientHeight, 180);

    // 2. Renderer setup with local clipping enabled for exploded housing halves
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.localClippingEnabled = true;
    const pixelRatio = isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2);
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(initialWidth, initialHeight);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.outline = 'none';
    container.appendChild(renderer.domElement);

    // 3. Scene, Dark-Tech #0B0F14 Canvas & Studio Environment IBL
    const scene = new THREE.Scene();
    const darkBgHex = 0x0b0f14;
    scene.background = new THREE.Color(darkBgHex);
    scene.fog = new THREE.Fog(darkBgHex, 6.2, 14.5);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;
    pmremGenerator.dispose();

    // Narrower 30deg FOV gives clean isometric-style technical projection
    const camera = new THREE.PerspectiveCamera(30, initialWidth / initialHeight, 0.08, 45);
    camera.position.set(...DEFAULT_CAMERA.position);

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(...DEFAULT_CAMERA.target);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.enablePan = false;
    controls.minDistance = 1.05;
    controls.maxDistance = 4.6;
    controls.minPolarAngle = 0.2;
    controls.maxPolarAngle = Math.PI / 2 - 0.04;
    controls.autoRotate = !isSoftwareGl && autoRotateRef.current;
    controls.autoRotateSpeed = 0.85;
    controls.update();

    // 5. Studio Rim Lighting Rig + Softboxes
    const hemiLight = new THREE.HemisphereLight(0xcfe8ff, 0x0f172a, 0.72);
    hemiLight.position.set(0, 6, 0);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff7ed, 1.85);
    keyLight.position.set(2.8, 4.4, 2.8);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 12;
    const d = 1.65;
    keyLight.shadow.camera.left = -d;
    keyLight.shadow.camera.right = d;
    keyLight.shadow.camera.top = d;
    keyLight.shadow.camera.bottom = -d;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x94a3b8, 0.85);
    fillLight.position.set(-3.2, 2.2, 1.8);
    scene.add(fillLight);

    // Cyan climate-tech rim light (left-rear edge)
    const cyanRimLight = new THREE.DirectionalLight(0x00e5ff, 1.55);
    cyanRimLight.position.set(-2.4, 2.5, -2.3);
    scene.add(cyanRimLight);

    // Amber-gold energy rim light (right-rear edge)
    const amberRimLight = new THREE.DirectionalLight(0xf59e0b, 1.1);
    amberRimLight.position.set(2.5, 1.8, -2.1);
    scene.add(amberRimLight);

    // Internal ceramic core point light illuminating the opened shell interiors
    const corePointLight = new THREE.PointLight(0x00e5ff, 1.4, 2.4, 1.6);
    corePointLight.position.set(0, 0.52, 0.05);
    scene.add(corePointLight);

    if (!isSoftwareGl) {
      RectAreaLightUniformsLib.init();
      const topSoftbox = new THREE.RectAreaLight(0xffffff, 2.0, 2.6, 2.6);
      topSoftbox.position.set(0, 3.2, 0.3);
      topSoftbox.lookAt(0, 0.45, 0);
      scene.add(topSoftbox);

      const frontSoftbox = new THREE.RectAreaLight(0xdbeafe, 1.35, 1.6, 2.0);
      frontSoftbox.position.set(-2.2, 1.2, 1.5);
      frontSoftbox.lookAt(0, 0.5, 0);
      scene.add(frontSoftbox);
    }

    // 6. Textures & Isometric Grid Floor
    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const { roughnessMap, bumpMap } = createBrushedMetalTextures(maxAniso);
    const contactShadowTex = createContactShadowTexture();
    const glowSpriteTex = createGlowSpriteTexture();

    const floorGeo = new THREE.CircleGeometry(4.4, 64);
    floorGeo.rotateX(-Math.PI / 2);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x0e141c,
      metalness: 0.25,
      roughness: 0.72,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.position.y = -0.002;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    const shadowGeo = new THREE.PlaneGeometry(1.75, 1.55);
    shadowGeo.rotateX(-Math.PI / 2);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: contactShadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.85,
    });
    const contactShadow = new THREE.Mesh(shadowGeo, shadowMat);
    contactShadow.position.y = 0.002;
    scene.add(contactShadow);

    const techGrid = createTechGridFloor();
    techGrid.setTheme(true);
    scene.add(techGrid.group);

    // 7. Central Exploded-View Assembly:
    //    - Internal Ceramic Fuel Cell Stack Core
    //    - Cyan O2- Particle Stream
    //    - Amber-Gold External Power Circuits
    //    - Outer Split Brushed Steel Housing (Procedural fallback -> Upgraded GLB halves)
    const modelRoot = new THREE.Group();
    scene.add(modelRoot);

    const fuelCellCore = createFuelCellCoreGroup(roughnessMap, bumpMap);
    modelRoot.add(fuelCellCore.group);

    const oxygenParticles = createOxygenIonParticles(glowSpriteTex);
    modelRoot.add(oxygenParticles.points);

    const amberCircuits = createAmberCircuitAssembly();
    modelRoot.add(amberCircuits.group);

    // Procedural split cabinet visible immediately while GLB streams
    const proceduralCabinet = createProceduralSplitCabinet(roughnessMap, bumpMap);
    modelRoot.add(proceduralCabinet.group);

    // Dynamic world-space clipping planes for split GLB outer housing
    const leftClipPlane = new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0);
    const rightClipPlane = new THREE.Plane(new THREE.Vector3(1, 0, 0), 0);

    let glbLeftGroup: THREE.Group | null = null;
    let glbRightGroup: THREE.Group | null = null;
    let glbLeftBulkhead: THREE.Group | null = null;
    let glbRightBulkhead: THREE.Group | null = null;
    let proceduralActive = true;

    // 8. GPU-Only Postprocessing (UnrealBloomPass for cyan O2- & amber-gold lines)
    let composer: EffectComposer | null = null;
    let bloomPass: UnrealBloomPass | null = null;
    if (!isSoftwareGl) {
      composer = new EffectComposer(renderer);
      const renderPass = new RenderPass(scene, camera);
      bloomPass = new UnrealBloomPass(
        new THREE.Vector2(initialWidth, initialHeight),
        0.14, // subtle low-glare bloom so ceramic details stay sharp
        0.4,
        0.86,
      );
      const outputPass = new OutputPass();
      composer.addPass(renderPass);
      composer.addPass(bloomPass);
      composer.addPass(outputPass);
    }

    let isDisposed = false;
    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // 9. Animation Loop (continuous for particles & circuit pulses when flowPlaying=true,
    //    software-GL safe fenceSync + 80ms cooldown)
    let frameId = 0;
    let renderBusy = false;
    let renderDirty = false;
    let lastTime = performance.now();
    let simElapsed = 0;
    let currentExplode = targetExplodeRef.current;

    const applyExplodeOffset = (explodeVal: number) => {
      const offset = explodeVal * 0.48;

      if (proceduralActive) {
        proceduralCabinet.leftHalf.position.x = -offset;
        proceduralCabinet.rightHalf.position.x = offset;
      }

      if (glbLeftGroup && glbRightGroup) {
        glbLeftGroup.position.x = -offset;
        glbRightGroup.position.x = offset;
        leftClipPlane.constant = -offset;
        rightClipPlane.constant = -offset;
        const showBulkhead = explodeVal > 0.025;
        if (glbLeftBulkhead) glbLeftBulkhead.visible = showBulkhead;
        if (glbRightBulkhead) glbRightBulkhead.visible = showBulkhead;
      }

      // Scale contact shadow width slightly as doors split apart
      contactShadow.scale.set(1 + explodeVal * 0.52, 1, 1);
      corePointLight.intensity = 0.09 + explodeVal * 0.54;
    };

    applyExplodeOffset(currentExplode);

    function afterDraw(cb: () => void) {
      if (isDisposed) return;
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (gl && typeof gl.fenceSync === 'function') {
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.flush();
        const poll = () => {
          if (isDisposed) {
            if (sync) gl.deleteSync(sync);
            return;
          }
          const state = sync ? gl.getSyncParameter(sync, gl.SYNC_STATUS) : gl.SIGNALED;
          if (state === gl.UNSIGNALED) {
            frameId = window.setTimeout(poll, 5);
          } else {
            if (sync) gl.deleteSync(sync);
            frameId = window.setTimeout(cb, 80);
          }
        };
        frameId = window.setTimeout(poll, 5);
      } else {
        frameId = window.setTimeout(cb, 80);
      }
    }

    function stepAndRender(now: number) {
      const dt = Math.max(0, Math.min((now - lastTime) / 1000, 0.1));
      lastTime = now;

      let needsMoreFrames = false;

      // Damped Exploded View opening/closing
      if (Math.abs(currentExplode - targetExplodeRef.current) > 0.002) {
        currentExplode = THREE.MathUtils.damp(currentExplode, targetExplodeRef.current, 6.5, dt);
        applyExplodeOffset(currentExplode);
        needsMoreFrames = true;
      } else if (currentExplode !== targetExplodeRef.current) {
        currentExplode = targetExplodeRef.current;
        applyExplodeOffset(currentExplode);
      }

      // Advance simulation clock for O2- particles, ceramic glow & amber circuit energy lines
      if (flowPlayingRef.current) {
        simElapsed += dt;
        fuelCellCore.update(simElapsed, currentExplode);
        oxygenParticles.update(simElapsed, currentExplode);
        amberCircuits.update(simElapsed);
        needsMoreFrames = true;
      } else {
        fuelCellCore.update(simElapsed, currentExplode);
        oxygenParticles.update(simElapsed, currentExplode);
      }

      // Exponentially damped camera preset transitions
      if (transitionRef.current.active) {
        _desiredPos.copy(transitionRef.current.pos);
        _desiredTarget.copy(transitionRef.current.target);
        camera.position.x = THREE.MathUtils.damp(camera.position.x, _desiredPos.x, 7, dt);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, _desiredPos.y, 7, dt);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, _desiredPos.z, 7, dt);
        controls.target.x = THREE.MathUtils.damp(controls.target.x, _desiredTarget.x, 7, dt);
        controls.target.y = THREE.MathUtils.damp(controls.target.y, _desiredTarget.y, 7, dt);
        controls.target.z = THREE.MathUtils.damp(controls.target.z, _desiredTarget.z, 7, dt);

        if (
          camera.position.distanceTo(_desiredPos) < 0.008 &&
          controls.target.distanceTo(_desiredTarget) < 0.008
        ) {
          camera.position.copy(_desiredPos);
          controls.target.copy(_desiredTarget);
          transitionRef.current.active = false;
        } else {
          needsMoreFrames = true;
        }
      }

      controls.autoRotate = !isSoftwareGl && autoRotateRef.current && !transitionRef.current.active;
      const controlsMoved = controls.update();
      if (controls.autoRotate || controlsMoved) {
        needsMoreFrames = true;
      }

      if (composer) {
        composer.render();
      } else {
        renderer.render(scene, camera);
      }
      return needsMoreFrames;
    }

    function requestRender() {
      if (isDisposed) return;
      if (renderBusy) {
        renderDirty = true;
        return;
      }
      renderBusy = true;
      frameId = requestAnimationFrame((now) => {
        if (isDisposed) return;
        renderDirty = false;
        const keepAnimating = stepAndRender(now);
        const done = () => {
          renderBusy = false;
          if (!isDisposed && (renderDirty || keepAnimating)) {
            requestRender();
          }
        };
        if (isSoftwareGl) afterDraw(done);
        else done();
      });
    }

    requestRenderCallbackRef.current = requestRender;

    const onControlsStart = () => {
      transitionRef.current.active = false;
    };
    const onControlsChange = () => {
      requestRender();
    };
    controls.addEventListener('start', onControlsStart);
    controls.addEventListener('change', onControlsChange);

    requestRender();

    // 10. Load user-provided GLB and slice cleanly into Left & Right Split Housing Halves
    const gltfLoader = new GLTFLoader();
    gltfLoader.load(
      '/models/bloomenergy_machine_3d_model.glb',
      (gltf) => {
        if (isDisposed) return;
        const rawScene = gltf.scene;

        // Normalize scale & center bottom flush on y = 0
        _box.setFromObject(rawScene);
        _box.getSize(_size);
        const maxDim = Math.max(_size.x, _size.y, _size.z) || 1;
        const targetHeight = 1.05;
        const scaleFactor = targetHeight / (_size.y || maxDim);
        rawScene.scale.setScalar(scaleFactor);

        rawScene.updateMatrixWorld(true);
        _box.setFromObject(rawScene);
        _box.getCenter(_center);
        rawScene.position.set(-_center.x, -_box.min.y, -_center.z);

        // Build Left & Right cloned housing halves sharing geometry while isolating clipping planes
        const leftClone = rawScene.clone(true);
        const rightClone = rawScene.clone(true);

        const configureHalf = (halfScene: THREE.Object3D, clipPlane: THREE.Plane) => {
          halfScene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh;
              mesh.castShadow = !isSoftwareGl;
              mesh.receiveShadow = !isSoftwareGl;

              const oldMat = mesh.material as THREE.MeshStandardMaterial | undefined;
              const baseMap = oldMat?.map ?? null;
              if (baseMap) {
                baseMap.colorSpace = THREE.SRGBColorSpace;
                baseMap.anisotropy = maxAniso;
              }
              if (mesh.geometry) {
                mesh.geometry.computeVertexNormals();
              }

              mesh.material = new THREE.MeshPhysicalMaterial({
                map: baseMap,
                color: baseMap ? 0xffffff : 0x242b33,
                metalness: 0.72,
                roughness: 0.42,
                roughnessMap,
                bumpMap,
                bumpScale: 0.0022,
                anisotropy: 0.65,
                anisotropyRotation: Math.PI / 2,
                envMapIntensity: 1.35,
                clearcoat: 0.08,
                clearcoatRoughness: 0.52,
                side: THREE.DoubleSide,
                clippingPlanes: [clipPlane],
                clipShadows: true,
              });
            }
          });
        };

        configureHalf(leftClone, leftClipPlane);
        configureHalf(rightClone, rightClipPlane);

        glbLeftGroup = new THREE.Group();
        glbLeftGroup.name = 'GlbLeftHousing';
        glbLeftBulkhead = createCutawayEdgeBulkhead('left');
        glbLeftGroup.add(leftClone, glbLeftBulkhead);

        glbRightGroup = new THREE.Group();
        glbRightGroup.name = 'GlbRightHousing';
        glbRightBulkhead = createCutawayEdgeBulkhead('right');
        glbRightGroup.add(rightClone, glbRightBulkhead);

        // Dispose procedural outer housing cleanly while keeping internal stacks/particles/circuits
        proceduralActive = false;
        modelRoot.remove(proceduralCabinet.group);
        proceduralCabinet.group.traverse((obj) => {
          if ((obj as THREE.Mesh).isMesh) {
            const m = obj as THREE.Mesh;
            m.geometry?.dispose();
            if (Array.isArray(m.material)) m.material.forEach((mat) => mat.dispose());
            else m.material?.dispose();
          }
        });

        modelRoot.add(glbLeftGroup, glbRightGroup);
        applyExplodeOffset(currentExplode);

        setLoadState({ status: 'loaded', progress: 100 });
        requestRender();
      },
      (xhr) => {
        if (isDisposed) return;
        if (xhr.lengthComputable && xhr.total > 0) {
          const pct = Math.min(99, Math.round((xhr.loaded / xhr.total) * 100));
          setLoadState({ status: 'loading', progress: pct });
        }
      },
      () => {
        if (isDisposed) return;
        setLoadState({ status: 'fallback', progress: 100 });
        requestRender();
      },
    );

    // 11. ResizeObserver keeping 16:9 viewport & postprocessing crisp
    const resizeObserver = new ResizeObserver((entries) => {
      if (isDisposed) return;
      for (const entry of entries) {
        const w = Math.max(entry.contentRect.width, 200);
        const h = Math.max(entry.contentRect.height, 140);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        if (composer) {
          composer.setPixelRatio(pixelRatio);
          composer.setSize(w, h);
        }
        if (bloomPass) {
          bloomPass.resolution.set(w, h);
        }
        requestRender();
      }
    });
    resizeObserver.observe(container);

    // 12. Full GPU disposal on unmount
    return () => {
      isDisposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver.disconnect();
      controls.removeEventListener('start', onControlsStart);
      controls.removeEventListener('change', onControlsChange);
      controls.dispose();

      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh;
          mesh.geometry?.dispose();
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((m) => m.dispose());
          } else {
            mesh.material?.dispose();
          }
        } else if ((obj as THREE.Points).isPoints) {
          const pts = obj as THREE.Points;
          pts.geometry?.dispose();
          if (Array.isArray(pts.material)) {
            pts.material.forEach((m) => m.dispose());
          } else {
            pts.material?.dispose();
          }
        }
      });

      bloomPass?.dispose();
      composer?.dispose();
      roughnessMap.dispose();
      bumpMap.dispose();
      contactShadowTex.dispose();
      glowSpriteTex.dispose();
      envTexture.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const handleSelectPreset = (preset: CameraPreset) => {
    setActivePreset(preset.id);
    transitionRef.current.pos.set(...preset.position);
    transitionRef.current.target.set(...preset.target);
    transitionRef.current.active = true;
    requestRenderCallbackRef.current?.();
  };

  const handleResetView = () => {
    setActivePreset('default');
    transitionRef.current.pos.set(...DEFAULT_CAMERA.position);
    transitionRef.current.target.set(...DEFAULT_CAMERA.target);
    transitionRef.current.active = true;
    setExplodePercent(78);
    setFlowPlaying(true);
    setAutoRotate(false);
    requestRenderCallbackRef.current?.();
  };

  const isExploded = explodePercent > 20;

  return (
    <div
      className={`relative w-full aspect-video min-h-[300px] rounded-2xl overflow-hidden border border-cyan-500/25 bg-[#0B0F14] shadow-xl select-none ${className}`}
    >
      {/* Isolated WebGL Mount Container */}
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        aria-label="블룸 에너지 서버 3D 아이소메트릭 분해 단면 인터랙티브 뷰포트"
      />

      {/* Precision Climate-Tech HUD Corner Lines & Infographic SVG Overlay (pointer-events-none, non-occluding) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1600 900"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {/* Subtle technical corner brackets */}
        <path
          d="M 28 64 L 28 28 L 76 28"
          fill="none"
          stroke="#00E5FF"
          strokeOpacity="0.45"
          strokeWidth="2"
        />
        <path
          d="M 1524 28 L 1572 28 L 1572 64"
          fill="none"
          stroke="#00E5FF"
          strokeOpacity="0.45"
          strokeWidth="2"
        />
        <path
          d="M 28 836 L 28 872 L 76 872"
          fill="none"
          stroke="#F59E0B"
          strokeOpacity="0.4"
          strokeWidth="2"
        />
        <path
          d="M 1524 872 L 1572 872 L 1572 836"
          fill="none"
          stroke="#F59E0B"
          strokeOpacity="0.4"
          strokeWidth="2"
        />

        {/* Hairline leader callouts anchored cleanly to outer perimeter */}
        <polyline
          points="330,122 415,122 465,172"
          fill="none"
          stroke="#00E5FF"
          strokeOpacity="0.38"
          strokeWidth="1.4"
          strokeDasharray="4 4"
        />
        <circle
          cx="465"
          cy="172"
          r="3.5"
          fill="#00E5FF"
          fillOpacity="0.7"
        />

        <polyline
          points="1320,765 1235,765 1175,705"
          fill="none"
          stroke="#F59E0B"
          strokeOpacity="0.42"
          strokeWidth="1.4"
          strokeDasharray="4 4"
        />
        <circle
          cx="1175"
          cy="705"
          r="3.5"
          fill="#F59E0B"
          fillOpacity="0.75"
        />
      </svg>

      {/* Top-Left Architectural Readout (No backdrop-filter, static crisp typography) */}
      <div className="absolute top-3.5 left-3.5 sm:top-4 sm:left-4 pointer-events-none">
        <div className="px-3 py-2 rounded-lg border bg-[#0B0F14]/90 border-cyan-400/25 text-white">
          <div className="text-[10px] sm:text-[11px] font-bold tracking-wider text-[#00E5FF]">
            SOFC 모듈 · 3D 분해 단면 일러스트
          </div>
          <div className="text-[11px] sm:text-xs font-semibold mt-0.5 text-slate-200">
            세라믹 연료전지 스택 · 이온 이동 및 DC 출력
          </div>
          {loadState.status === 'loading' && (
            <div className="text-[10px] mt-1 font-mono tabular-nums text-slate-400">
              외장 3D 에셋 불러오는 중 ({loadState.progress}%)
            </div>
          )}
        </div>
      </div>

      {/* Top-Right Compact Telemetry Strip */}
      <div className="hidden sm:flex absolute top-4 right-4 items-center gap-3 pointer-events-none">
        <div className="px-3 py-1.5 rounded-lg border flex items-center gap-3 text-[11px] font-mono tabular-nums bg-[#0B0F14]/90 border-white/15 text-slate-300">
          <div>
            <span className="text-slate-400">반응 온도 </span>
            <span className="text-white font-bold">800°C</span>
          </div>
          <span className="opacity-25">|</span>
          <div>
            <span className="text-slate-400">발전 효율 </span>
            <span className="text-[#8CC63F] font-bold">60%+</span>
          </div>
        </div>
      </div>

      {/* Side Minimal Data Legend (Bottom-Left & Bottom-Right corners, clear of center & dock) */}
      <div className="hidden md:flex absolute bottom-16 left-4 items-center gap-2 pointer-events-none">
        <div className="px-2.5 py-1.5 rounded-lg border text-[11px] flex items-center gap-2 bg-[#0B0F14]/90 border-cyan-400/25 text-slate-200">
          <span className="w-2.5 h-2.5 rounded-xs bg-[#00E5FF] shrink-0" />
          <span className="font-semibold">산소 이온(O²⁻) 세라믹 층 투과</span>
        </div>
      </div>

      <div className="hidden md:flex absolute bottom-16 right-4 items-center gap-2 pointer-events-none">
        <div className="px-2.5 py-1.5 rounded-lg border text-[11px] flex items-center gap-2 bg-[#0B0F14]/90 border-amber-400/30 text-slate-200">
          <span className="w-2.5 h-2.5 rounded-xs bg-[#F59E0B] shrink-0" />
          <span className="font-semibold">청정 전력(DC) 외부 회로 출력</span>
        </div>
      </div>

      {/* Collapsible Bottom Control Dock (Zero Viewport Occlusion, no backdrop-filter) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex flex-col items-center max-w-[96%] z-10">
        <button
          type="button"
          onClick={() => setDockCollapsed((v) => !v)}
          className="mb-1.5 px-3 py-1 rounded-md text-[11px] font-semibold border transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap bg-[#0B0F14]/95 border-white/15 text-slate-200 hover:text-white"
        >
          {dockCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5" />
              <span>컨트롤 보기</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5" />
              <span>컨트롤 숨기기</span>
            </>
          )}
        </button>

        {!dockCollapsed && (
          <div className="flex flex-wrap items-center justify-center gap-1.5 px-3 py-2 rounded-xl border shadow-lg bg-[#0B0F14]/95 border-white/15 text-slate-200">
            {/* Exploded View Quick Toggle + Range Slider */}
            <div className="flex items-center gap-2 pr-1">
              <button
                type="button"
                onClick={() => setExplodePercent(isExploded ? 0 : 78)}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors whitespace-nowrap cursor-pointer ${
                  isExploded
                    ? 'bg-[#00E5FF] text-[#0B0F14]'
                    : 'bg-white/10 text-slate-200 hover:bg-white/15'
                }`}
              >
                <Layers className="w-3 h-3" />
                <span>{isExploded ? '분해 뷰' : '조립 뷰'}</span>
              </button>

              <label className="flex items-center gap-1.5 text-[11px] font-mono tabular-nums cursor-pointer">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={explodePercent}
                  onChange={(e) => setExplodePercent(Number(e.target.value))}
                  aria-label="캐비닛 분해 정도"
                  className="w-16 sm:w-20 accent-[#00E5FF] cursor-pointer"
                />
                <span className="w-8 text-right">{explodePercent}%</span>
              </label>
            </div>

            <div className="h-4 w-px mx-0.5 bg-white/15" aria-hidden="true" />

            {/* Camera Angle Presets */}
            <div className="flex flex-wrap items-center justify-center gap-1">
              {CAMERA_PRESETS.map((preset) => {
                const isSelected = activePreset === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`px-2 py-1.5 rounded-lg text-[11px] font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                      isSelected
                        ? 'bg-[#8CC63F] text-[#0B0F14]'
                        : 'hover:bg-white/10 text-slate-300'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>

            <div className="h-4 w-px mx-0.5 bg-white/15" aria-hidden="true" />

            {/* Energy Flow Play/Pause */}
            <button
              type="button"
              onClick={() => setFlowPlaying((p) => !p)}
              className={`px-2 py-1.5 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors whitespace-nowrap cursor-pointer ${
                flowPlaying
                  ? 'bg-white/12 text-[#00E5FF]'
                  : 'hover:bg-white/10 text-slate-300'
              }`}
              title="이온 및 전력 흐름 애니메이션 전환"
            >
              {flowPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              <span>{flowPlaying ? '흐름 정지' : '흐름 재생'}</span>
            </button>

            {/* Auto-Rotate Toggle */}
            <button
              type="button"
              onClick={() => setAutoRotate((r) => !r)}
              className={`px-2 py-1.5 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors whitespace-nowrap cursor-pointer ${
                autoRotate
                  ? 'bg-white/12 text-[#8CC63F]'
                  : 'hover:bg-white/10 text-slate-300'
              }`}
            >
              <RotateCw className="w-3 h-3" />
              <span>회전</span>
            </button>

            {/* Reset View */}
            <button
              type="button"
              onClick={handleResetView}
              className="p-1.5 rounded-lg transition-colors cursor-pointer hover:bg-white/10 text-slate-300"
              aria-label="시점 초기화"
              title="시점 초기화"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
