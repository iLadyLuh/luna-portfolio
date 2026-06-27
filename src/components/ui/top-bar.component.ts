import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="fixed top-0 left-0 right-0 z-[10000] bg-black/80 backdrop-blur-md border-b border-pink-500/20 flex-shrink-0 h-10 md:h-12 shadow-[0_0_15px_rgba(236,72,153,0.1)]">
      <div class="w-full h-full px-4 flex items-center justify-between">
        <div class="font-mono text-xs md:text-sm text-pink-400/90 flex items-center gap-4">
          <div class="flex items-center gap-2">
            <span class="text-purple-500">➜</span>
            <span>{{ activeWindowTitle }}</span>
          </div>

          <div *ngIf="isPoetryEnabled" class="hidden md:flex items-center bg-gray-900/80 rounded border border-gray-800 p-0.5 ml-4">
            <button (click)="setWorkspace.emit('dev')" class="px-2 py-0.5 text-[10px] font-bold transition-all rounded"
              [class.bg-pink-500]="currentWorkspace === 'dev'" [class.text-black]="currentWorkspace === 'dev'"
              [class.text-gray-500]="currentWorkspace !== 'dev'">DEV</button>
            <button (click)="setWorkspace.emit('poetry')" class="px-2 py-0.5 text-[10px] font-bold transition-all rounded"
              [class.bg-purple-500]="currentWorkspace === 'poetry'"
              [class.text-black]="currentWorkspace === 'poetry'"
              [class.text-gray-500]="currentWorkspace !== 'poetry'">POEMS</button>
          </div>
        </div>

        <div class="flex items-center space-x-1 bg-gray-900/50 p-1 rounded border border-gray-800 overflow-x-auto max-w-[70vw] md:max-w-none scrollbar-hide">
          <ng-container *ngIf="currentWorkspace === 'dev'">
            @for (id of devWindows; track id) {
            <button (click)="toggleWindow.emit(id)"
              class="group relative px-3 py-1.5 md:px-3 md:py-1 text-[10px] md:text-xs font-mono rounded-sm transition-all duration-200 flex-shrink-0"
              [class.text-pink-400]="windows[id]?.isOpen" [class.bg-pink-500/10]="windows[id]?.isOpen"
              [class.text-gray-500]="!windows[id]?.isOpen" [class.hover:text-gray-300]="!windows[id]?.isOpen">
              {{ id }}
              @if(windows[id]?.isOpen) {
              <span class="absolute -bottom-[6px] left-1/2 -translate-x-1/2 w-1 h-1 bg-pink-500 rounded-full shadow-[0_0_5px_#ec4899]"></span>
              }
            </button>
            }
          </ng-container>

          <ng-container *ngIf="currentWorkspace === 'poetry'">
            <button (click)="toggleWindow.emit('explorer')"
              class="group relative px-3 py-1.5 md:px-3 md:py-1 text-[10px] md:text-xs font-mono rounded-sm transition-all duration-200 flex-shrink-0"
              [class.text-purple-400]="windows['explorer']?.isOpen"
              [class.bg-purple-500/10]="windows['explorer']?.isOpen"
              [class.text-gray-500]="!windows['explorer']?.isOpen"
              [class.hover:text-gray-300]="!windows['explorer']?.isOpen">
              explorer
              @if(windows['explorer']?.isOpen) {
              <span class="absolute -bottom-[6px] left-1/2 -translate-x-1/2 w-1 h-1 bg-purple-500 rounded-full shadow-[0_0_5px_#a855f7]"></span>
              }
            </button>

            @for (item of Object.entries(windows); track item[0]) {
            @if (item[0].startsWith('poem-') && item[1].isOpen) {
            <button (click)="focusWindow.emit(item[0])"
              class="group relative px-2 py-0.5 md:px-3 md:py-1 text-[10px] md:text-xs font-mono rounded-sm transition-all duration-200 flex-shrink-0"
              [class.text-purple-400]="activeWindowId === item[0]"
              [class.bg-purple-500/10]="activeWindowId === item[0]"
              [class.text-gray-500]="activeWindowId !== item[0]">
              {{ item[1].title.replace('.txt', '') }}
              @if(activeWindowId === item[0]) {
              <span class="absolute -bottom-[6px] left-1/2 -translate-x-1/2 w-1 h-1 bg-purple-500 rounded-full shadow-[0_0_5px_#a855f7]"></span>
              }
            </button>
            }
            }
          </ng-container>

          <div class="w-[1px] h-4 bg-gray-800 mx-2 flex-shrink-0"></div>
          <div class="font-mono text-xs text-purple-400/90 px-2 min-w-[50px] text-center flex-shrink-0">
            {{ currentTime }}
          </div>
        </div>
      </div>
    </header>
  `
})
export class TopBarComponent {
  @Input() activeWindowTitle = 'Desktop';
  @Input() isPoetryEnabled = false;
  @Input() currentWorkspace = 'dev';
  @Input() windows: any = {};
  @Input() activeWindowId: string | null = null;
  @Input() currentTime = '';

  @Output() setWorkspace = new EventEmitter<'dev' | 'poetry'>();
  @Output() toggleWindow = new EventEmitter<string>();
  @Output() focusWindow = new EventEmitter<string>();

  devWindows = ['about', 'projects', 'fetch', 'skills', 'contact', 'snake', 'htop', 'cmatrix'];
  Object = Object;
}
