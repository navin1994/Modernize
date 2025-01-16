import { Component, Input, OnInit, signal } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { MatCardModule } from "@angular/material/card";
import { FieldSelectorComponent } from '../field-selector/field-selector.component';
import { AccessControls, AttributeType, ConditionGroup, ElementLayoutData, FormConfig } from 'src/app/models/ui-form-config.interface';
import { EDITABLE_LOGIC, UNSAVED, VISIBILITY } from 'src/app/models/constants';
import { areObjectsEqual, isBoolean, isEmptyArray, toBoolean } from 'src/app/utility/utility';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-layout',
  standalone: true,
  imports: [CommonModule, MatCardModule, FieldSelectorComponent],
  templateUrl: './form-layout.component.html',
  styleUrl: './form-layout.component.scss'
})

export class FormLayoutComponent implements OnInit {
  @Input({ required: true }) formGroup: UntypedFormGroup;
  @Input({ required: true }) config!: FormConfig;
  @Input() status = UNSAVED;
  
  // Signals for visibility layers and previous form value
  visibleLayers = signal<ElementLayoutData[][]>([]);
  previousValues = signal({});

  ngOnInit(): void {
    this.visibleLayers.set(this.config.ui.elementsLayout);
    this.updateAccessControl();
  }

  updateAccessControl(): void {
    if (areObjectsEqual(this.previousValues(), this.formGroup.getRawValue())) return;
    this.previousValues.set(this.formGroup.getRawValue());
    let layers = this.config.ui.elementsLayout;
    const { attributes } = this.config.ui.references;

    for (const id in attributes) {
      const isNotVisible = this.computeAccessControl(VISIBILITY, attributes, id);
      const isEditable = this.computeAccessControl(EDITABLE_LOGIC, attributes, id);
      if (isNotVisible) layers = this.removeAttributeAndCleanup(layers, id);
      if (isEditable) this.formGroup.get(id)?.enable();
    }
    this.visibleLayers.update(()=> [...layers]);
  }

  removeAttributeAndCleanup(arr: ElementLayoutData[][], attribute: string) {
    const cleanedArray = arr.reduce((acc, innerArray) => {
      const filteredArray = innerArray.filter(item => {
        if (item._refAttributes && item._refAttributes === attribute) {
          this.formGroup.get(attribute)?.setValue('');
          this.formGroup.get(attribute)?.setErrors(null);
          return false; // Filter out this item
        }
        return true; // Keep the item
      });
      // Only add the inner array if it has elements left
      if (filteredArray.length > 0) {
        acc.push(filteredArray);
      }
      return acc;
    }, [] as ElementLayoutData[][]);
    return cleanedArray;
  }

  computeAccessControl(checkType: string, attributes: any, id: string): boolean {
    const data = this.formGroup.getRawValue(); 
    const isExist = checkType in attributes[id];
    if (!isExist) return false;

    const { matchAllGroup, matchConditionsGroup, conditionGroups, statuses, userPermissions, userRole, allWaysEditable, readonly } = attributes[id][checkType] as AccessControls;

    if (statuses && !statuses.includes(this.status)) return true;
    if (userPermissions && !userPermissions.includes('read')) return true;
    if (userRole && !userRole.includes('compliance')) return true;
    if (conditionGroups && !isEmptyArray(conditionGroups)) {
      const mainFunc = matchAllGroup ? 'every' : 'some';
      const groupFunc = matchConditionsGroup ? 'every' : 'some';
      return !conditionGroups[mainFunc]((groupArray) => {
        return !!groupArray?.length && groupArray[groupFunc]((group: ConditionGroup) => {
          if (group.attributeType === ('form-attribute' as AttributeType) && group?.sourceAttribute) {
            let currentValue = data[group.sourceAttribute]?.toString() ?? '';
            currentValue = isBoolean(currentValue) ? toBoolean(currentValue) : currentValue;
            const conditionValue = isBoolean(group.conditionValue) ? toBoolean(group.conditionValue) : group.conditionValue;
            switch (group.condition) {
              case 'equal':
                return currentValue == conditionValue;
              case 'not-equal':
                return currentValue != conditionValue;
              case 'regex':
                const regex = new RegExp(group.conditionValue);
                return regex.test(currentValue);
              case 'contains':
                return currentValue?.includes(group.conditionValue);
              case 'start-with':
                return currentValue?.startsWith(group.conditionValue);
              case 'greater-than':
                return Number(data[group.sourceAttribute]) > Number(group.conditionValue);
              case 'less-than':
                return Number(data[group.sourceAttribute]) < Number(group.conditionValue);
            }
          } else if (group.attributeType === ('user-attribute' as AttributeType) && group?.sourceAttribute) {
            // Implementation pending
            return false;
          } else {
            return false;
          }
        });
      });
    }
    return false;
  }

  isLayerVisible(layer: ElementLayoutData[]): boolean {
    return !!layer.find((element) => this.visibleLayers()?.flat()?.includes(element));
  }

  isShown(element: ElementLayoutData): boolean {
    return this.visibleLayers()?.flat()?.includes(element);
  }
}