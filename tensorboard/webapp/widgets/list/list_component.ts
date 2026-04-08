/* Copyright 2024 The TensorFlow Authors. All Rights Reserved.

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
import {Component, EventEmitter, Input, Output} from '@angular/core';

export interface ListItem {
  value: any;
  label: string;
  disabled?: boolean;
}

/**
 * A generic list component that displays items and supports single selection.
 */
@Component({
  standalone: false,
  selector: 'tb-list',
  template: `
    <mat-list role="list">
      <mat-list-item
        *ngFor="let item of items"
        role="listitem"
        class="list-item"
        [class.selected]="item.value === selectedValue"
        [class.disabled]="item.disabled"
        (click)="onItemClick(item)"
      >
        <span matListItemTitle>{{ item.label }}</span>
      </mat-list-item>
    </mat-list>
  `,
  styleUrls: [`list_component.css`],
})
export class ListComponent {
  @Input() items: ListItem[] = [];
  @Input() selectedValue: any = null;

  @Output() selectedValueChange = new EventEmitter<any>();

  onItemClick(item: ListItem): void {
    if (!item.disabled) {
      this.selectedValueChange.emit(item.value);
    }
  }
}
