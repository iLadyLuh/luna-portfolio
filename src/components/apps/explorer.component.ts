import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { POEMS } from '../../data/portfolio.data';

@Component({
  selector: 'app-explorer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-4 md:p-8">
      <div class="flex items-center gap-3 mb-8 border-b border-gray-800 pb-4">
        <div class="p-2 transition-all hover:scale-110 bg-purple-500/10 rounded border border-purple-500/30">
          <svg class="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>
          </svg>
        </div>
        <div>
          <h3 class="text-white font-bold tracking-tight">Luna's poems</h3>
          <p class="text-[10px] text-gray-500 font-mono uppercase tracking-widest">{{ poems.length }} items • archive_v2.lfs</p>
        </div>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        @for (poem of poems; track poem.id) {
        <div (click)="openPoem.emit(poem.id)" class="group flex flex-col items-center p-4 rounded-lg border border-transparent hover:border-purple-500/30 hover:bg-purple-500/5 transition-all cursor-pointer">
          <div class="relative mb-3">
            <svg class="w-12 h-12 text-gray-700 group-hover:text-purple-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M13,9V3.5L18.5,9H13Z" />
            </svg>
          </div>
          <span class="text-xs text-gray-400 group-hover:text-white font-mono text-center line-clamp-2">{{ poem.title }}.txt</span>
        </div>
        }
      </div>
    </div>
  `
})
export class ExplorerComponent {
  poems = POEMS;
  @Output() openPoem = new EventEmitter<string>();
}
