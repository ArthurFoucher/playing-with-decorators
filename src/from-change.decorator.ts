import { OnChanges, SimpleChange, SimpleChanges } from '@angular/core';

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

export const fromChange = <K extends string, T>(
  key: K,
) => <U extends string,
  T extends Partial<OnChanges> & { [key in K]: unknown } & { [key in U]: (e: SimpleChange) => void }>(
  componentInstance: T,
  propertyKey: U,
) => {
  const watchedTarget = watchComponent(componentInstance);
  watchedTarget.watchers.push([key, watchedTarget[propertyKey]]);

  /*
   * We need to use a `function` to pass the instance scope to the decorated function
   */
  watchedTarget.ngOnChanges = function (changes) {
    watchedTarget.originalOnChanges(changes);
    watchedTarget.watchers.forEach(([key, fn]) => {
      if (changes[key]) { fn.call(this, changes[key]); }
    });
  };
};
