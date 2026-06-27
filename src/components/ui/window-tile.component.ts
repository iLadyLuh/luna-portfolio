import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-window-tile',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [id]="window.id"
      class="window-tile relative w-full h-full bg-[#0a0a10]/90 backdrop-blur-xl border border-gray-800/80 rounded-lg shadow-2xl flex flex-col overflow-hidden"
      [class.border-pink-500/50]="isActive"
      [class.shadow-[0_0_30px_rgba(236,72,153,0.15)]]="isActive"
      [class.z-20]="isActive" [class.z-10]="!isActive"
      [class.opacity-50]="isDragging" [class.scale-[0.98]]="isDragging"
      (mousedown)="focus.emit()">

      <!-- Window Header -->
      <div class="flex items-center px-3 h-9 bg-black/40 border-b border-white/5 select-none flex-shrink-0"
        [class.bg-gradient-to-r]="isActive"
        [class.from-pink-900/10]="isActive" [class.to-transparent]="isActive">

        <div (mousedown)="dragStart.emit($event)" class="flex-1 flex items-center cursor-move h-full">
          <span class="font-mono text-[10px] md:text-xs tracking-wide uppercase font-bold"
            [class.text-pink-400]="isActive" [class.text-gray-600]="!isActive">
            {{ window.title }}
          </span>
        </div>

        <!-- Linux-style window controls -->
        <div class="flex items-center gap-1">
          <button class="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-white hover:bg-gray-700/50 rounded transition-all">
            <span class="text-lg leading-none mb-1">−</span>
          </button>
          <button class="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-white hover:bg-gray-700/50 rounded transition-all">
            <span class="text-xs">□</span>
          </button>
          <button (click)="close.emit($event)" class="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-white hover:bg-red-500/80 rounded transition-all">
            <span class="text-sm">✕</span>
          </button>
        </div>
      </div>

      <!-- Internal Content -->
      <ng-content></ng-content>

      <!-- Drag Over Overlay -->
      @if (isDragOver && !isDragging) {
      <div class="absolute inset-0 bg-pink-500/20 backdrop-blur-[1px] z-50 flex items-center justify-center border-2 border-pink-500 animate-pulse">
        <span class="font-mono text-pink-300 font-bold text-xl bg-black/50 px-4 py-2 rounded">SWAP</span>
      </div>
      }
    </div>
  `
})
export class WindowTileComponent {
  @Input() window!: any;
  @Input() isActive = false;
  @Input() isDragging = false;
  @Input() isDragOver = false;

  @Output() focus = new EventEmitter<void>();
  @Output() dragStart = new EventEmitter<MouseEvent>();
  @Output() close = new EventEmitter<MouseEvent>();
}
