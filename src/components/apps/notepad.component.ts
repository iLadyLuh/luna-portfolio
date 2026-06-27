import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Poem } from '../../data/portfolio.data';

@Component({
  selector: 'app-notepad',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (poem) {
    <div class="max-w-2xl mx-auto py-8 px-4 font-serif text-black leading-relaxed">
      <div class="mb-12 border-b border-gray-200 pb-4">
        <h1 class="text-4xl font-light mb-2">{{ poem.title }}</h1>
      </div>

      <div class="whitespace-pre-line text-lg md:text-xl text-gray-800">
        {{ poem.content }}
      </div>

      <div class="mt-20 flex justify-center text-gray-300">
        <span class="text-2xl">❧</span>
      </div>
    </div>
    }
  `
})
export class NotepadComponent {
  @Input() poem?: Poem;
}
