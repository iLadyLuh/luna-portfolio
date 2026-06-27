import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-fetch',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col md:flex-row gap-6 md:gap-5 items-center md:items-start h-full justify-center md:justify-start">
      <div class="relative flex-shrink-0 font-mono text-[5px] md:text-lg text-pink-500/80 overflow-visible">
        <pre class="leading-none select-none">
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣤⣤⣄⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⣴⣿⠟⠛⠛⠛⠿⣿⣿⣿⣿⣶⣤⡀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⣠⣴⣿⡟⠁⢀⣤⣀⠀⠀⠀⠀⠀⠀⠉⠻⣿⣦⠀⠀⠀⠀
⠀⠀⠀⠀⣾⡿⠿⠛⠁⣰⣿⣿⣿⡆⠀⠀⣴⣶⣶⠄⠀⢻⣿⡄⠀⠀⠀
⠀⠀⣾⡿⠁⠀⠀⠀⠀⠻⣿⣿⣿⠃⠀⣼⣿⣿⣿⠀⠀⠀⢿⣷⣄⠀⠀
⠀⣾⣿⠁⠀⣤⣶⡄⠀⠀⠈⠉⠁⠀⠀⠈⠛⠊⠁⠀⠀⠀⠀⠙⢿⣷⠀
⠀⣿⡇⠀⢸⣿⣿⡿⡆⠀⠀⣴⣶⣶⣴⣶⣄⠀⠀⢠⣶⣿⣦⠀⠀⣿⡇
⠀⣿⡇⠀⠀⠛⠙⠉⠀⣰⣿⣿⣿⣿⣿⣿⣿⣇⠀⣿⣿⣿⣿⠀⠀⣿⡇
⠀⣿⣇⠀⠀⠀⠀⢀⣾⣿⣿⣿⣿⣿⣿⣷⣿⣷⡀⠀⠉⠉⠀⠀⣸⣿⠇
⠀⣿⣿⠀⠀⠀⠀⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⣻⡟⠘
⠀⢹⣿⠀⠀⠀⠀⠀⠉⠛⠉⠁⠉⠁⠙⠻⠿⠟⠀⠀⠀⠀⠀⣾⣿⠁⠀
⠀⠀⣿⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⡏⠀⠀
⠀⠀⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⡇⠀⠀
⠀⠀⣻⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⡇⠀⠀
⠀⠀⢸⣿⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⡇⠀⠀
        </pre>
      </div>

      <div class="font-mono text-sm space-y-3 w-full max-w-md">
        <div>
          <h2 class="text-2xl font-bold text-gray-100 flex items-center gap-2">
            {{ developerName }}
            <span class="text-xs bg-pink-500/10 text-pink-400 border border-pink-500/20 px-1.5 py-0.5 rounded">v1.0.0</span>
          </h2>
          <p class="text-purple-400 text-xs mt-1">{{ "@" }}system_admin</p>
        </div>

        <div class="h-[1px] w-full bg-gray-800 my-4"></div>

        <div class="grid grid-cols-[80px_1fr] gap-y-2 text-xs md:text-sm">
          <span class="text-pink-500 font-bold">OS</span> <span class="text-gray-400">Arch Linux x86_64</span>
          <span class="text-pink-500 font-bold">Host</span> <span class="text-gray-400">portifolio</span>
          <span class="text-pink-500 font-bold">Kernel</span> <span class="text-gray-400">Linux</span>
          <span class="text-pink-500 font-bold">Uptime</span> <span class="text-gray-400">{{ currentTime }}</span>
          <span class="text-pink-500 font-bold">Shell</span> <span class="text-gray-400">zsh 5.9</span>
          <span class="text-pink-500 font-bold">Theme</span> <span class="text-gray-400">Cyberpunk_Pink</span>
          <span class="text-pink-500 font-bold">Font</span> <span class="text-gray-400">JetBrains Mono</span>
        </div>

        <div class="flex gap-2 mt-4 pt-2">
          <div class="w-3 h-3 bg-black"></div>
          <div class="w-3 h-3 bg-red-500"></div>
          <div class="w-3 h-3 bg-green-500"></div>
          <div class="w-3 h-3 bg-yellow-500"></div>
          <div class="w-3 h-3 bg-blue-500"></div>
          <div class="w-3 h-3 bg-purple-500"></div>
          <div class="w-3 h-3 bg-cyan-500"></div>
          <div class="w-3 h-3 bg-gray-300"></div>
        </div>
      </div>
    </div>
  `
})
export class FetchComponent {
  @Input() developerName = 'Luna T. G.';
  @Input() currentTime = '';
}
