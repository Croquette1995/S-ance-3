import '@angular/compiler';
import { describe, it, expect } from 'vitest';
import { AppStateService } from './services/app-state.service';

describe('AppStateService', () => {
  it('should initialize with default module mpa-vs-spa', () => {
    const service = new AppStateService();
    expect(service.activeModuleId()).toBe('mpa-vs-spa');
  });

  it('should toggle theme correctly', () => {
    const service = new AppStateService();
    expect(service.theme()).toBe('dark');
    service.toggleTheme();
    expect(service.theme()).toBe('light');
  });

  it('should track completed workshops', () => {
    const service = new AppStateService();
    expect(service.completedWorkshops().size).toBe(0);
    service.markWorkshopCompleted('3.1');
    expect(service.completedWorkshops().has('3.1')).toBe(true);
  });
});
