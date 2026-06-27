import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { TRANSLATIONS, SOCIALS } from '../../data/portfolio.data';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-contact',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col items-center justify-center h-full text-center space-y-8">
      <div class="relative">
        <div class="absolute -inset-4 bg-pink-500/20 rounded-full blur-xl animate-pulse"></div>
        <div class="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center relative z-10 border border-gray-700">
          <svg class="w-8 h-8 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
          </svg>
        </div>
      </div>

      <div>
        <h3 class="text-xl font-bold text-white mb-2">{{ t.contactTitle }}</h3>
        <p class="text-gray-400 max-w-sm mx-auto text-sm">
          {{ t.contactText }}
        </p>
      </div>

      <a href="mailto:{{email}}" class="relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-mono font-medium tracking-tighter text-white bg-gray-800 rounded-lg group">
        <span class="absolute w-0 h-0 transition-all duration-500 ease-out bg-pink-600 rounded-full group-hover:w-56 group-hover:h-56"></span>
        <span class="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-gray-700"></span>
        <span class="relative">{{email}}</span>
      </a>

      <div class="flex gap-4">
        @for (social of socials; track social.name) {
        <a [href]="social.url" [title]="social.name" class="p-2 text-gray-500 hover:text-pink-400 transition-colors border border-transparent hover:border-gray-800 rounded-md">
          <span [innerHTML]="getSafeIcon(social.icon)"></span>
        </a>
        }
      </div>
    </div>
  `
})
export class ContactComponent {
  @Input() email = 'contact@ladyluh.dev';
  t = TRANSLATIONS;
  socials = SOCIALS;

  constructor(private sanitizer: DomSanitizer) {}

  getSafeIcon(icon: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(icon);
  }
}
