import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NeuralCanvasNetwork } from '../neural-canvas-network/neural-canvas-network';

@Component({
  imports: [MatIconModule, NeuralCanvasNetwork],
  selector: 'app-login-hero',
  styleUrl: './login-hero.scss',
  templateUrl: './login-hero.html',
})
export class LoginHero {}
