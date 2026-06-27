import { ChangeDetectionStrategy, Component, signal, OnInit, AfterViewInit, inject, ElementRef, OnDestroy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FetchComponent } from './components/apps/fetch.component';
import { AboutComponent } from './components/apps/about.component';
import { SkillsComponent } from './components/apps/skills.component';
import { ProjectsComponent } from './components/apps/projects.component';
import { ContactComponent } from './components/apps/contact.component';
import { CmatrixComponent } from './components/apps/cmatrix.component';
import { SnakeComponent } from './components/apps/snake.component';
import { HtopComponent } from './components/apps/htop.component';
import { ExplorerComponent } from './components/apps/explorer.component';
import { NotepadComponent } from './components/apps/notepad.component';
import { WindowTileComponent } from './components/ui/window-tile.component';
import { TopBarComponent } from './components/ui/top-bar.component';
import { Poem, POEMS, TRANSLATIONS } from './data/portfolio.data';

declare var THREE: any;

export interface WindowState {
  id: string;
  title: string;
  isOpen: boolean;
  order: number;
  x: number;
  y: number;
  w: number;
  h: number;
  zIndex: number;
  workspace?: 'dev' | 'poetry';
  poemId?: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    FetchComponent,
    AboutComponent,
    SkillsComponent,
    ProjectsComponent,
    ContactComponent,
    CmatrixComponent,
    SnakeComponent,
    HtopComponent,
    ExplorerComponent,
    NotepadComponent,
    WindowTileComponent,
    TopBarComponent
  ],
  host: {
    '(window:mouseup)': 'onDragEnd()',
    '(window:mousemove)': 'onDragMove($event)',
    '(window:resize)': 'onResize()',
    '(document:mousemove)': 'onMouseMove($event)'
  }
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  developerName = signal('Luna T. G.');
  email = signal('contact@ladyluh.dev');
  currentYear = new Date().getFullYear();
  isPoetryEnabled = signal(false);
  t = signal(TRANSLATIONS);
  poems = signal(POEMS);

  currentTime = signal('');
  private intervalId?: any;

  private elementRef = inject(ElementRef);
  private animationFrameId?: number;
  private scene: any;
  private camera: any;
  private renderer: any;
  private particles: any;
  private clock = new THREE.Clock();

  mousePosition = signal({ x: 0, y: 0 });
  isMobile = signal(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  windows = signal<{ [key: string]: WindowState }>({
    'about': { id: 'about', title: '~/about.md', isOpen: true, order: 0, x: 50, y: 50, w: 500, h: 350, zIndex: 1, workspace: 'dev' },
    'projects': { id: 'projects', title: '~/projects', isOpen: true, order: 1, x: 580, y: 50, w: 500, h: 400, zIndex: 2, workspace: 'dev' },
    'fetch': { id: 'fetch', title: 'fetch', isOpen: true, order: 2, x: 100, y: 420, w: 550, h: 280, zIndex: 3, workspace: 'dev' },
    'skills': { id: 'skills', title: './list-skills.sh', isOpen: true, order: 3, x: 680, y: 470, w: 400, h: 250, zIndex: 4, workspace: 'dev' },
    'contact': { id: 'contact', title: '/etc/contact', isOpen: true, order: 4, x: 300, y: 200, w: 380, h: 320, zIndex: 5, workspace: 'dev' },
    'snake': { id: 'snake', title: './snake_game', isOpen: false, order: 5, x: 200, y: 100, w: 400, h: 480, zIndex: 6, workspace: 'dev' },
    'htop': { id: 'htop', title: 'htop', isOpen: false, order: 6, x: 650, y: 150, w: 350, h: 350, zIndex: 7, workspace: 'dev' },
    'cmatrix': { id: 'cmatrix', title: 'cmatrix', isOpen: false, order: 7, x: 400, y: 250, w: 450, h: 350, zIndex: 8, workspace: 'dev' },
    'explorer': { id: 'explorer', title: "Luna's poems", isOpen: true, order: 0, x: 50, y: 50, w: 600, h: 450, zIndex: 1, workspace: 'poetry' },
  });

  currentWorkspace = signal<'dev' | 'poetry'>('dev');
  activeWindowId = signal<string | null>('fetch');
  maxZIndex = signal(10);
  
  draggingWindowId = signal<string | null>(null);
  dragOverWindowId = signal<string | null>(null);
  dragX = signal(0);
  dragY = signal(0);

  openWindows = computed(() => {
    return Object.values(this.windows())
      .filter((w: WindowState) => w.isOpen && (!w.workspace || w.workspace === this.currentWorkspace()))
      .sort((a: WindowState, b: WindowState) => a.order - b.order);
  });

  gridLayout = computed(() => {
    const count = this.openWindows().length;
    const layouts: { [key: number]: { cols: number; rows: number } } = {
      0: { cols: 1, rows: 1 },
      1: { cols: 1, rows: 1 },
      2: { cols: 2, rows: 1 },
      3: { cols: 3, rows: 1 },
      4: { cols: 2, rows: 2 },
      5: { cols: 3, rows: 2 },
      6: { cols: 3, rows: 2 },
      7: { cols: 4, rows: 2 },
      8: { cols: 4, rows: 2 },
      9: { cols: 3, rows: 3 },
    };

    if (layouts[count]) {
      return layouts[count];
    }

    const cols = Math.ceil(Math.sqrt(count));
    const rows = Math.ceil(count / cols);
    return { cols, rows };
  });

  gridCols = computed(() => this.gridLayout().cols);
  gridRows = computed(() => this.gridLayout().rows);

  lastRowStartIndex = computed(() => {
    const count = this.openWindows().length;
    const cols = this.gridCols();
    const fullRows = Math.floor(count / cols);
    return fullRows * cols;
  });

  windowsInLastRow = computed(() => {
    const count = this.openWindows().length;
    return count - this.lastRowStartIndex();
  });

  getGridColumn(idx: number): string {
    const count = this.openWindows().length;
    const cols = this.gridCols();
    const lastRowStart = this.lastRowStartIndex();
    const inLastRow = this.windowsInLastRow();

    if (idx < lastRowStart || inLastRow >= cols || cols <= 1) {
      return 'auto';
    }

    const positionInLastRow = idx - lastRowStart;
    const totalSpan = cols;
    const baseSpan = Math.floor(totalSpan / inLastRow);
    const remainder = totalSpan % inLastRow;

    const span = baseSpan + (positionInLastRow < remainder ? 1 : 0);
    return 'span ' + span;
  }

  ngOnInit(): void {
    this.updateTime();
    this.intervalId = setInterval(() => this.updateTime(), 1000);

    (window as any).unlockPoetry = () => {
      this.isPoetryEnabled.set(true);
      console.log("Poetry workspace unlocked!");
    };
  }

  ngAfterViewInit(): void { this.initWebGL(); }

  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId);
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
  }

  updateTime(): void {
    this.currentTime.set(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
  }

  getPoemById(id?: string): Poem | undefined {
    if (!id) return undefined;
    return this.poems().find(p => p.id === id);
  }

  toggleWindow(id: string): void {
    this.windows.update(windows => {
      windows[id].isOpen = !windows[id].isOpen;
      return { ...windows };
    });
    this.activeWindowId.set(id);
  }

  setWorkspace(ws: 'dev' | 'poetry') {
    this.currentWorkspace.set(ws);
    const firstOpen = this.openWindows()[0];
    if (firstOpen) this.activeWindowId.set(firstOpen.id);
  }

  openPoem(poemId: string) {
    const poem = this.poems().find(p => p.id === poemId);
    if (!poem) return;

    const windowId = `poem-${poemId}`;

    this.windows.update(windows => {
      if (!windows[windowId]) {
        windows[windowId] = {
          id: windowId,
          title: `${poem.title}.txt`,
          isOpen: true,
          order: Object.keys(windows).length,
          x: 100 + (Math.random() * 200),
          y: 100 + (Math.random() * 200),
          w: 400,
          h: 500,
          zIndex: this.maxZIndex() + 1,
          workspace: 'poetry',
          poemId: poemId
        };
      } else {
        windows[windowId].isOpen = true;
      }
      return { ...windows };
    });

    this.focusWindow(windowId);
  }

  closeWindow(event: MouseEvent | undefined, id: string): void {
    if (event) event.stopPropagation();
    this.windows.update(windows => {
      windows[id].isOpen = false;
      return { ...windows };
    });
    if (this.activeWindowId() === id) {
      const nextWindow = this.openWindows()[0];
      this.activeWindowId.set(nextWindow ? nextWindow.id : null);
    }
  }

  focusWindow(id: string): void {
    this.activeWindowId.set(id);
    const newZ = this.maxZIndex() + 1;
    this.maxZIndex.set(newZ);
    this.windows.update(windows => {
      windows[id].zIndex = newZ;
      return { ...windows };
    });
  }

  onDragStart(event: MouseEvent, id: string): void {
    event.preventDefault();
    this.draggingWindowId.set(id);
    this.dragX.set(event.clientX);
    this.dragY.set(event.clientY);
    this.focusWindow(id);
  }

  onDragMove(event: MouseEvent): void {
    if (!this.draggingWindowId()) return;

    this.dragX.set(event.clientX);
    this.dragY.set(event.clientY);

    const dragOverElement = document.elementFromPoint(event.clientX, event.clientY)?.closest('.window-tile');
    if (dragOverElement && dragOverElement.id !== this.draggingWindowId()) {
      this.dragOverWindowId.set(dragOverElement.id);
    } else {
      this.dragOverWindowId.set(null);
    }
  }

  onDragEnd(): void {
    const sourceId = this.draggingWindowId();
    const targetId = this.dragOverWindowId();

    if (sourceId && targetId) {
      this.windows.update(windows => {
        const sourceOrder = windows[sourceId].order;
        windows[sourceId].order = windows[targetId].order;
        windows[targetId].order = sourceOrder;
        return { ...windows };
      });
    }

    this.draggingWindowId.set(null);
    this.dragOverWindowId.set(null);
  }

  initWebGL(): void {
    const canvas = this.elementRef.nativeElement.querySelector('#bg-canvas');
    if (!canvas) return;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    const particleCount = 15000;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 25;
    }

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      color: 0xf472b6,
      size: 0.05,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
    });

    this.particles = new THREE.Points(particlesGeometry, particlesMaterial);
    this.scene.add(this.particles);

    this.camera.position.z = 20;
    this.animateWebGL();
  }

  animateWebGL = () => {
    this.animationFrameId = requestAnimationFrame(this.animateWebGL);
    const elapsedTime = this.clock.getElapsedTime();

    const targetRotationX = this.mousePosition().y * 0.5;
    const targetRotationY = this.mousePosition().x * 0.5;

    if (this.particles) {
      const positions = this.particles.geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(elapsedTime * 2 + positions[i] * 0.5) * 0.002;
      }
      this.particles.geometry.attributes.position.needsUpdate = true;

      this.particles.rotation.x += (targetRotationX - this.particles.rotation.x) * 0.02;
      this.particles.rotation.y += (targetRotationY - this.particles.rotation.y) * 0.02;
      this.particles.rotation.z += 0.002;

      this.particles.material.size = 0.06 + Math.sin(elapsedTime * 3) * 0.02;
    }

    this.renderer.render(this.scene, this.camera);
  }

  onResize(): void {
    if (typeof window !== 'undefined') {
      this.isMobile.set(window.innerWidth < 768);
    }
    if (!this.camera || !this.renderer) return;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  onMouseMove(event: MouseEvent) {
    const x = (event.clientX / window.innerWidth) * 2 - 1;
    const y = -(event.clientY / window.innerHeight) * 2 + 1;
    this.mousePosition.set({ x, y });
  }
}