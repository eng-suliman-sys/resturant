import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import {
  RotateCcw,
  Sparkles,
  Flame,
  Plus,
  Info,
  Check,
  Zap,
  Layers,
  Activity,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { Dish } from '../types';
import { DISHES } from '../data/restaurantData';

interface DishShowcase3DProps {
  onAddToCart: (dish: Dish) => void;
}

export const DishShowcase3D: React.FC<DishShowcase3DProps> = ({ onAddToCart }) => {
  const [selectedDishIndex, setSelectedDishIndex] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [isAdded, setIsAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<'flavor' | 'nutrition' | 'ingredients'>('flavor');
  const [modelLoading, setModelLoading] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const dishGroupRef = useRef<THREE.Group | null>(null);
  const isDraggingRef = useRef(false);
  const prevPointerRef = useRef({ x: 0, y: 0 });

  const activeDish = DISHES[selectedDishIndex];

  // Helper to build 3D Dish Models procedurally
  const buildDishModel = (dish: Dish): THREE.Group => {
    const group = new THREE.Group();

    // 1. Artisan Stoneware Plate
    const plateMat = new THREE.MeshStandardMaterial({
      color: dish.plateColor === '#FAF9F6' ? 0xf4eee5 : 0x221f1d,
      roughness: 0.35,
      metalness: 0.08,
    });
    const plateRimMat = new THREE.MeshStandardMaterial({
      color: dish.plateColor === '#FAF9F6' ? 0xe5dacd : 0x3d3733,
      roughness: 0.5,
      metalness: 0.1,
    });

    // Plate base cylinder
    const plateBase = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 3.2, 0.3, 48), plateMat);
    plateBase.position.y = -0.15;
    plateBase.receiveShadow = true;
    group.add(plateBase);

    // Plate rim
    const plateRim = new THREE.Mesh(new THREE.TorusGeometry(3.6, 0.28, 16, 48), plateRimMat);
    plateRim.rotation.x = Math.PI / 2;
    plateRim.position.y = 0.05;
    group.add(plateRim);

    // Plate interior well
    const wellMat = new THREE.MeshStandardMaterial({
      color: dish.plateColor === '#FAF9F6' ? 0xfbf8f3 : 0x1c1917,
      roughness: 0.2,
      metalness: 0.05,
    });
    const well = new THREE.Mesh(new THREE.CylinderGeometry(3.3, 3.1, 0.05, 48), wellMat);
    well.position.y = 0.02;
    group.add(well);

    // 2. Dish Specific 3D Geometry
    if (dish.modelType === 'steak') {
      // Smoked Ribeye Cut
      const steakMat = new THREE.MeshStandardMaterial({
        color: 0x4a1e17,
        roughness: 0.65,
        metalness: 0.12,
      });
      const steak = new THREE.Mesh(
        new THREE.BoxGeometry(2.8, 0.8, 1.8),
        steakMat
      );
      steak.position.set(0, 0.45, 0);
      steak.rotation.y = 0.2;
      group.add(steak);

      // Charred Grill Marks
      const grillMat = new THREE.MeshBasicMaterial({ color: 0x1a0907 });
      for (let i = -1; i <= 1; i++) {
        const mark = new THREE.Mesh(new THREE.BoxGeometry(2.7, 0.02, 0.12), grillMat);
        mark.position.set(0, 0.86, i * 0.45);
        mark.rotation.y = 0.5;
        group.add(mark);
      }

      // Melting Bone Marrow & Sage Butter Medallion
      const butterMat = new THREE.MeshStandardMaterial({ color: 0xffe680, roughness: 0.2 });
      const butter = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.5, 0.18, 16), butterMat);
      butter.position.set(0.2, 0.94, 0.1);
      group.add(butter);

      // Mountain Rosemary Sprig
      const herbMat = new THREE.MeshStandardMaterial({ color: 0x375347, roughness: 0.4 });
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.6, 8), herbMat);
      stem.rotation.z = Math.PI / 3;
      stem.position.set(-0.2, 0.98, 0.3);
      group.add(stem);

      // Maldon Sea Salt crystals
      const saltMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1, metalness: 0.8 });
      for (let i = 0; i < 14; i++) {
        const salt = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.06), saltMat);
        salt.position.set((Math.random() - 0.5) * 1.8, 0.87, (Math.random() - 0.5) * 1.2);
        group.add(salt);
      }
    } else if (dish.modelType === 'pasta') {
      // Truffle & Burrata Agnolotti pillows
      const pastaMat = new THREE.MeshStandardMaterial({ color: 0xf5d07a, roughness: 0.35 });
      const truffleMat = new THREE.MeshStandardMaterial({ color: 0x1f1a18, roughness: 0.8 });
      const sageMat = new THREE.MeshStandardMaterial({ color: 0x4a6b5d, roughness: 0.4 });

      // Circular ring of agnolotti
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const pillow = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.4, 0.65), pastaMat);
        pillow.position.set(Math.cos(angle) * 1.3, 0.25, Math.sin(angle) * 1.3);
        pillow.rotation.y = angle + 0.3;
        group.add(pillow);
      }
      // Center creamy burrata dollop
      const burrataMat = new THREE.MeshStandardMaterial({ color: 0xfffaf0, roughness: 0.2 });
      const burrata = new THREE.Mesh(new THREE.SphereGeometry(0.7, 16, 16), burrataMat);
      burrata.scale.set(1, 0.65, 1);
      burrata.position.set(0, 0.4, 0);
      group.add(burrata);

      // Truffle shavings
      for (let i = 0; i < 10; i++) {
        const truffle = new THREE.Mesh(new THREE.CircleGeometry(0.18, 8), truffleMat);
        truffle.rotation.x = -Math.PI / 2 + (Math.random() - 0.5) * 0.4;
        truffle.position.set((Math.random() - 0.5) * 1.8, 0.55 + Math.random() * 0.2, (Math.random() - 0.5) * 1.8);
        group.add(truffle);
      }

      // Crisp Sage leaves
      const sage1 = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.02, 0.3), sageMat);
      sage1.position.set(0.4, 0.7, -0.3);
      sage1.rotation.y = 0.6;
      group.add(sage1);
    } else if (dish.modelType === 'fish') {
      // Fire-Roasted Sea Bass fillet
      const skinMat = new THREE.MeshStandardMaterial({ color: 0x82705e, roughness: 0.4, metalness: 0.2 });
      const fleshMat = new THREE.MeshStandardMaterial({ color: 0xfffcf7, roughness: 0.3 });

      const fishFlesh = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 1.0, 2.4, 16), fleshMat);
      fishFlesh.rotation.z = Math.PI / 2;
      fishFlesh.scale.set(0.6, 1, 0.4);
      fishFlesh.position.set(0, 0.35, 0);
      group.add(fishFlesh);

      const fishSkin = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.05, 0.8), skinMat);
      fishSkin.position.set(0, 0.55, 0);
      group.add(fishSkin);

      // Charred Meyer Lemon wheel
      const lemonMat = new THREE.MeshStandardMaterial({ color: 0xffd700, roughness: 0.3 });
      const lemon = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.1, 16), lemonMat);
      lemon.position.set(1.1, 0.3, 0.8);
      lemon.rotation.x = 0.3;
      group.add(lemon);

      // Capers & Herb garnish
      const caperMat = new THREE.MeshStandardMaterial({ color: 0x475239, roughness: 0.6 });
      for (let i = 0; i < 8; i++) {
        const caper = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), caperMat);
        caper.position.set((Math.random() - 0.5) * 2.0, 0.25, (Math.random() - 0.5) * 1.5);
        group.add(caper);
      }
    } else if (dish.modelType === 'risotto') {
      // Wild Morel & Sage Risotto
      const riceMat = new THREE.MeshStandardMaterial({ color: 0xded3ba, roughness: 0.5 });
      const risottoMound = new THREE.Mesh(new THREE.SphereGeometry(1.8, 24, 16), riceMat);
      risottoMound.scale.set(1.2, 0.4, 1.2);
      risottoMound.position.set(0, 0.2, 0);
      group.add(risottoMound);

      // Forest Morels (textured conical shapes)
      const morelMat = new THREE.MeshStandardMaterial({ color: 0x3d271d, roughness: 0.8 });
      for (let i = 0; i < 5; i++) {
        const morel = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.7, 8), morelMat);
        const angle = (i / 5) * Math.PI * 2 + 0.4;
        morel.position.set(Math.cos(angle) * 0.9, 0.5, Math.sin(angle) * 0.9);
        morel.rotation.z = (Math.random() - 0.5) * 0.5;
        group.add(morel);
      }

      // Shaved Taleggio
      const cheeseMat = new THREE.MeshStandardMaterial({ color: 0xfffae6, roughness: 0.3 });
      for (let i = 0; i < 7; i++) {
        const flake = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.03, 0.2), cheeseMat);
        flake.position.set((Math.random() - 0.5) * 1.5, 0.6, (Math.random() - 0.5) * 1.5);
        flake.rotation.y = Math.random() * Math.PI;
        group.add(flake);
      }
    } else {
      // Terracotta Basque Burnt Cheesecake
      const crustMat = new THREE.MeshStandardMaterial({ color: 0x2e170e, roughness: 0.9 });
      const custardMat = new THREE.MeshStandardMaterial({ color: 0xfcedc2, roughness: 0.2 });

      // Wedge geometry
      const cakeWedge = new THREE.Mesh(
        new THREE.CylinderGeometry(1.9, 1.9, 1.2, 16, 1, false, 0, Math.PI / 2.8),
        custardMat
      );
      cakeWedge.position.set(-0.3, 0.6, -0.3);
      group.add(cakeWedge);

      // Caramelized Burnt Top
      const burntTop = new THREE.Mesh(
        new THREE.CylinderGeometry(1.92, 1.92, 0.08, 16, 1, false, 0, Math.PI / 2.8),
        crustMat
      );
      burntTop.position.set(-0.3, 1.22, -0.3);
      group.add(burntTop);

      // Blood Orange Coulis Pool
      const coulisMat = new THREE.MeshStandardMaterial({ color: 0xb51c1c, roughness: 0.1 });
      const pool = new THREE.Mesh(new THREE.CircleGeometry(1.2, 16), coulisMat);
      pool.rotation.x = -Math.PI / 2;
      pool.position.set(0.7, 0.05, 0.5);
      group.add(pool);
    }

    // Aromatic Steam Particles
    const steamMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.18,
    });
    for (let i = 0; i < 6; i++) {
      const steam = new THREE.Mesh(new THREE.SphereGeometry(0.2 + i * 0.05, 8, 8), steamMat);
      steam.position.set((Math.random() - 0.5) * 0.8, 1.2 + i * 0.35, (Math.random() - 0.5) * 0.8);
      group.add(steam);
    }

    return group;
  };

  // Setup Three.js scene
  useEffect(() => {
    const container = canvasRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 4.5, 7.5);
    camera.lookAt(0, 0.3, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // Warm Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xfffaf0, 1.6);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffecd2, 2.5);
    mainLight.position.set(6, 10, 8);
    mainLight.castShadow = true;
    scene.add(mainLight);

    const softFillLight = new THREE.DirectionalLight(0x4a6b5d, 1.0);
    softFillLight.position.set(-6, 4, -4);
    scene.add(softFillLight);

    // Initial Dish Model
    const dishGroup = buildDishModel(DISHES[0]);
    dishGroupRef.current = dishGroup;
    scene.add(dishGroup);

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Drag-to-Rotate Pointer Handlers
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDraggingRef.current = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      prevPointerRef.current = { x: clientX, y: clientY };
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDraggingRef.current || !dishGroupRef.current) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const deltaX = clientX - prevPointerRef.current.x;
      const deltaY = clientY - prevPointerRef.current.y;

      dishGroupRef.current.rotation.y += deltaX * 0.01;
      dishGroupRef.current.rotation.x = Math.max(
        -0.2,
        Math.min(0.6, dishGroupRef.current.rotation.x + deltaY * 0.006)
      );

      prevPointerRef.current = { x: clientX, y: clientY };
    };

    const onPointerUp = () => {
      isDraggingRef.current = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    dom.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // Animation Loop
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      if (dishGroupRef.current && isAutoRotating && !isDraggingRef.current) {
        dishGroupRef.current.rotation.y += 0.007;
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update 3D Model when selected dish changes
  useEffect(() => {
    if (!sceneRef.current) return;
    setModelLoading(true);

    // Remove old model
    if (dishGroupRef.current) {
      sceneRef.current.remove(dishGroupRef.current);
    }

    // Build and add new model with entry spin
    const newGroup = buildDishModel(activeDish);
    newGroup.rotation.y = -Math.PI / 3;
    newGroup.position.y = 0;
    sceneRef.current.add(newGroup);
    dishGroupRef.current = newGroup;

    setTimeout(() => {
      setModelLoading(false);
    }, 180);
  }, [selectedDishIndex]);

  const handleResetRotation = () => {
    if (dishGroupRef.current) {
      dishGroupRef.current.rotation.set(0, 0, 0);
    }
  };

  const handleAddToCart = () => {
    onAddToCart(activeDish);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <section id="showcase-3d" className="py-20 bg-[#FAF9F6] border-b border-[#EAE4D9] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF0ED] text-[#E05A47] text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Sensory 3D Tasting Room
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#1C1917] tracking-tight mb-4">
            Interactive 3D Dish Showcase
          </h2>
          <p className="text-stone-600 text-base sm:text-lg">
            Click any signature plate to rotate a high-precision 3D model. Inspect authentic ingredients,
            unveil nutritional macros, and explore culinary flavor balance.
          </p>
        </div>

        {/* Dish Carousel Selector Tabs */}
        <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-8 scrollbar-none no-scrollbar justify-start sm:justify-center">
          {DISHES.map((dish, idx) => {
            const isSelected = idx === selectedDishIndex;
            return (
              <button
                key={dish.id}
                id={`dish-tab-${dish.id}`}
                onClick={() => setSelectedDishIndex(idx)}
                className={`flex-shrink-0 px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-[#1C1917] text-white shadow-md scale-105 ring-2 ring-[#E05A47]'
                    : 'bg-white text-stone-700 hover:bg-[#F3EFE6] border border-[#E0D7CC]'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: dish.accentColor }}
                />
                <span>{dish.name}</span>
                <span className={`text-xs ${isSelected ? 'text-[#FAF9F6]' : 'text-[#E05A47]'}`}>
                  ${dish.price}
                </span>
              </button>
            );
          })}
        </div>

        {/* Main 3D Display & Details Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* 3D Model Stage Canvas (7 cols on large screen) */}
          <div className="lg:col-span-7 bg-[#F3EFE6] rounded-3xl border border-[#E2DAD0] p-6 sm:p-8 flex flex-col justify-between relative shadow-sm overflow-hidden min-h-[460px] sm:min-h-[520px]">
            {/* Top Bar of 3D Canvas */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-white/80 backdrop-blur rounded-full text-xs font-semibold text-stone-800 border border-stone-200 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-[#E05A47]" />
                  Drag 360° to inspect
                </span>
                {activeDish.isChefSpecial && (
                  <span className="px-3 py-1 bg-[#E05A47] text-white rounded-full text-xs font-bold shadow-sm">
                    Chef’s Reserve
                  </span>
                )}
              </div>

              {/* Canvas Controls */}
              <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur p-1 rounded-full border border-stone-200 shadow-sm">
                <button
                  onClick={() => setIsAutoRotating(!isAutoRotating)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                    isAutoRotating
                      ? 'bg-[#4A6B5D] text-white'
                      : 'text-stone-600 hover:bg-stone-100'
                  }`}
                  title="Toggle automatic rotation"
                >
                  Auto-Spin: {isAutoRotating ? 'ON' : 'OFF'}
                </button>
                <button
                  onClick={handleResetRotation}
                  className="p-1.5 rounded-full text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                  title="Reset 3D position"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Three.js Canvas Container */}
            <div
              ref={canvasRef}
              id="threejs-dish-canvas"
              className="w-full h-80 sm:h-96 my-auto cursor-grab active:cursor-grabbing flex items-center justify-center relative select-none"
            >
              {modelLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#F3EFE6]/70 backdrop-blur-sm z-20">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 border-3 border-[#E05A47] border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs font-medium text-stone-600">Rotating 3D Plate...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Status Hint */}
            <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-300/50 z-10">
              <span>Plate: Handcrafted Stone Ceramic</span>
              <span>Embers: 900°F Olive Wood Fire</span>
            </div>
          </div>

          {/* Dish Specs & Interactive Profile (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-[#E2DAD0] p-6 sm:p-8 flex flex-col justify-between shadow-sm">
            <div>
              {/* Category & Price Header */}
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#4A6B5D]">
                    {activeDish.category}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1C1917] mt-0.5">
                    {activeDish.name}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black text-[#E05A47] font-display">
                    ${activeDish.price}
                  </span>
                  <p className="text-[11px] text-stone-400 font-medium">Inclusive of tax</p>
                </div>
              </div>

              {/* Tagline */}
              <p className="text-sm font-semibold text-[#375347] mb-3">
                {activeDish.tagline}
              </p>

              {/* Description */}
              <p className="text-stone-600 text-sm leading-relaxed mb-6">
                {activeDish.description}
              </p>

              {/* Sub-Tabs: Flavor Profile vs. Nutrition vs. Ingredients */}
              <div className="flex border-b border-stone-200 mb-5">
                <button
                  id="tab-flavor-profile"
                  onClick={() => setActiveTab('flavor')}
                  className={`pb-2.5 px-3 text-xs sm:text-sm font-bold transition-colors border-b-2 flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'flavor'
                      ? 'border-[#E05A47] text-[#E05A47]'
                      : 'border-transparent text-stone-500 hover:text-stone-800'
                  }`}
                >
                  <Flame className="w-4 h-4" />
                  Flavor Profile
                </button>
                <button
                  id="tab-nutrition"
                  onClick={() => setActiveTab('nutrition')}
                  className={`pb-2.5 px-3 text-xs sm:text-sm font-bold transition-colors border-b-2 flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'nutrition'
                      ? 'border-[#4A6B5D] text-[#4A6B5D]'
                      : 'border-transparent text-stone-500 hover:text-stone-800'
                  }`}
                >
                  <Activity className="w-4 h-4" />
                  Nutritional Info
                </button>
                <button
                  id="tab-ingredients"
                  onClick={() => setActiveTab('ingredients')}
                  className={`pb-2.5 px-3 text-xs sm:text-sm font-bold transition-colors border-b-2 flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'ingredients'
                      ? 'border-[#1C1917] text-[#1C1917]'
                      : 'border-transparent text-stone-500 hover:text-stone-800'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  Ingredients
                </button>
              </div>

              {/* Tab Content 1: Flavor Profile Bars */}
              {activeTab === 'flavor' && (
                <div className="space-y-3 mb-6">
                  {Object.entries(activeDish.flavorProfile).map(([key, val]) => {
                    const label = key.charAt(0).toUpperCase() + key.slice(1);
                    return (
                      <div key={key} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold text-stone-700">
                          <span>{label}</span>
                          <span className="font-mono text-stone-500">{val}%</span>
                        </div>
                        <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${val}%`,
                              backgroundColor:
                                key === 'spicy'
                                  ? '#E05A47'
                                  : key === 'freshness'
                                  ? '#4A6B5D'
                                  : '#C44332',
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Tab Content 2: Nutrition Breakdown */}
              {activeTab === 'nutrition' && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
                  <div className="bg-[#FAF9F6] p-3 rounded-xl border border-stone-200 text-center">
                    <span className="text-xl font-extrabold text-[#1C1917]">
                      {activeDish.nutrition.calories}
                    </span>
                    <p className="text-[11px] text-stone-500 font-medium">Calories</p>
                  </div>
                  <div className="bg-[#FAF9F6] p-3 rounded-xl border border-stone-200 text-center">
                    <span className="text-xl font-extrabold text-[#4A6B5D]">
                      {activeDish.nutrition.protein}g
                    </span>
                    <p className="text-[11px] text-stone-500 font-medium">Protein</p>
                  </div>
                  <div className="bg-[#FAF9F6] p-3 rounded-xl border border-stone-200 text-center">
                    <span className="text-xl font-extrabold text-[#E05A47]">
                      {activeDish.nutrition.carbs}g
                    </span>
                    <p className="text-[11px] text-stone-500 font-medium">Carbs</p>
                  </div>
                  <div className="bg-[#FAF9F6] p-3 rounded-xl border border-stone-200 text-center">
                    <span className="text-xl font-extrabold text-amber-700">
                      {activeDish.nutrition.fat}g
                    </span>
                    <p className="text-[11px] text-stone-500 font-medium">Healthy Fats</p>
                  </div>
                </div>
              )}

              {/* Tab Content 3: Fresh Ingredients */}
              {activeTab === 'ingredients' && (
                <div className="space-y-2 mb-6">
                  {activeDish.ingredients.map((ing, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2 rounded-lg bg-[#FAF9F6] border border-stone-200/80 text-xs"
                    >
                      <span className="font-semibold text-stone-800">{ing.name}</span>
                      <span className="text-stone-500 italic text-[11px]">{ing.origin}</span>
                    </div>
                  ))}
                  {activeDish.allergens.length > 0 && (
                    <p className="text-[11px] text-amber-700 mt-2 font-medium flex items-center gap-1">
                      <Info className="w-3.5 h-3.5" />
                      Allergens: {activeDish.allergens.join(', ')}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Quick Action: Add to Order */}
            <div className="pt-4 border-t border-stone-200">
              <button
                id="btn-add-to-order"
                onClick={handleAddToCart}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#E05A47] hover:bg-[#C44332] text-white font-bold text-base shadow-md shadow-[#E05A47]/20 flex items-center justify-center gap-2.5 transition-all active:scale-98 cursor-pointer"
              >
                {isAdded ? (
                  <>
                    <Check className="w-5 h-5 text-white" />
                    <span>Added to Order!</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    <span>Add to Order — ${activeDish.price}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
