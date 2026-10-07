import { Component } from '@angular/core';
import { BoardComponent } from './board/board.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BoardComponent],
  template: `<app-board></app-board>`,
  styles: [`:host { display: block; height: 100%; }`]
})
export class AppComponent {}
