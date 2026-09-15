import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DesignTweaksService } from './core/services/design-tweaks.service';
import { TweaksPanel } from './layout/tweaks-panel/tweaks-panel';

@Component({
  host: {
    '[attr.data-accent]': 'designTweaks.accent()',
    '[attr.data-theme]': 'designTweaks.theme()',
    '[attr.data-type]': 'designTweaks.type()',
  },
  imports: [RouterOutlet, TweaksPanel],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  readonly designTweaks = inject(DesignTweaksService);
}
