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
import {CommonModule} from '@angular/common';
import {Component, Input} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MatListModule} from '@angular/material/list';
import {By} from '@angular/platform-browser';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {ListComponent, ListItem} from './list_component';

@Component({
  standalone: false,
  selector: 'testing-component',
  template: `
    <tb-list
      [items]="items"
      [selectedValue]="selectedValue"
      (selectedValueChange)="onSelectedValueChange($event)"
    ></tb-list>
  `,
})
class TestableComponent {
  @Input() items: ListItem[] = [];
  @Input() selectedValue: any = null;
  @Input() onSelectedValueChange!: (value: any) => void;
}

describe('tb-list', () => {
  let selectionChangeSpy: jasmine.Spy;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, MatListModule, NoopAnimationsModule],
      declarations: [ListComponent, TestableComponent],
    }).compileComponents();
  });

  function createFixture(input: {
    items?: ListItem[];
    selectedValue?: any;
  }): ComponentFixture<TestableComponent> {
    const fixture = TestBed.createComponent(TestableComponent);
    fixture.componentInstance.items = input.items ?? [];
    fixture.componentInstance.selectedValue = input.selectedValue ?? null;
    selectionChangeSpy = jasmine.createSpy();
    fixture.componentInstance.onSelectedValueChange = selectionChangeSpy;
    return fixture;
  }

  it('renders a list of items', () => {
    const fixture = createFixture({
      items: [
        {value: 'a', label: 'Item A'},
        {value: 'b', label: 'Item B'},
      ],
    });
    fixture.detectChanges();

    const listItems = fixture.debugElement.queryAll(By.css('.list-item'));
    expect(listItems.length).toBe(2);
    expect(listItems[0].nativeElement.textContent).toContain('Item A');
    expect(listItems[1].nativeElement.textContent).toContain('Item B');
  });

  it('marks the selected item with the selected class', () => {
    const fixture = createFixture({
      items: [
        {value: 'a', label: 'Item A'},
        {value: 'b', label: 'Item B'},
      ],
      selectedValue: 'b',
    });
    fixture.detectChanges();

    const listItems = fixture.debugElement.queryAll(By.css('.list-item'));
    expect(listItems[0].nativeElement.classList).not.toContain('selected');
    expect(listItems[1].nativeElement.classList).toContain('selected');
  });

  it('emits selectedValueChange when an item is clicked', () => {
    const fixture = createFixture({
      items: [{value: 'a', label: 'Item A'}],
    });
    fixture.detectChanges();

    const listItem = fixture.debugElement.query(By.css('.list-item'));
    listItem.nativeElement.click();
    fixture.detectChanges();

    expect(selectionChangeSpy).toHaveBeenCalledOnceWith('a');
  });

  it('does not emit selectedValueChange when a disabled item is clicked', () => {
    const fixture = createFixture({
      items: [{value: 'a', label: 'Item A', disabled: true}],
    });
    fixture.detectChanges();

    const listItem = fixture.debugElement.query(By.css('.list-item'));
    listItem.nativeElement.click();
    fixture.detectChanges();

    expect(selectionChangeSpy).not.toHaveBeenCalled();
  });

  it('adds the disabled class to disabled items', () => {
    const fixture = createFixture({
      items: [
        {value: 'a', label: 'Item A', disabled: true},
        {value: 'b', label: 'Item B'},
      ],
    });
    fixture.detectChanges();

    const listItems = fixture.debugElement.queryAll(By.css('.list-item'));
    expect(listItems[0].nativeElement.classList).toContain('disabled');
    expect(listItems[1].nativeElement.classList).not.toContain('disabled');
  });

  it('renders an empty list when no items are provided', () => {
    const fixture = createFixture({items: []});
    fixture.detectChanges();

    const listItems = fixture.debugElement.queryAll(By.css('.list-item'));
    expect(listItems.length).toBe(0);
  });
});
