import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-css-encapsulation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './css-encapsulation.component.html',
  styleUrl: './css-encapsulation.component.css'
})
export class CssEncapsulationComponent {
  childColor = signal<string>('purple');
  childFontStyle = signal<'italic' | 'normal'>('italic');

  parentAttribute = '_ngcontent-ng-c98765432';
  childAttribute = '_ngcontent-ng-c12345678';

  toggleChildColor() {
    this.childColor.update(c => c === 'purple' ? '#38bdf8' : 'purple');
  }

  toggleChildStyle() {
    this.childFontStyle.update(s => s === 'italic' ? 'normal' : 'italic');
  }
}
