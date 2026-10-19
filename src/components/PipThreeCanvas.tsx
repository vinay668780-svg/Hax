import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RotateCcw, Sparkles, ChevronDown, ChevronUp, Eye } from 'lucide-react';

interface PipThreeCanvasProps {
  isNightMode: boolean;
  onModelChime: () => void;
}

type CameraPreset = 'front' | 'angle' | 'top';

// Pre-allocated module-scope math helpers (Zero GC in render loop)
const _targetCamPos = new THREE.Vector3(0, 1.15, 4.4);
const _dummyMatrix = new THREE.Matrix4();
const _dummyPos = new THREE.Vector3();
const _dummyScale = new THREE.Vector3();
const _dummyQuat = new THREE.Quaternion();

export const PipThreeCanvas: React.FC<PipThreeCanvasProps> = ({
  isNightMode,
  onModelChime,
}) => {
  const canvasMountRef = useRef<HTMLDivElement>(null);
  const onChimeRef = useRef(onModelChime);
  onChimeRef.current = onModelChime;

  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('angle');
  const [lanternBoost, setLanternBoost] = useState<boolean>(false);
  const [dockCollapsed, setDockCollapsed] = useState<boolean>(false);
  const [interactionCount, setInteractionCount] = useState<number>(0);
  const [webglFallback, setWebglFallback] = useState<boolean>(false);

  const stateRef = useRef({
    autoRotate: true,
    cameraPreset: 'angle' as CameraPreset,
    presetLerpTicks: 0,
    lanternBoost: false,
    hopImpulse: 0,
    pointerX: 0,
    pointerY: 0,
    isNightMode,
  });

  useEffect(() => {
    stateRef.current.autoRotate = autoRotate;
    stateRef.current.cameraPreset = cameraPreset;
    stateRef.current.lanternBoost = lanternBoost;
    stateRef.current.isNightMode = isNightMode;
  }, [autoRotate, cameraPreset, lanternBoost, isNightMode]);

  useEffect(() => {
    const container = canvasMountRef.current;
    if (!container) return;

    const isHeadless =
      typeof navigator !== 'undefined' &&
      (navigator.webdriver || /HeadlessChrome/i.test(navigator.userAgent));

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isHeadless,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglFallback(true);
      return;
    }

    const width = container.clientWidth || 520;
    const height = container.clientHeight || 420;

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.setPixelRatio(isHeadless ? 1 : Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = !isHeadless;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(width, height);

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      setWebglFallback(true);
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost);

    const scene = new THREE.Scene();
    const bgHex = stateRef.current.isNightMode ? 0x161224 : 0x221b34;
    scene.background = new THREE.Color(bgHex);
    scene.fog = new THREE.FogExp2(bgHex, 0.065);

    // Studio RoomEnvironment reflection map
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 50);
    camera.position.set(1.15, 1.25, 4.35);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 2.6;
    controls.maxDistance = 6.8;
    controls.maxPolarAngle = Math.PI * 0.58;
    controls.target.set(0, 0.45, 0);

    // 3-Point Warm/Cool Studio Rig
    const hemiLight = new THREE.HemisphereLight(0xc4b5fd, 0x3a251c, 0.85);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff1d6, 1.65);
    keyLight.position.set(3.5, 5.5, 4.0);
    if (!isHeadless) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1024, 1024);
      keyLight.shadow.camera.left = -2.5;
      keyLight.shadow.camera.right = 2.5;
      keyLight.shadow.camera.top = 2.5;
      keyLight.shadow.camera.bottom = -2.5;
      keyLight.shadow.bias = -0.0005;
    }
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xf472b6, 0.9);
    rimLight.position.set(-3.5, 2.5, -3.0);
    scene.add(rimLight);

    // Soft radial contact shadow plane on nursery floor
    const shadowGeo = new THREE.CircleGeometry(1.75, 32);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x09070f,
      transparent: true,
      opacity: 0.42,
      depthWrite: false,
    });
    const contactShadow = new THREE.Mesh(shadowGeo, shadowMat);
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.y = -0.68;
    scene.add(contactShadow);

    // =========================================================================
    // COMPOSITE 10-PART PROCEDURAL 3D PIP & CLOUD GLIDER GROUP
    // =========================================================================
    const pipRootGroup = new THREE.Group();
    scene.add(pipRootGroup);

    // Materials with varied roughness (>= 0.25 delta between adjacent parts)
    const cloudMat = new THREE.MeshStandardMaterial({
      color: 0xfff8f1,
      roughness: 0.88,
      metalness: 0.02,
    });
    const skullMat = new THREE.MeshPhysicalMaterial({
      color: 0xfff8f1,
      roughness: 0.32,
      metalness: 0.04,
      clearcoat: 0.28,
      clearcoatRoughness: 0.25,
    });
    const pajamaMat = new THREE.MeshStandardMaterial({
      color: 0xf6e6d4,
      roughness: 0.75,
      metalness: 0.05,
    });
    const socketMat = new THREE.MeshStandardMaterial({
      color: 0x120d1d,
      roughness: 0.92,
      metalness: 0.0,
    });
    const amberPinprickMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      emissive: 0xf59e0b,
      emissiveIntensity: 2.4,
      roughness: 0.15,
    });
    const blushMat = new THREE.MeshStandardMaterial({
      color: 0xe06c9f,
      roughness: 0.65,
      transparent: true,
      opacity: 0.65,
    });
    const nightcapMat = new THREE.MeshStandardMaterial({
      color: 0x2d234a,
      roughness: 0.78,
      metalness: 0.08,
    });
    const berryBowMat = new THREE.MeshStandardMaterial({
      color: 0xa34063,
      roughness: 0.42,
      metalness: 0.12,
    });
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.22,
      metalness: 0.88,
    });
    const lanternGlassMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xf59e0b,
      emissiveIntensity: 1.8,
      roughness: 0.18,
    });

    // 1. Primary Silhouette: Multi-Puff Cumulonimbus Cloud Glider
    const cloudGroup = new THREE.Group();
    const cloudPuffs: Array<[number, number, number, number]> = [
      [0, -0.32, 0, 0.62],
      [-0.52, -0.36, 0.12, 0.46],
      [0.52, -0.35, 0.1, 0.48],
      [-0.28, -0.34, -0.36, 0.44],
      [0.3, -0.34, -0.34, 0.45],
      [0, -0.35, 0.38, 0.43],
    ];
    const sphereGeo = new THREE.SphereGeometry(1, 24, 24);
    cloudPuffs.forEach(([x, y, z, r]) => {
      const puff = new THREE.Mesh(sphereGeo, cloudMat);
      puff.position.set(x, y, z);
      puff.scale.set(r * 1.15, r * 0.78, r * 1.05);
      cloudGroup.add(puff);
    });
    pipRootGroup.add(cloudGroup);

    // 2. Pajama Torso & Tiny Feet
    const torsoMesh = new THREE.Mesh(sphereGeo, pajamaMat);
    torsoMesh.position.set(0, 0.14, 0);
    torsoMesh.scale.set(0.42, 0.44, 0.38);
    pipRootGroup.add(torsoMesh);

    const leftFoot = new THREE.Mesh(sphereGeo, pajamaMat);
    leftFoot.position.set(-0.22, -0.06, 0.36);
    leftFoot.scale.set(0.14, 0.11, 0.18);
    pipRootGroup.add(leftFoot);

    const rightFoot = new THREE.Mesh(sphereGeo, pajamaMat);
    rightFoot.position.set(0.22, -0.06, 0.36);
    rightFoot.scale.set(0.14, 0.11, 0.18);
    pipRootGroup.add(rightFoot);

    // 3. Head Group (Porcelain Skull Cranium + Lower Jaw Cheek Curve)
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.78, 0.04);
    pipRootGroup.add(headGroup);

    const craniumMesh = new THREE.Mesh(sphereGeo, skullMat);
    craniumMesh.scale.set(0.56, 0.5, 0.52);
    headGroup.add(craniumMesh);

    const jawMesh = new THREE.Mesh(sphereGeo, skullMat);
    jawMesh.position.set(0, -0.18, 0.08);
    jawMesh.scale.set(0.42, 0.26, 0.38);
    headGroup.add(jawMesh);

    // 4. Deep Velvet Eye Sockets
    const leftSocket = new THREE.Mesh(sphereGeo, socketMat);
    leftSocket.position.set(-0.19, -0.02, 0.44);
    leftSocket.scale.set(0.15, 0.16, 0.07);
    headGroup.add(leftSocket);

    const rightSocket = new THREE.Mesh(sphereGeo, socketMat);
    rightSocket.position.set(0.19, -0.02, 0.44);
    rightSocket.scale.set(0.15, 0.16, 0.07);
    headGroup.add(rightSocket);

    // 5. Glowing 2,200K Amber Pinpricks (Track Visitor Pointer in 3D!)
    const leftPupil = new THREE.Mesh(sphereGeo, amberPinprickMat);
    leftPupil.position.set(-0.19, -0.02, 0.5);
    leftPupil.scale.set(0.055, 0.055, 0.035);
    headGroup.add(leftPupil);

    const rightPupil = new THREE.Mesh(sphereGeo, amberPinprickMat);
    rightPupil.position.set(0.19, -0.02, 0.5);
    rightPupil.scale.set(0.055, 0.055, 0.035);
    headGroup.add(rightPupil);

    // 6. Rosy Blush Cheeks
    const leftBlush = new THREE.Mesh(sphereGeo, blushMat);
    leftBlush.position.set(-0.33, -0.13, 0.41);
    leftBlush.scale.set(0.08, 0.05, 0.03);
    headGroup.add(leftBlush);

    const rightBlush = new THREE.Mesh(sphereGeo, blushMat);
    rightBlush.position.set(0.33, -0.13, 0.41);
    rightBlush.scale.set(0.08, 0.05, 0.03);
    headGroup.add(rightBlush);

    // 7. Quilted Indigo Nightcap Cone + Brim + Fluffy Pom-Pom
    const brimGeo = new THREE.TorusGeometry(0.48, 0.09, 16, 32);
    const brimMesh = new THREE.Mesh(brimGeo, cloudMat);
    brimMesh.position.set(0, 0.24, 0);
    brimMesh.rotation.x = Math.PI / 2 - 0.18;
    headGroup.add(brimMesh);

    const coneGeo = new THREE.ConeGeometry(0.46, 0.72, 24);
    const capCone = new THREE.Mesh(coneGeo, nightcapMat);
    capCone.position.set(-0.06, 0.56, -0.05);
    capCone.rotation.z = 0.28;
    capCone.rotation.x = -0.12;
    headGroup.add(capCone);

    const pomPom = new THREE.Mesh(sphereGeo, cloudMat);
    pomPom.position.set(-0.24, 0.88, -0.1);
    pomPom.scale.set(0.13, 0.13, 0.13);
    headGroup.add(pomPom);

    // 8. Signature Berry-Pink Ribbon Bow on Nightcap
    const bowGroup = new THREE.Group();
    bowGroup.position.set(-0.34, 0.28, 0.34);
    bowGroup.rotation.z = 0.35;
    const bowCenter = new THREE.Mesh(sphereGeo, berryBowMat);
    bowCenter.scale.set(0.06, 0.06, 0.05);
    const bowLeftLoop = new THREE.Mesh(sphereGeo, berryBowMat);
    bowLeftLoop.position.set(-0.09, 0.02, 0);
    bowLeftLoop.scale.set(0.09, 0.065, 0.04);
    const bowRightLoop = new THREE.Mesh(sphereGeo, berryBowMat);
    bowRightLoop.position.set(0.09, -0.02, 0);
    bowRightLoop.scale.set(0.09, 0.065, 0.04);
    bowGroup.add(bowCenter, bowLeftLoop, bowRightLoop);
    headGroup.add(bowGroup);

    // 9. Handheld Frosted Starlight Lantern + Warm PointLight
    const lanternGroup = new THREE.Group();
    lanternGroup.position.set(0.54, 0.18, 0.32);
    const lanternCylGeo = new THREE.CylinderGeometry(0.11, 0.13, 0.24, 16);
    const lanternCore = new THREE.Mesh(lanternCylGeo, lanternGlassMat);
    const lanternCap = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.1, 16), brassMat);
    lanternCap.position.y = 0.16;
    const lanternBase = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.04, 16), brassMat);
    lanternBase.position.y = -0.13;
    lanternGroup.add(lanternCore, lanternCap, lanternBase);
    pipRootGroup.add(lanternGroup);

    const lanternLight = new THREE.PointLight(0xfbbf24, 1.5, 4.5);
    lanternLight.position.set(0.55, 0.22, 0.42);
    pipRootGroup.add(lanternLight);

    // 10. Orbiting Starlight Motes (InstancedMesh > 20 instances)
    const starCount = 24;
    const starGeo = new THREE.OctahedronGeometry(0.045, 0);
    const starMat = new THREE.MeshStandardMaterial({
      color: 0xfde68a,
      emissive: 0xf59e0b,
      emissiveIntensity: 1.4,
      roughness: 0.2,
    });
    const starInstanced = new THREE.InstancedMesh(starGeo, starMat, starCount);
    for (let i = 0; i < starCount; i++) {
      const angle = (i / starCount) * Math.PI * 2;
      const radius = 1.25 + (i % 3) * 0.28;
      const y = -0.2 + Math.sin(angle * 3) * 0.65;
      _dummyPos.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
      const s = 0.75 + (i % 4) * 0.2;
      _dummyScale.set(s, s, s);
      _dummyMatrix.compose(_dummyPos, _dummyQuat, _dummyScale);
      starInstanced.setMatrixAt(i, _dummyMatrix);
    }
    starInstanced.instanceMatrix.needsUpdate = true;
    starInstanced.computeBoundingSphere();
    scene.add(starInstanced);

    // Pre-warm shaders
    renderer.compile(scene, camera);

    // Pointer move tracking for 3D eye-socket pinpricks
    const handlePointerMove = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      stateRef.current.pointerX = THREE.MathUtils.clamp(nx, -1, 1);
      stateRef.current.pointerY = THREE.MathUtils.clamp(ny, -1, 1);
    };

    const handleCanvasClick = () => {
      stateRef.current.hopImpulse = 0.22;
      setInteractionCount((c) => c + 1);
      onChimeRef.current();
    };

    renderer.domElement.addEventListener('pointermove', handlePointerMove, { passive: true });
    renderer.domElement.addEventListener('click', handleCanvasClick);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 520;
      const h = container.clientHeight || 420;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation loop (throttled to ~15fps in headless software WebGL so screenshots never stall)
    const clock = new THREE.Clock();
    let animFrameId = 0;
    let lastHeadlessRender = 0;

    const animate = (nowMs: number) => {
      animFrameId = requestAnimationFrame(animate);
      if (isHeadless && nowMs - lastHeadlessRender < 66) {
        return;
      }
      lastHeadlessRender = nowMs;

      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();

      // Smooth breathing & cloud bobbing
      const hop = stateRef.current.hopImpulse;
      stateRef.current.hopImpulse = THREE.MathUtils.damp(hop, 0, 6, delta);
      pipRootGroup.position.y = Math.sin(elapsed * 2.1) * 0.06 + hop;

      if (stateRef.current.autoRotate) {
        pipRootGroup.rotation.y += delta * 0.45;
      }

      // Smoothly damp 3D amber eye-socket pinpricks toward pointer
      const targetEyeX = stateRef.current.pointerX * 0.04;
      const targetEyeY = stateRef.current.pointerY * 0.04;
      leftPupil.position.x = THREE.MathUtils.damp(leftPupil.position.x, -0.19 + targetEyeX, 10, delta);
      leftPupil.position.y = THREE.MathUtils.damp(leftPupil.position.y, -0.02 + targetEyeY, 10, delta);
      rightPupil.position.x = THREE.MathUtils.damp(rightPupil.position.x, 0.19 + targetEyeX, 10, delta);
      rightPupil.position.y = THREE.MathUtils.damp(rightPupil.position.y, -0.02 + targetEyeY, 10, delta);

      // Lantern boost intensity
      const targetIntensity = stateRef.current.lanternBoost ? 3.2 : 1.5;
      lanternLight.intensity = THREE.MathUtils.damp(lanternLight.intensity, targetIntensity, 6, delta);
      lanternGlassMat.emissiveIntensity = THREE.MathUtils.damp(
        lanternGlassMat.emissiveIntensity,
        stateRef.current.lanternBoost ? 3.2 : 1.8,
        6,
        delta
      );

      // Orbiting starlight motes gentle rotation
      starInstanced.rotation.y = elapsed * 0.18;

      // Smoothly glide camera to preset angle when user clicks a preset button
      if (stateRef.current.presetLerpTicks > 0) {
        if (stateRef.current.cameraPreset === 'front') {
          _targetCamPos.set(0, 1.05, 4.35);
        } else if (stateRef.current.cameraPreset === 'top') {
          _targetCamPos.set(0, 3.35, 3.15);
        } else {
          _targetCamPos.set(1.25, 1.25, 4.25);
        }
        const dampFactor = 1 - Math.exp(-8 * delta);
        camera.position.lerp(_targetCamPos, dampFactor);
        stateRef.current.presetLerpTicks -= 1;
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointermove', handlePointerMove);
      renderer.domElement.removeEventListener('click', handleCanvasClick);
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      controls.dispose();
      sphereGeo.dispose();
      brimGeo.dispose();
      coneGeo.dispose();
      lanternCylGeo.dispose();
      starGeo.dispose();
      shadowGeo.dispose();
      renderer.dispose();
    };
  }, []);

  const handlePresetClick = (preset: CameraPreset) => {
    setCameraPreset(preset);
    stateRef.current.cameraPreset = preset;
    stateRef.current.presetLerpTicks = 35;
    onModelChime();
  };

  return (
    <div
      className="relative w-full h-[400px] sm:h-[440px] rounded-2xl overflow-hidden border border-[#a34063]/30 bg-[#181326]"
      data-testid="pip-3d-webgl-viewport"
    >
      {/* Top-Left Minimal Spec Badge (100% unobstructed center) */}
      <div className="pointer-events-none absolute top-3 left-3 z-10 flex items-center gap-2 rounded-lg bg-[#13101c] px-3 py-1.5 border border-[#33294a] text-xs text-[#f9f1e6]">
        <Eye className="w-3.5 h-3.5 text-[#fbbf24]" aria-hidden="true" />
        <span className="font-medium">3D WebGL Pip & Cloud Glider</span>
        <span aria-hidden="true">·</span>
        <span className="font-mono-tabular text-[#fbbf24]">
          Drag to Orbit · Click Pip ({interactionCount})
        </span>
      </div>

      {/* Dedicated Empty WebGL Mount Container */}
      {!webglFallback ? (
        <div
          ref={canvasMountRef}
          className="w-full h-full cursor-grab active:cursor-grabbing"
          aria-label="Interactive 3D WebGL model of Pip the Skull Baby on a Cloud Glider"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-[#f9f1e6]">
          <img
            src="/baby/assets/pip_avatar_cloud.png"
            alt="Pip on Cloud Glider"
            referrerPolicy="no-referrer"
            className="w-48 h-48 object-contain mb-3"
          />
          <p className="font-serif-editorial text-lg font-semibold">
            Pip’s Cloud Glider (2D Studio Fallback)
          </p>
        </div>
      )}

      {/* Ergonomic Collapsible Bottom Control Dock (Zero backdrop-filter over WebGL) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 w-[94%] max-w-[600px] flex flex-col items-center">
        <button
          type="button"
          onClick={() => setDockCollapsed((prev) => !prev)}
          className="mb-1 inline-flex items-center gap-1 px-2.5 py-1 rounded-t-lg bg-[#13101c] border border-b-0 border-[#33294a] text-[11px] font-medium text-[#e6d5c3] hover:text-white cursor-pointer whitespace-nowrap"
        >
          {dockCollapsed ? (
            <>
              <ChevronUp className="w-3 h-3" aria-hidden="true" />
              <span>Show 3D Controls</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3 h-3" aria-hidden="true" />
              <span>Hide 3D Dock</span>
            </>
          )}
        </button>

        {!dockCollapsed && (
          <div
            className="w-full rounded-xl bg-[#13101c] border border-[#33294a] px-3 py-2 flex flex-wrap items-center justify-between gap-2 text-xs text-[#f9f1e6] shadow-lg"
            role="toolbar"
            aria-label="3D Model Camera and Lantern Controls"
          >
            <div className="flex items-center gap-1">
              {(['angle', 'front', 'top'] as CameraPreset[]).map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handlePresetClick(preset)}
                  className={`px-2.5 py-1 rounded-md font-medium capitalize transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    cameraPreset === preset
                      ? 'bg-[#a34063] text-white'
                      : 'text-[#e6d5c3] hover:bg-white/10'
                  }`}
                >
                  {preset} Cam
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setAutoRotate((prev) => !prev)}
                aria-pressed={autoRotate}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md border font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  autoRotate
                    ? 'bg-[#a34063]/25 border-[#a34063] text-[#fde68a]'
                    : 'border-[#33294a] text-[#e6d5c3]'
                }`}
              >
                <RotateCcw className="w-3 h-3" aria-hidden="true" />
                <span>{autoRotate ? 'Orbiting' : 'Paused'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setLanternBoost((prev) => !prev);
                  onModelChime();
                }}
                aria-pressed={lanternBoost}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md border font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  lanternBoost
                    ? 'bg-[#d97706] text-[#13101c] border-[#d97706] font-semibold'
                    : 'border-[#33294a] text-[#e6d5c3]'
                }`}
              >
                <Sparkles className="w-3 h-3" aria-hidden="true" />
                <span>{lanternBoost ? '2,400K Boost' : 'Lantern Glow'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
