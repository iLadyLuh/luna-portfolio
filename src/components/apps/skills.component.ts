import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SKILLS } from '../../data/portfolio.data';

@Component({
  selector: 'app-skills',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      @for (skill of skills; track skill.name) {
      <div class="flex flex-col items-center justify-center gap-2 bg-gray-900/50 hover:bg-gray-800 text-gray-400 hover:text-pink-400 py-4 px-3 rounded-md border border-gray-800 hover:border-pink-500/30 transition-all duration-300 group cursor-default">
        <img [src]="skill.icon" [alt]="skill.name" class="w-10 h-10 group-hover:scale-110 transition-transform duration-300">
        <span class="text-xs font-mono font-bold">{{ skill.name }}</span>
      </div>
      }
    </div>
  `
})
export class SkillsComponent {
  skills = SKILLS;
}
