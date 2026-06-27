import { Component, ChangeDetectionStrategy } from '@angular/core';
import { PROJECTS } from '../../data/portfolio.data';

@Component({
  selector: 'app-projects',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-4">
      @for (project of projects; track project.title) {
      <a [href]="project.url" target="_blank" rel="noopener noreferrer" class="group relative bg-gray-900/40 border border-gray-800 rounded-lg p-5 flex flex-col hover:border-pink-500/50 hover:bg-gray-900/80 transition-all duration-300 overflow-hidden cursor-pointer">
        <div class="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <svg class="w-5 h-5 text-gray-500 group-hover:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
          </svg>
        </div>

        <div class="mb-3">
          <h4 class="text-lg font-bold text-gray-100 group-hover:text-pink-400 transition-colors">{{ project.title }}</h4>
          <p class="text-[10px] uppercase tracking-wider text-gray-500">{{ project.type }}</p>
        </div>

        <p class="text-gray-400 text-sm leading-relaxed mb-4 flex-grow">{{ project.desc }}</p>

        <div class="flex flex-wrap gap-2 mt-auto">
          @for (tech of project.tech; track tech) {
          <span class="text-[10px] font-mono text-pink-300/80 bg-pink-900/10 border border-pink-500/10 px-2 py-1 rounded">{{ tech }}</span>
          }
        </div>
      </a>
      }
    </div>
  `
})
export class ProjectsComponent {
  projects = PROJECTS;
}
