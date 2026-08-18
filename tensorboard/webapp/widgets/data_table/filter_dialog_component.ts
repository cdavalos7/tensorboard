/* Copyright 2023 The TensorFlow Authors. All Rights Reserved.

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
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {RangeValues} from '../range_input/types';
import {
  DiscreteFilter,
  DiscreteFilterValue,
  DomainType,
  IntervalFilter,
} from './types';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  standalone: false,
  selector: 'tb-data-table-filter',
  templateUrl: 'filter_dialog_component.ng.html',
  styleUrls: ['filter_dialog_component.css'],
})
export class FilterDialog {
  DomainType = DomainType;

  discreteValueFilter: string = '';

  @Input() filter!: DiscreteFilter | IntervalFilter;

  @Output() discreteFilterChanged = new EventEmitter<DiscreteFilterValue>();

  @Output() intervalFilterChanged = new EventEmitter<RangeValues>();

  @Output() includeUndefinedToggled = new EventEmitter<void>();

  getPossibleValues() {
    const values: DiscreteFilterValue[] =
      (this.filter as DiscreteFilter).possibleValues ?? [];
    if (!this.discreteValueFilter) {
      return values;
    }
    return values.filter((value) =>
      value.toString().match(this.discreteValueFilter)
    );
  }

  // DiscreteFilterValues is a union of arrays, so calling includes() on it
  // directly narrows the parameter to the intersection of the element types,
  // which is never. Reading it as an array of the element union keeps the same
  // runtime behaviour while giving the call a parameter it can accept.
  //
  // TODO: the cast hides that DiscreteFilterValues models a homogeneous list
  // as a union of arrays. Reshaping it to Array<DiscreteFilterValue> plus a
  // runtime invariant would let includes() type-check on its own. Deferred to
  // keep this PR to the Angular 22 bump.
  isValueSelected(value: DiscreteFilterValue): boolean {
    const filterValues = (this.filter as DiscreteFilter)
      .filterValues as DiscreteFilterValue[];
    return filterValues.includes(value);
  }

  discreteValueKeyUp(event: KeyboardEvent) {
    this.discreteValueFilter = (event.target! as HTMLInputElement).value;
  }
}
