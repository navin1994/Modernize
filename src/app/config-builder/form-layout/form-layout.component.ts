import { ChangeDetectionStrategy, Component, DoCheck, Input, OnInit, signal } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { MatCardModule } from "@angular/material/card";
import { FieldSelectorComponent } from '../field-selector/field-selector.component';
import { AccessControls, AttributeType, COMPARISON_TYPES, ConditionGroup, ElementLayoutData, FormConfig } from 'src/app/models/ui-form-config.interface';
import { EDITABLE_LOGIC, UNSAVED, VISIBILITY } from 'src/app/models/constants';
import { areObjectsEqual, isBoolean, isEmptyArray, isNumeric, isObject, toBoolean } from 'src/app/utility/utility';
import { CommonModule } from '@angular/common';
import { TextElementComponent } from './form-elements/text-element/text-element.component';

@Component({
  selector: 'app-form-layout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatCardModule, FieldSelectorComponent, TextElementComponent],
  templateUrl: './form-layout.component.html',
  styleUrl: './form-layout.component.scss'
})

export class FormLayoutComponent implements OnInit, DoCheck {
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

  ngDoCheck(): void {
    // console.log("=========================START=================================")
    //   Object.entries(this.formGroup.controls).forEach(([key, value]) => {
    //     console.log('from layout=> ', key, ":", value.disabled)
    //   })
    // console.log("=========================END=================================")
    
  }

  updateAccessControl(): void {
    if (areObjectsEqual(this.previousValues(), this.formGroup.getRawValue())) return;
    if (this.status !== UNSAVED) this.formGroup.disable();
    this.previousValues.set(this.formGroup.getRawValue());
    let layers = this.config.ui.elementsLayout;
    const { attributes } = this.config.ui.references;
    const { textAttributes } = this.config.ui.paragraphs;

    for (const id in attributes) {
      const isNotVisible = this.computeAccessControl(VISIBILITY, attributes, id);
      const isEditable = !this.computeAccessControl(EDITABLE_LOGIC, attributes, id);
      if (isNotVisible) layers = this.removeAttributeAndCleanup(layers, id);
      if (isEditable) this.formGroup.get(id)?.enable();
    }
    for (const id in textAttributes) {
      const isNotVisible = this.computeAccessControl(VISIBILITY, textAttributes, id);
      if (isNotVisible) layers = this.removeAttributeAndCleanup(layers, id);
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
        } else if (item._paragraphAttributes && item._paragraphAttributes === attribute) {
          return false; // Filter out this text paragraph
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
    if (!isExist) {
      return this.checkTypeValue(checkType);
    }

    const { matchAllGroup, matchConditionsGroup, conditionGroups, statuses, userPermissions, userRole, allWaysEditable, readonly } = attributes[id][checkType] as AccessControls;

    if (readonly) {
      this.formGroup.get(id)?.disable();
      return true;
    }
    if (allWaysEditable) return false;
    if (statuses && !statuses.includes(this.status)) return true;
    if (userPermissions && !userPermissions.includes('read')) return true;
    if (userRole && !userRole.includes('compliance')) return true;
    if (conditionGroups && !isEmptyArray(conditionGroups)) {
      const mainFunc = matchAllGroup ? 'every' : 'some';
      const groupFunc = matchConditionsGroup ? 'every' : 'some';
      return !conditionGroups[mainFunc]((groupArray) => {
        return !!groupArray?.length && groupArray[groupFunc]((group: ConditionGroup) => {
          if (group.attributeType === ('form-attribute' as AttributeType) && group?.sourceAttribute) {
            const currentValue = this.getDataByType(data[group.sourceAttribute], group.sourceAttribute);
            const conditionValue = this.getDataByType(group.conditionValue);
            switch (group.condition) {
              case COMPARISON_TYPES.EQUAL:
                return currentValue == conditionValue;
              case COMPARISON_TYPES.NOT_EQUAL:
                return currentValue != conditionValue;
              case COMPARISON_TYPES.REGULAR_EXPRESSION:
                const regex = new RegExp(group.conditionValue);
                return regex.test(currentValue);
              case COMPARISON_TYPES.CONTAINS:
                return currentValue?.includes(group.conditionValue);
              case COMPARISON_TYPES.START_WITH:
                return currentValue?.startsWith(group.conditionValue,1);
              case COMPARISON_TYPES.GREATER_THAN:
                return Number(currentValue) > Number(conditionValue);
              case COMPARISON_TYPES.LESS_THAN:
                return Number(currentValue) < Number(conditionValue);
            }
          } else if (group.attributeType === ('user-attribute' as AttributeType) && group?.sourceAttribute) {
            // Implementation pending
            this.checkTypeValue(checkType);
          } else {
            this.checkTypeValue(checkType);
          }
        });
      });
    }
    return false;
  }

  checkTypeValue(checkType: string): boolean {
    if (checkType === VISIBILITY) {
      return false;
    } else if (checkType === EDITABLE_LOGIC) {
      return true;
    }
    return false;
  }

  getDataByType(data: any, sourceAttribute?: string): any {
    if (data == null || data == undefined || data == '') return '';
    if (isBoolean(data)) return toBoolean(data);
    if (isNumeric(data)) return data;
    if (isObject(data) && sourceAttribute) {
      const attributeConfig = this.config.ui.references.attributes[sourceAttribute];
      let valueKey = 'value';
      if (attributeConfig?.get) {
        valueKey = attributeConfig.get.mapping.value;
      }
      return this.getDataByType(data[valueKey]);
    }
    return JSON.stringify(data);
  }

  isLayerVisible(layer: ElementLayoutData[]): boolean {
    return !!layer.find((element) => this.visibleLayers()?.flat()?.includes(element));
  }

}