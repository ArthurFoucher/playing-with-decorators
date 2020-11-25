import { Component, Input, SimpleChange } from '@angular/core';
import { fromChange } from '../from-change.decorator';

@Component({
  selector: 'hello',
  template: `
      <h1>{{ name }}</h1>
      <div>count: {{ count }}</div>
  `,
  styles: [`
      h1 {
          font-family: Lato, sans-serif;
      }
  `,
  ],
})
export class HelloComponent {
  @Input() name = '';
  @Input() count = 0;

  private innerCounter = 0;

  @fromChange('name')
  onNameChanged(e: SimpleChange) {
    console.log(
      'data changed to',
      e.currentValue,
      'while innerCounter is',
      this.innerCounter,
    );

    this.increaseInnerCounter();
  }

  @fromChange('count')
  onCountChanged(e: SimpleChange) {
    console.log('count changed to', e.currentValue);
    this.increaseInnerCounter();
  }

  private increaseInnerCounter() {
    this.innerCounter += 1;
  }
}
