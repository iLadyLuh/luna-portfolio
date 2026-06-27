import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TRANSLATIONS } from '../../data/portfolio.data';

@Component({
  selector: 'app-about',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="prose prose-invert prose-sm md:prose-base max-w-none font-sans text-gray-300">
      <p class="leading-7">
        {{ t.aboutIntro }}
      </p>
      <blockquote class="border-l-4 border-pink-500 pl-4 italic text-gray-500 my-6">
        {{ t.aboutQuote }}
      </blockquote>
    </div>
  `
})
export class AboutComponent {
  t = TRANSLATIONS;
}
