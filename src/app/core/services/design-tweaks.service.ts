import { Injectable, signal } from '@angular/core';
import { AccentOption, ThemeOption, TypeOption } from '../models/design-tweaks.model';

@Injectable({ providedIn: 'root' })
export class DesignTweaksService {
  readonly theme = signal<ThemeOption>('light');
  readonly accent = signal<AccentOption>('indigo');
  readonly type = signal<TypeOption>('expressive');

  setTheme(theme: ThemeOption): void {
    this.theme.set(theme);
  }

  setAccent(accent: AccentOption): void {
    this.accent.set(accent);
  }

  setType(type: TypeOption): void {
    this.type.set(type);
  }
}
