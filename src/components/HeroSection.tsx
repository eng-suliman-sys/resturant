import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ArrowRight, Sparkles, Star, UtensilsCrossed, ShieldCheck, Award } from 'lucide-react';

interface HeroSectionProps {
  onOrderNowClick: () => void;
  onExploreDishesClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOrderNowClick,
  onExploreDishesClick,
}) => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  // Liquid hover effect handler
  const handleLiquidClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();

    setRipples((prev) => [...prev, { x, y, id }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);

    onOrderNowClick();
  };

  // Three.js 3D Animated Floating Ingredients Scene
  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    let width = container.clientWidth;
    let height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 18;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    container.appendChild(renderer.domElement);

    // Warm Ambient and Directional Lights
    const ambientLight = new THREE.AmbientLight(0xfff7ed, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffe4d6, 2.2);
    keyLight.position.set(10, 15, 12);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x4a6b5d, 1.2);
    rimLight.position.set(-12, -8, 8);
    scene.add(rimLight);

    // Floating Ingredients Group
    const ingredientsGroup = new THREE.Group();
    scene.add(ingredientsGroup);

    interface FloatingItem {
      mesh: THREE.Mesh | THREE.Group;
      rotSpeedX: number;
      rotSpeedY: number;
      rotSpeedZ: number;
      baseY: number;
      baseX: number;
      driftSpeed: number;
      phase: number;
    }

    const floatingItems: FloatingItem[] = [];

    // 1. Sage & Rosemary Leaves (Green organic meshes)
    const sageMaterial = new THREE.MeshStandardMaterial({
      color: 0x4a6b5d,
      roughness: 0.35,
      metalness: 0.1,
      bumpScale: 0.05,
      side: THREE.DoubleSide,
    });

    const createLeafGeometry = () => {
      const shape = new THREE.Shape();
      shape.moveTo(0, -1.2);
      shape.bezierCurveTo(0.6, -0.6, 0.8, 0.4, 0, 1.4);
      shape.bezierCurveTo(-0.8, 0.4, -0.6, -0.6, 0, -1.2);
      return new THREE.ExtrudeGeometry(shape, { depth: 0.08, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 3 });
    };

    const leafGeo = createLeafGeometry();
    for (let i = 0; i < 7; i++) {
      const leaf = new THREE.Mesh(leafGeo, sageMaterial);
      const scale = 0.45 + Math.random() * 0.4;
      leaf.scale.set(scale, scale, scale);

      const x = (Math.random() - 0.5) * 22;
      const y = (Math.random() - 0.5) * 14;
      const z = (Math.random() - 0.5) * 10;
      leaf.position.set(x, y, z);
      leaf.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);

      ingredientsGroup.add(leaf);
      floatingItems.push({
        mesh: leaf,
        rotSpeedX: (Math.random() - 0.5) * 0.012,
        rotSpeedY: (Math.random() - 0.5) * 0.015,
        rotSpeedZ: (Math.random() - 0.5) * 0.008,
        baseX: x,
        baseY: y,
        driftSpeed: 0.7 + Math.random() * 0.8,
        phase: Math.random() * Math.PI * 2,
      });
    }

    // 2. Melting / Aged Cheese Shards (Creamy Gold)
    const cheeseMaterial = new THREE.MeshStandardMaterial({
      color: 0xf5c366,
      roughness: 0.45,
      metalness: 0.05,
    });
    const cheeseGeo = new THREE.ConeGeometry(0.7, 1.4, 4);
    for (let i = 0; i < 5; i++) {
      const cheese = new THREE.Mesh(cheeseGeo, cheeseMaterial);
      const scale = 0.5 + Math.random() * 0.4;
      cheese.scale.set(scale, scale * 1.2, scale * 0.5);

      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 12;
      const z = (Math.random() - 0.5) * 8;
      cheese.position.set(x, y, z);
      cheese.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);

      ingredientsGroup.add(cheese);
      floatingItems.push({
        mesh: cheese,
        rotSpeedX: 0.008,
        rotSpeedY: 0.011,
        rotSpeedZ: 0.005,
        baseX: x,
        baseY: y,
        driftSpeed: 0.6 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
      });
    }

    // 3. Terracotta Spice / Chili Flakes & Peppercorns
    const spiceMaterial = new THREE.MeshStandardMaterial({
      color: 0xe05a47,
      roughness: 0.3,
      metalness: 0.15,
    });
    const spiceGeo = new THREE.DodecahedronGeometry(0.35, 0);
    for (let i = 0; i < 9; i++) {
      const spice = new THREE.Mesh(spiceGeo, spiceMaterial);
      const scale = 0.3 + Math.random() * 0.35;
      spice.scale.set(scale, scale * 0.6, scale);

      const x = (Math.random() - 0.5) * 24;
      const y = (Math.random() - 0.5) * 15;
      const z = (Math.random() - 0.5) * 9;
      spice.position.set(x, y, z);

      ingredientsGroup.add(spice);
      floatingItems.push({
        mesh: spice,
        rotSpeedX: (Math.random() - 0.5) * 0.02,
        rotSpeedY: (Math.random() - 0.5) * 0.025,
        rotSpeedZ: (Math.random() - 0.5) * 0.015,
        baseX: x,
        baseY: y,
        driftSpeed: 1.0 + Math.random() * 0.7,
        phase: Math.random() * Math.PI * 2,
      });
    }

    // 4. Golden Olive Oil Droplets (Glossy translucent spheres)
    const oilMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xd4af37,
      roughness: 0.1,
      transmission: 0.85,
      thickness: 0.6,
      ior: 1.45,
    });
    const dropletGeo = new THREE.SphereGeometry(0.3, 16, 16);
    for (let i = 0; i < 6; i++) {
      const drop = new THREE.Mesh(dropletGeo, oilMaterial);
      const scale = 0.4 + Math.random() * 0.45;
      drop.scale.set(scale, scale * 1.3, scale);

      const x = (Math.random() - 0.5) * 22;
      const y = (Math.random() - 0.5) * 14;
      const z = (Math.random() - 0.5) * 8;
      drop.position.set(x, y, z);

      ingredientsGroup.add(drop);
      floatingItems.push({
        mesh: drop,
        rotSpeedX: 0.005,
        rotSpeedY: 0.008,
        rotSpeedZ: 0.003,
        baseX: x,
        baseY: y,
        driftSpeed: 0.5 + Math.random() * 0.6,
        phase: Math.random() * Math.PI * 2,
      });
    }

    // Mouse Interaction for subtle tilt parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let scrollY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const handleScroll = () => {
      scrollY = window.scrollY;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });
    resizeObserver.observe(container);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera parallax
      targetX += (mouseX * 1.2 - targetX) * 0.05;
      targetY += (mouseY * 1.2 - targetY) * 0.05;
      camera.position.x = targetX;
      camera.position.y = targetY + (scrollY * 0.004);
      camera.lookAt(0, scrollY * 0.002, 0);

      // Rotate and float ingredients
      floatingItems.forEach((item) => {
        item.mesh.rotation.x += item.rotSpeedX;
        item.mesh.rotation.y += item.rotSpeedY;
        item.mesh.rotation.z += item.rotSpeedZ;

        // Subtle bobbing motion + scroll drift
        const bob = Math.sin(elapsedTime * item.driftSpeed + item.phase) * 0.6;
        item.mesh.position.y = item.baseY + bob - (scrollY * 0.003);
        item.mesh.position.x = item.baseX + Math.cos(elapsedTime * 0.4 + item.phase) * 0.3;
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      resizeObserver.disconnect();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <section
      id="hero-section"
      className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-[#FAF9F6] pt-12 pb-20 border-b border-[#EAE4D9]"
    >
      {/* 3D WebGL Floating Ingredients Background Canvas */}
      <div
        ref={canvasContainerRef}
        className="absolute inset-0 z-0 pointer-events-none opacity-85"
        style={{ mixBlendMode: 'multiply' }}
      />

      {/* Decorative Warm Ambient Glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-[#E05A47]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-20 w-96 h-96 rounded-full bg-[#4A6B5D]/10 blur-3xl pointer-events-none" />

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Local Marketing / Culinary Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EBF2EE] border border-[#A6C4B6] text-[#4A6B5D] text-xs sm:text-sm font-semibold mb-6 shadow-sm">
          <Sparkles className="w-4 h-4 text-[#E05A47]" />
          <span>Wood-Fired Embers & Foraged Mediterranean Flavors</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#E05A47]" />
          <span className="text-[#375347]">Voted Best Dining Experience 2025</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-[#1C1917] leading-[1.08] mb-6">
          Taste the{' '}
          <span className="relative inline-block text-[#E05A47]">
            Extraordinary
            <svg
              className="absolute -bottom-2 left-0 w-full text-[#4A6B5D]/40"
              height="10"
              viewBox="0 0 100 10"
              preserveAspectRatio="none"
            >
              <path d="M0 6 Q 50 0 100 6" stroke="currentColor" strokeWidth="4" fill="none" />
            </svg>
          </span>
        </h1>

        {/* Narrative Description */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-[#57534E] leading-relaxed mb-10 font-normal">
          Where rustic Mediterranean earth meets modern culinary precision. Experience artisanal dry-aged meats,
          silky handmade pasta, and wild botanicals seared over glowing olive wood coals.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 mb-14">
          {/* Primary CTA with Liquid Hover Animation */}
          <button
            id="btn-order-online-now"
            onClick={handleLiquidClick}
            className="liquid-btn group w-full sm:w-auto px-8 py-4 bg-[#E05A47] hover:bg-[#C44332] text-white font-bold text-base sm:text-lg rounded-full shadow-lg shadow-[#E05A47]/30 flex items-center justify-center gap-3 transition-transform active:scale-95 cursor-pointer"
          >
            <span>Order Online Now</span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />

            {/* Ripple elements on click */}
            {ripples.map((ripple) => (
              <span
                key={ripple.id}
                className="liquid-bubble"
                style={{
                  left: ripple.x - 20,
                  top: ripple.y - 20,
                  width: 40,
                  height: 40,
                }}
              />
            ))}
          </button>

          {/* Secondary 3D Showcase CTA */}
          <button
            id="btn-explore-3d-dishes"
            onClick={onExploreDishesClick}
            className="w-full sm:w-auto px-7 py-4 bg-white/90 hover:bg-[#FAF9F6] text-[#1C1917] border-2 border-[#D5CBBF] hover:border-[#4A6B5D] font-bold text-base sm:text-lg rounded-full shadow-sm flex items-center justify-center gap-2.5 transition-all active:scale-95 cursor-pointer"
          >
            <UtensilsCrossed className="w-5 h-5 text-[#4A6B5D]" />
            <span>Interactive 3D Dish Showcase</span>
          </button>
        </div>

        {/* High-Impact Proof Metrics & Accolades */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto pt-6 border-t border-[#EAE4D9]">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-[#E05A47] font-bold text-lg">
              <Star className="w-4 h-4 fill-current" />
              <span>4.9 / 5.0</span>
            </div>
            <span className="text-xs text-[#57534E] font-medium">2,400+ Verified Reviews</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-[#4A6B5D] font-bold text-lg">
              <Award className="w-4 h-4" />
              <span>Michelin Guide</span>
            </div>
            <span className="text-xs text-[#57534E] font-medium">Selected 2024 & 2025</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-[#1C1917] font-bold text-lg">
              <ShieldCheck className="w-4 h-4 text-[#4A6B5D]" />
              <span>100% Organic</span>
            </div>
            <span className="text-xs text-[#57534E] font-medium">Farm-to-Table Foraged</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-[#E05A47] font-bold text-lg">
              <span>900°F</span>
            </div>
            <span className="text-xs text-[#57534E] font-medium">Oak Wood Fire Hearth</span>
          </div>
        </div>
      </div>
    </section>
  );
};
