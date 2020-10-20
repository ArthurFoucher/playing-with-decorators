import { Component, Input, OnChanges, SimpleChange } from '@angular/core';

const fromChange = <K extends string>(
  key: K,
) => <U extends string,
  T extends Partial<OnChanges> & { [key in K]: unknown } & { [key in U]: (e: SimpleChange) => void }>(
  target: T,
  propertyKey: U,
) => {
  const originalOnChanges = target.ngOnChanges;

  const callback = target[propertyKey];
  target['ngOnChanges'] = changes => {
    if (originalOnChanges) {
      originalOnChanges(changes);
    }
    if (changes[key]) {
      callback(changes[key]);
    }
  };
};

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
  @Input() name: string = '';
  @Input() count = 0;

  @fromChange('name')
  onNameChanged(e: SimpleChange) {
    console.log('name changed to', e.currentValue);
  }

  @fromChange('count')
  onCountChanged(e: SimpleChange) {
    console.log('count changed to', e.currentValue);
  }
}
