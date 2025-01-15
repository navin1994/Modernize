import { Component, Input, input, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { MatCardModule } from "@angular/material/card";
import { FieldSelectorComponent } from '../field-selector/field-selector.component';
import { AccessControls, AttributeType, ConditionGroup, ElementLayoutData, FormConfig } from 'src/app/models/ui-form-config.interface';
import { debounceTime} from 'rxjs/operators';
import { areObjectsEqual } from 'src/app/utility/utility';

@Component({
  selector: 'app-form-layout',
  standalone: true,
  imports: [MatCardModule, FieldSelectorComponent],
  templateUrl: './form-layout.component.html',
  styleUrl: './form-layout.component.scss'
})
export class FormLayoutComponent implements OnInit{
  config = input.required<FormConfig>();
  @Input() formGroup: UntypedFormGroup = new UntypedFormGroup({});
  visibleLayers: ElementLayoutData[][];
  previousFormValue: Record<string, any>;

  ngOnInit(): void {
    this.visibleLayers = this.config().ui.elementsLayout;
    this.formGroup.valueChanges.pipe(debounceTime(500)).subscribe((formData) => {
      if (areObjectsEqual(formData, this.previousFormValue)) return;
      this.previousFormValue = formData;
      let layers: ElementLayoutData[][] = this.config().ui.elementsLayout;
      const { attributes } = this.config().ui.references;
      for (const id in attributes) {
        const result = !this.computeAccessControl('visibility', attributes, id, formData);
        if (result) {
          layers = this.removeAttributeAndCleanup(layers, id);
        }
      }
      this.visibleLayers = layers;
    });
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

  computeAccessControl(checkType: string, attributes: any, id: string, data: Record<string, any>): boolean {
    const isExist = checkType in attributes[id]
    if (!isExist) return true;
      const { matchAllGroup, matchConditionsGroup, conditionGroups } = attributes[id].visibility as AccessControls;
      const mainFunc = matchAllGroup ? 'every' : 'some';
      const groupFunc = matchConditionsGroup ? 'every' : 'some';
      return conditionGroups?.[mainFunc]((groupArray) => {
        return groupArray?.[groupFunc]((group: ConditionGroup)=> {
          if (group.attributeType === ('form-attribute' as AttributeType) && group?.sourceAttribute) {
            const currentValue = data[group.sourceAttribute]?.toString() ?? 'false';
            switch (group.condition) {
              case 'equal':
                return currentValue == group.conditionValue;
              case 'not-equal':
                return currentValue != group.conditionValue;
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
          } else {
            return true;
          }
        });
      });
  }
}
