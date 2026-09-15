import { Component, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AccentOption, ThemeOption, TypeOption } from '../../core/models/design-tweaks.model';
import { DesignTweaksService } from '../../core/services/design-tweaks.service';

type AccentSwatch = {
  color: string;
  label: string;
  value: AccentOption;
};

type TypeChoice = {
  label: string;
  value: TypeOption;
};

@Component({
  imports: [MatIconModule],
  selector: 'app-tweaks-panel',
  styleUrl: './tweaks-panel.scss',
  templateUrl: './tweaks-panel.html',
})
export class TweaksPanel {
  readonly designTweaks = inject(DesignTweaksService);
  readonly open = signal(false);
  readonly themes: ThemeOption[] = ['light', 'dark'];
  readonly types: TypeChoice[] = [
    { label: 'expressive', value: 'expressive' },
    { label: 'calm', value: 'calm' },
    { label: 'editorial', value: 'editorial' },
  ];
  readonly accents: AccentSwatch[] = [
    { color: 'var(--pb-accent-indigo)', label: 'Indigo', value: 'indigo' },
    { color: 'var(--pb-accent-violet)', label: 'Violet', value: 'violet' },
    { color: 'var(--pb-accent-emerald)', label: 'Emerald', value: 'emerald' },
    { color: 'var(--pb-accent-amber)', label: 'Amber', value: 'amber' },
    { color: 'var(--pb-accent-graphite)', label: 'Graphite', value: 'graphite' },
  ];

  close(): void {
    this.open.set(false);
  }

  toggle(): void {
    this.open.update((open) => !open);
  }
}
