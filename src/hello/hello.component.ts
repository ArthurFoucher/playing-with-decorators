import {
  Component,
  Input,
  OnChanges,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';

type WatchTuple = [string, (e: SimpleChange) => void];

interface Watch {
  watchers: WatchTuple[];
  originalOnChanges(changes: SimpleChanges): void;
}

type Watched<U> = U & Watch

const watchComponent = <U extends Partial<Watch & OnChanges>>(target: U): Watched<U> => {
  const returnValue = target as Watched<U>;
  returnValue.watchers = target.watchers ?? [];
  returnValue.originalOnChanges = target.originalOnChanges ?? target.ngOnChanges ?? function () {};
  return returnValue;
};

const fromChange = <K extends string, T>(
  key: K,
) => <U extends string,
  T extends Partial<OnChanges> & { [key in K]: unknown } & { [key in U]: (e: SimpleChange) => void }>(
  componentInstance: T,
  propertyKey: U,
) => {
  const watchedTarget = watchComponent(componentInstance);
  watchedTarget.watchers.push([key, watchedTarget[propertyKey]]);

  watchedTarget.ngOnChanges = (changes) => {
    watchedTarget.originalOnChanges(changes);
    watchedTarget.watchers.forEach(([key, fn]) => {
      if (changes[key]) { fn(changes[key]); }
    });
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
  @Input() name = '';
  @Input() count = 0;

  @fromChange('name')
  onNameChanged(e: SimpleChange) {
    console.log('data changed to', e.currentValue);
  }

  @fromChange('count')
  onCountChanged(e: SimpleChange) {
    console.log('count changed to', e.currentValue);
  }
}
