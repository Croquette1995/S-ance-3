import { Injectable, signal, effect } from '@angular/core';

export type ThemeMode = 'dark' | 'light';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly STORAGE_KEY = 'ts_lab_theme_mode_v9';
  readonly theme = signal<ThemeMode>('dark');

  constructor() {
    if (typeof localStorage !== 'undefined') {
      const savedTheme = localStorage.getItem(this.STORAGE_KEY) as ThemeMode;
      if (savedTheme === 'light' || savedTheme === 'dark') {
        this.theme.set(savedTheme);
      }
    }

    effect(() => {
      const currentTheme = this.theme();
      if (typeof document !== 'undefined') {
        const root = document.documentElement;
        root.setAttribute('data-theme', currentTheme);
        document.body.classList.remove('theme-dark', 'theme-light');
        document.body.classList.add(`theme-${currentTheme}`);
      }
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.STORAGE_KEY, currentTheme);
      }
    });
  }

  toggleTheme(): void {
    this.theme.update(t => (t === 'dark' ? 'light' : 'dark'));
  }
}
