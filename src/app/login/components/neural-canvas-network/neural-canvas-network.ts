import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, ViewChild } from '@angular/core';

type NeuralNode = {
  children: number[];
  end: boolean;
  size: number;
  x: number;
  y: number;
  z: number;
};

type DataPulse = {
  from: number;
  progress: number;
  speed: number;
  to: number;
};

type ScreenPoint = {
  scale: number;
  x: number;
  y: number;
  z: number;
};

@Component({
  selector: 'app-neural-canvas-network',
  styleUrl: './neural-canvas-network.scss',
  templateUrl: './neural-canvas-network.html',
})
export class NeuralCanvasNetwork implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) private readonly canvasRef!: ElementRef<HTMLCanvasElement>;

  private animationFrame = 0;
  private readonly dataPulses: DataPulse[] = [];
  private readonly nodes: NeuralNode[] = [];
  private resizeObserver?: ResizeObserver;
  private tick = 0;

  constructor(private readonly zone: NgZone) {}

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      const canvas = this.canvasRef.nativeElement;
      const context = this.context(canvas);

      if (!context) {
        return;
      }

      this.generateNetwork();
      this.seedPulses();
      this.resize(canvas, context);

      this.resizeObserver = new ResizeObserver(() => this.resize(canvas, context));
      this.resizeObserver.observe(canvas);
      this.animationFrame = requestAnimationFrame(() => this.draw(canvas, context));
    });
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationFrame);
    this.resizeObserver?.disconnect();
  }

  private context(canvas: HTMLCanvasElement): CanvasRenderingContext2D | null {
    if (navigator.userAgent.toLowerCase().includes('jsdom')) {
      return null;
    }

    try {
      return canvas.getContext('2d');
    } catch {
      return null;
    }
  }

  private draw(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D): void {
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const angleX = Math.sin(this.tick * 0.004) * 0.55;
    const angleY = this.tick * 0.003;
    const projected = this.nodes.map((node) =>
      this.project(node, angleX, angleY, centerX, centerY, Math.min(width, height)),
    );

    context.fillStyle = 'rgba(5, 5, 7, 0.2)';
    context.fillRect(0, 0, width, height);
    context.lineCap = 'round';

    this.drawConnections(context, projected);
    this.drawNodes(context, projected);
    this.drawPulses(context, projected);

    this.tick += 1;
    this.animationFrame = requestAnimationFrame(() => this.draw(canvas, context));
  }

  private drawConnections(context: CanvasRenderingContext2D, projected: ScreenPoint[]): void {
    for (let index = 0; index < this.nodes.length; index += 1) {
      const parent = projected[index];
      const node = this.nodes[index];

      for (const childIndex of node.children) {
        const child = projected[childIndex];
        const alpha = Math.max(0.028, 0.115 - (parent.z + child.z) * 0.00014);

        context.strokeStyle = `rgba(199, 210, 254, ${alpha})`;
        context.lineWidth = Math.max(0.34, parent.scale * node.size * 0.09);
        context.beginPath();
        context.moveTo(parent.x, parent.y);
        context.lineTo(child.x, child.y);
        context.stroke();
      }
    }
  }

  private drawNodes(context: CanvasRenderingContext2D, projected: ScreenPoint[]): void {
    for (let index = 0; index < this.nodes.length; index += 1) {
      const node = this.nodes[index];
      const point = projected[index];
      const glow = 0.1 + Math.sin(this.tick * 0.035 + index) * 0.045;
      const hue = index === 0 ? '255, 150, 150' : node.end ? '118, 255, 210' : '160, 190, 255';

      context.fillStyle = `rgba(${hue}, ${Math.max(0.035, glow)})`;
      context.beginPath();
      context.arc(point.x, point.y, Math.max(0.7, point.scale * node.size), 0, Math.PI * 2);
      context.fill();
    }
  }

  private drawPulses(context: CanvasRenderingContext2D, projected: ScreenPoint[]): void {
    for (const pulse of this.dataPulses) {
      const from = projected[pulse.from];
      const to = projected[pulse.to];
      const x = from.x + (to.x - from.x) * pulse.progress;
      const y = from.y + (to.y - from.y) * pulse.progress;

      context.strokeStyle = 'rgba(255, 208, 112, 0.38)';
      context.lineWidth = 1.8;
      context.shadowColor = 'rgba(255, 208, 112, 0.4)';
      context.shadowBlur = 12;
      context.beginPath();
      context.moveTo(from.x + (x - from.x) * 0.55, from.y + (y - from.y) * 0.55);
      context.lineTo(x, y);
      context.stroke();
      context.shadowBlur = 0;

      pulse.progress += pulse.speed;
      if (pulse.progress >= 1) {
        this.advancePulse(pulse);
      }
    }
  }

  private advancePulse(pulse: DataPulse): void {
    const current = this.nodes[pulse.to];

    if (!current.children.length) {
      pulse.from = 0;
      pulse.to = this.nodes[0].children[0] ?? 0;
      pulse.progress = 0;
      return;
    }

    pulse.from = pulse.to;
    pulse.to = current.children[Math.floor(Math.random() * current.children.length)];
    pulse.progress = 0;
  }

  private generateNetwork(): void {
    this.nodes.length = 0;
    this.nodes.push({ children: [], end: false, size: 5.4, x: 0, y: 0, z: 0 });

    const queue = [0];
    const maxNodes = 92;
    const allowedDistance = 38;

    while (queue.length && this.nodes.length < maxNodes) {
      const parentIndex = queue.shift() ?? 0;
      const parent = this.nodes[parentIndex];
      const childCount = parent.size < 1.3 ? 0 : 2 + Math.floor(Math.random() * 3);

      for (let attempt = 0; attempt < 70 && parent.children.length < childCount; attempt += 1) {
        const candidate = this.candidate(parent, parent.size);
        const insideRange = candidate.x ** 2 + candidate.y ** 2 + candidate.z ** 2 < 225 ** 2;
        const spaced = this.nodes.every(
          (node) => this.distanceSquared(node, candidate) > allowedDistance ** 2,
        );

        if (!insideRange || !spaced || this.nodes.length >= maxNodes) {
          continue;
        }

        const childIndex = this.nodes.length;
        this.nodes.push({ ...candidate, children: [], end: false, size: parent.size * 0.72 });
        parent.children.push(childIndex);
        queue.push(childIndex);
      }

      parent.end = parent.children.length === 0;
    }
  }

  private candidate(
    parent: NeuralNode,
    size: number,
  ): Omit<NeuralNode, 'children' | 'end' | 'size'> {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const distance = 42 + Math.random() * 42 + (5 - size) * 2.4;

    return {
      x: parent.x + distance * Math.sin(phi) * Math.cos(theta),
      y: parent.y + distance * Math.sin(phi) * Math.sin(theta),
      z: parent.z + distance * Math.cos(phi),
    };
  }

  private distanceSquared(
    a: Pick<NeuralNode, 'x' | 'y' | 'z'>,
    b: Pick<NeuralNode, 'x' | 'y' | 'z'>,
  ): number {
    return (a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2;
  }

  private project(
    node: Pick<NeuralNode, 'x' | 'y' | 'z'>,
    angleX: number,
    angleY: number,
    centerX: number,
    centerY: number,
    size: number,
  ): ScreenPoint {
    const cosX = Math.cos(angleX);
    const sinX = Math.sin(angleX);
    const cosY = Math.cos(angleY);
    const sinY = Math.sin(angleY);
    const y = node.y * cosX - node.z * sinX;
    let z = node.z * cosX + node.y * sinX;
    const x = node.x * cosY + z * sinY;

    z = z * cosY - node.x * sinY;

    const depth = 340;
    const focal = size * 0.82;
    const scale = focal / (z + depth);

    return {
      scale,
      x: centerX + x * scale,
      y: centerY + y * scale,
      z,
    };
  }

  private resize(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D): void {
    const rect = canvas.getBoundingClientRect();
    const pixelRatio = window.devicePixelRatio || 1;
    const width = Math.max(1, Math.floor(rect.width * pixelRatio));
    const height = Math.max(1, Math.floor(rect.height * pixelRatio));

    canvas.width = width;
    canvas.height = height;
  }

  private seedPulses(): void {
    this.dataPulses.length = 0;

    for (let index = 0; index < 8; index += 1) {
      this.dataPulses.push({
        from: 0,
        progress: Math.random(),
        speed: 0.028 + Math.random() * 0.018,
        to: this.nodes[0].children[index % this.nodes[0].children.length] ?? 0,
      });
    }
  }
}
