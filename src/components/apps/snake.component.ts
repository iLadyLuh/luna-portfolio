import { Component, ChangeDetectionStrategy, HostListener, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-snake',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col items-center justify-center h-full gap-4 p-4">
      <div class="relative bg-black border-2 border-gray-800 p-1 shadow-[0_0_20px_rgba(0,0,0,0.8)]">
        <div class="grid grid-cols-[repeat(20,15px)] grid-rows-[repeat(20,15px)] gap-[1px] bg-gray-900">
          @for (cell of [].constructor(400); track $index) {
          @let x = $index % 20;
          @let y = getFloor($index / 20);

          <div class="w-full h-full" [class.bg-green-500]="isSnakeHead(x, y)" [class.bg-green-700]="isSnakeBody(x, y)"
            [class.bg-red-500]="isFood(x, y)"
            [class.bg-gray-800]="!isFood(x, y) && !isSnakeHead(x, y) && !isSnakeBody(x, y)">
          </div>
          }
        </div>

        <!-- Scanline overlay -->
        <div class="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none z-10">
        </div>
      </div>

      <div class="flex gap-4 items-center">
        <button (click)="isSnakePlaying() ? stopSnake() : startSnake()"
          class="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-xs font-mono text-white rounded border border-pink-400 transition-colors">
          {{ isSnakePlaying() ? 'PAUSE' : 'START GAME' }}
        </button>
        <div class="text-xs font-mono text-gray-500">Use Arrow Keys</div>
      </div>
    </div>
  `
})
export class SnakeComponent implements OnDestroy {
  snakeInterval: any;
  snake = signal<{ x: number, y: number }[]>([{ x: 5, y: 5 }]);
  food = signal<{ x: number, y: number }>({ x: 10, y: 10 });
  direction = signal<{ x: number, y: number }>({ x: 1, y: 0 });
  isSnakePlaying = signal(false);
  directionLocked = signal(false);

  getFloor(val: number): number {
    return Math.floor(val);
  }

  ngOnDestroy() {
    this.stopSnake();
  }

  startSnake() {
    if (this.isSnakePlaying()) return;
    this.isSnakePlaying.set(true);
    this.snakeInterval = setInterval(() => this.updateSnake(), 150);
  }

  stopSnake() {
    clearInterval(this.snakeInterval);
    this.isSnakePlaying.set(false);
  }

  updateSnake() {
    this.directionLocked.set(false);
    const head = this.snake()[0];
    const newHead = { x: head.x + this.direction().x, y: head.y + this.direction().y };

    if (newHead.x < 0) newHead.x = 19;
    if (newHead.x > 19) newHead.x = 0;
    if (newHead.y < 0) newHead.y = 19;
    if (newHead.y > 19) newHead.y = 0;

    if (this.snake().some(s => s.x === newHead.x && s.y === newHead.y)) {
      this.snake.set([{ x: 5, y: 5 }]);
      this.direction.set({ x: 1, y: 0 });
      return;
    }

    const newSnake = [newHead, ...this.snake()];

    if (newHead.x === this.food().x && newHead.y === this.food().y) {
      this.spawnFood(newSnake);
    } else {
      newSnake.pop();
    }
    this.snake.set(newSnake);
  }

  changeSnakeDirection(dir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') {
    if (this.directionLocked()) return;
    const current = this.direction();
    let changed = false;
    switch (dir) {
      case 'UP': if (current.y !== 1) { this.direction.set({ x: 0, y: -1 }); changed = true; } break;
      case 'DOWN': if (current.y !== -1) { this.direction.set({ x: 0, y: 1 }); changed = true; } break;
      case 'LEFT': if (current.x !== 1) { this.direction.set({ x: -1, y: 0 }); changed = true; } break;
      case 'RIGHT': if (current.x !== -1) { this.direction.set({ x: 1, y: 0 }); changed = true; } break;
    }
    if (changed) this.directionLocked.set(true);
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'ArrowUp') this.changeSnakeDirection('UP');
    if (event.key === 'ArrowDown') this.changeSnakeDirection('DOWN');
    if (event.key === 'ArrowLeft') this.changeSnakeDirection('LEFT');
    if (event.key === 'ArrowRight') this.changeSnakeDirection('RIGHT');
  }

  isSnakeHead(x: number, y: number): boolean {
    const head = this.snake()[0];
    return head.x === x && head.y === y;
  }

  isSnakeBody(x: number, y: number): boolean {
    return this.snake().slice(1).some(s => s.x === x && s.y === y);
  }

  isFood(x: number, y: number): boolean {
    return this.food().x === x && this.food().y === y;
  }

  spawnFood(snakeBody: { x: number, y: number }[]): void {
    let newFood: { x: number, y: number };
    do {
      newFood = {
        x: Math.floor(Math.random() * 20),
        y: Math.floor(Math.random() * 20)
      };
    } while (snakeBody.some(s => s.x === newFood.x && s.y === newFood.y));
    this.food.set(newFood);
  }
}
