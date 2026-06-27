import { Component, ChangeDetectionStrategy, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-cmatrix',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <canvas #cmatrixCanvas class="w-full h-full block"></canvas>
  `
})
export class CmatrixComponent implements AfterViewInit, OnDestroy {
  @ViewChild('cmatrixCanvas') cmatrixCanvas!: ElementRef<HTMLCanvasElement>;
  private cmatrixIntervalId: any = null;
  private cmatrixObserver: ResizeObserver | null = null;

  ngAfterViewInit() {
    this.startCMatrixAnimation(this.cmatrixCanvas.nativeElement);
  }

  ngOnDestroy() {
    if (this.cmatrixIntervalId) {
      clearInterval(this.cmatrixIntervalId);
    }
    if (this.cmatrixObserver) {
      this.cmatrixObserver.disconnect();
    }
  }

  startCMatrixAnimation(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}';
    const fontSize = 16;
    let columns = 0;
    let drops: number[] = [];

    const setupState = () => {
      const newWidth = canvas.offsetWidth;
      const newHeight = canvas.offsetHeight;

      if (newWidth === 0 || newHeight === 0) return;

      if (canvas.width !== newWidth || canvas.height !== newHeight) {
        canvas.width = newWidth;
        canvas.height = newHeight;

        const newColumns = Math.floor(canvas.width / fontSize);
        if (newColumns !== columns) {
          const oldColumns = columns;
          columns = newColumns;
          if (columns > oldColumns) {
            for (let i = oldColumns; i < columns; i++) {
              drops[i] = Math.floor(Math.random() * canvas.height / fontSize);
            }
          } else {
            drops.length = columns;
          }
        }
      }
    };

    const draw = () => {
      if (!ctx || canvas.width === 0 || canvas.height === 0) return;
      ctx.fillStyle = 'rgba(10, 5, 10, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#f472b6'; // pink
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    setTimeout(() => {
      requestAnimationFrame(() => {
        setupState();
        if (!this.cmatrixIntervalId) {
          this.cmatrixIntervalId = setInterval(draw, 33);
        }
      });
    }, 50);

    if (this.cmatrixObserver) {
      this.cmatrixObserver.disconnect();
    }
    this.cmatrixObserver = new ResizeObserver(() => {
      requestAnimationFrame(setupState);
    });
    this.cmatrixObserver.observe(canvas);
  }
}
