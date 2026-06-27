import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, OnInit, OnDestroy, signal } from '@angular/core';

@Component({
  selector: 'app-htop',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="w-full h-full p-3 overflow-auto text-[11px] leading-relaxed">
      <!-- CPU Bars -->
      <div class="mb-3">
        @for (cpu of cpuValues(); track $index; let i = $index) {
        <div class="flex items-center gap-2 mb-1">
          <span class="text-cyan-400 w-4">{{ i + 1 }}</span>
          <div class="flex-1 h-2 bg-gray-800 rounded overflow-hidden">
            <div class="h-full transition-all duration-300" [class.bg-green-500]="cpu < 50"
              [class.bg-yellow-500]="cpu >= 50 && cpu < 80" [class.bg-red-500]="cpu >= 80" [style.width.%]="cpu"></div>
          </div>
          <span class="text-white w-12 text-right" [class.text-red-400]="cpu >= 80"
            [class.text-yellow-400]="cpu >= 50 && cpu < 80">{{ cpu }}.{{ getFloor(getMathRandom() * 10) }}%</span>
        </div>
        }
      </div>

      <!-- Memory -->
      <div class="flex items-center gap-2 mb-1">
        <span class="text-green-400">Mem</span>
        <div class="flex-1 h-2 bg-gray-800 rounded overflow-hidden">
          <div class="h-full bg-gradient-to-r from-green-600 via-blue-500 to-yellow-500 transition-all duration-300"
            [style.width.%]="memoryValue()"></div>
        </div>
        <span class="text-white text-[10px]">{{ (memoryValue() * 0.16).toFixed(1) }}G/16G</span>
      </div>
      <div class="flex items-center gap-2 mb-3">
        <span class="text-green-400">Swp</span>
        <div class="flex-1 h-2 bg-gray-800 rounded overflow-hidden">
          <div class="h-full bg-yellow-600 transition-all duration-300" [style.width.%]="8 + getMathRandom() * 5"></div>
        </div>
        <span class="text-white text-[10px]">0.8G/8.0G</span>
      </div>

      <!-- Process List -->
      <div class="border-t border-gray-700 pt-2">
        <div class="flex text-gray-500 mb-1 border-b border-gray-800 pb-1">
          <span class="w-12">PID</span>
          <span class="flex-1">COMMAND</span>
          <span class="w-10">CPU%</span>
          <span class="w-16 text-right">ACTION</span>
        </div>
        @for (win of openWindows; track win.id; let i = $index) {
        <div class="flex items-center text-green-400 hover:bg-gray-800/50 py-0.5 group">
          <span class="w-12 text-cyan-400">{{ 1000 + i * 111 }}</span>
          <span class="flex-1 text-white truncate">{{ win.title }}</span>
          <span class="w-10" [class.text-red-400]="cpuValues()[i % 4] > 70">{{ cpuValues()[i % 4] }}.{{ i }}</span>
          <button (click)="killWindow.emit($event)" (mousedown)="dispatchClose(win.id)"
            class="w-16 text-right text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity font-bold">
            KILL
          </button>
        </div>
        }
      </div>
    </div>
  `
})
export class HtopComponent implements OnInit, OnDestroy {
  @Input() openWindows: any[] = [];
  @Output() killWindow = new EventEmitter<MouseEvent>();
  @Output() closeWindowId = new EventEmitter<string>();

  cpuValues = signal([67, 45, 23, 89]);
  memoryValue = signal(72);
  private htopInterval?: any;

  ngOnInit() {
    this.htopInterval = setInterval(() => this.updateHtopValues(), 800);
  }

  ngOnDestroy() {
    if (this.htopInterval) clearInterval(this.htopInterval);
  }

  getMathRandom() {
    return Math.random();
  }

  getFloor(num: number) {
    return Math.floor(num);
  }

  updateHtopValues() {
    const current = this.cpuValues();
    this.cpuValues.set(current.map(val => {
      const delta = Math.floor(Math.random() * 10) - 5;
      return Math.max(5, Math.min(95, val + delta));
    }));

    const memDelta = Math.floor(Math.random() * 6) - 3;
    this.memoryValue.set(Math.max(50, Math.min(90, this.memoryValue() + memDelta)));
  }

  dispatchClose(id: string) {
    this.closeWindowId.emit(id);
  }
}
