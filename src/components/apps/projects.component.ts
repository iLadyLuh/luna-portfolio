import { Component, ChangeDetectionStrategy, signal, OnInit } from '@angular/core';

@Component({
  selector: 'app-projects',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (loading()) {
      <div class="flex flex-col items-center justify-center h-full w-full gap-4 opacity-70">
        <div class="w-8 h-8 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin"></div>
        <span class="text-pink-400 font-mono text-xs uppercase tracking-widest animate-pulse">Fetching from GitHub...</span>
      </div>
    } @else if (error()) {
      <div class="flex items-center justify-center h-full w-full">
        <span class="text-red-500 font-mono text-sm bg-red-900/20 px-4 py-2 rounded border border-red-900/50">{{ error() }}</span>
      </div>
    } @else {
      <div class="grid grid-cols-1 xl:grid-cols-2 gap-4">
        @for (project of projects(); track project.title) {
        <a [href]="project.url" target="_blank" rel="noopener noreferrer" class="group relative bg-gray-900/40 border border-gray-800 rounded-lg p-5 flex flex-col hover:border-pink-500/50 hover:bg-gray-900/80 transition-all duration-300 overflow-hidden cursor-pointer">
          <div class="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <svg class="w-5 h-5 text-gray-500 group-hover:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
            </svg>
          </div>

          <div class="mb-3">
            <h4 class="text-lg font-bold text-gray-100 group-hover:text-pink-400 transition-colors">{{ project.title }}</h4>
            <div class="flex items-center gap-2 mt-1">
              <p class="text-[10px] uppercase tracking-wider text-gray-500 flex items-center gap-1">
                <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"></path>
                </svg>
                {{ project.type }}
              </p>
              @if (project.stars > 0) {
                <span class="text-[10px] text-yellow-500/80 flex items-center gap-0.5">
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                  {{ project.stars }}
                </span>
              }
            </div>
          </div>

          <p class="text-gray-400 text-sm leading-relaxed mb-4 flex-grow line-clamp-3">{{ project.desc || 'No description provided.' }}</p>

          <div class="flex flex-wrap gap-2 mt-auto">
            @for (tech of project.tech; track tech) {
            <span class="text-[10px] font-mono text-pink-300/80 bg-pink-900/10 border border-pink-500/10 px-2 py-1 rounded">{{ tech }}</span>
            }
          </div>
        </a>
        }
      </div>
    }
  `
})
export class ProjectsComponent implements OnInit {
  projects = signal<any[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  async ngOnInit() {
    try {
      // Fetch public repos from user 'iLadyLuh'
      const response = await fetch('https://api.github.com/users/iLadyLuh/repos?sort=updated&per_page=12');
      if (!response.ok) {
        throw new Error('Falha ao buscar repositórios da GitHub API');
      }
      
      const repos = await response.json();
      
      const mappedProjects = repos
        .filter((repo: any) => !repo.fork)
        .map((repo: any) => ({
          title: repo.name,
          type: repo.language || 'Repository',
          desc: repo.description,
          url: repo.html_url,
          stars: repo.stargazers_count,
          // Use topics if available, fallback to language
          tech: repo.topics && repo.topics.length > 0 
            ? repo.topics 
            : (repo.language ? [repo.language] : [])
        }));

      this.projects.set(mappedProjects);
      this.loading.set(false);
    } catch (err: any) {
      this.error.set(err.message || 'Ocorreu um erro desconhecido.');
      this.loading.set(false);
    }
  }
}
