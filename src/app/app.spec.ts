import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';
import { DesignTweaksService } from './core/services/design-tweaks.service';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes)],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the dashboard route', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);

    await router.navigateByUrl('/dashboard');
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Good morning, Tobias');
    expect(compiled.textContent).toContain('Demo Company A');
    expect(compiled.querySelectorAll('app-dashboard-project-card').length).toBe(5);
    expect(compiled.querySelector('app-tweaks-panel')).not.toBeNull();
  });

  it('should render the login route', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);

    await router.navigateByUrl('/login');
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('app-login-page')).not.toBeNull();
    expect(compiled.querySelector('app-tweaks-panel')).not.toBeNull();
    expect(compiled.textContent).toContain('Welcome back');
    expect(compiled.textContent).not.toContain('Good morning, Tobias');
  });

  it('should expose design tweaks on the app host', () => {
    const fixture = TestBed.createComponent(App);
    const designTweaks = TestBed.inject(DesignTweaksService);

    designTweaks.setTheme('dark');
    designTweaks.setAccent('emerald');
    designTweaks.setType('editorial');
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    expect(host.getAttribute('data-theme')).toBe('dark');
    expect(host.getAttribute('data-accent')).toBe('emerald');
    expect(host.getAttribute('data-type')).toBe('editorial');
  });

  it('should not render the standalone demo navigation in the dashboard topbar', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);

    await router.navigateByUrl('/dashboard');
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const buttonLabels = Array.from(compiled.querySelectorAll('.topbar button')).map((button) =>
      button.textContent?.trim(),
    );

    expect(compiled.querySelector('[aria-label="Demo navigation"]')).toBeNull();
    expect(buttonLabels).not.toContain('Login');
    expect(buttonLabels).not.toContain('Dashboard');
    expect(buttonLabels).not.toContain('Project');
  });
});
