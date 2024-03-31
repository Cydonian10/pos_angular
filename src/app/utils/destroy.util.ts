import { DestroyRef, inject } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

export function onDestroyed() {
  const subject = new Subject();

  inject(DestroyRef).onDestroy(() => {
    subject.next('');
    subject.complete();
  });

  return <T>() => takeUntil<T>(subject.asObservable());
}
