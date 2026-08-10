/* Copyright 2020 The TensorFlow Authors. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
==============================================================================*/
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {map, skip, startWith} from 'rxjs/operators';
import {State} from '../../../app_state';
import {getEnableGlobalPins} from '../../../selectors';
import {DeepReadonly} from '../../../util/types';
import {metricsClearAllPinnedCards} from '../../actions';
import {getLastPinnedCardTime, getPinnedCardsWithMetadata} from '../../store';
import {CardObserver} from '../card_renderer/card_lazy_loader';
import {CardIdWithMetadata} from '../metrics_view_types';

@Component({
  standalone: false,
  selector: 'metrics-pinned-view',
  template: `
    <metrics-pinned-view-component
      [cardIdsWithMetadata]="(cardIdsWithMetadata$ | async)!"
      [lastPinnedCardTime]="(lastPinnedCardTime$ | async)!"
      [cardObserver]="cardObserver"
      [globalPinsEnabled]="(globalPinsEnabled$ | async)!"
      (onClearAllPinsClicked)="onClearAllPinsClicked()"
    ></metrics-pinned-view-component>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PinnedViewContainer {
  @Input() cardObserver!: CardObserver;

  constructor(private readonly store: Store<State>) {
    this.cardIdsWithMetadata$ = this.store
      .select(getPinnedCardsWithMetadata)
      .pipe(
        // The selector hands back a readonly array. Nothing downstream mutates
        // it, and propagating readonly would reach every component under
        // metrics-card-grid, so the shape is widened once here.
        map((cards) => cards as DeepReadonly<CardIdWithMetadata>[]),
        startWith([] as DeepReadonly<CardIdWithMetadata>[])
      );
    this.lastPinnedCardTime$ = this.store.select(getLastPinnedCardTime).pipe(
      // Ignore the first value on component load, only reacting to new
      // pins after page load.
      skip(1)
    );
    this.globalPinsEnabled$ = this.store.select(getEnableGlobalPins);
  }

  // Matches filtered_view_container: DeepReadonly applies to the element,
  // not to the array, which would otherwise make it immutable.
  readonly cardIdsWithMetadata$: Observable<DeepReadonly<CardIdWithMetadata>[]>;

  readonly lastPinnedCardTime$;

  readonly globalPinsEnabled$;

  onClearAllPinsClicked() {
    this.store.dispatch(metricsClearAllPinnedCards());
  }
}
