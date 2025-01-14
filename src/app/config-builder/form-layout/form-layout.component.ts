import { Component, computed, Input, input } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { MatCardModule } from "@angular/material/card";
import { FieldSelectorComponent } from '../field-selector/field-selector.component';
import { AccessControls, AttributeType, ConditionGroup, FormConfig, ReferenceAttribute } from 'src/app/models/ui-form-config.interface';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-form-layout',
  standalone: true,
  imports: [MatCardModule, FieldSelectorComponent],
  templateUrl: './form-layout.component.html',
  styleUrl: './form-layout.component.scss'
})
export class FormLayoutComponent {
  config = input.required<FormConfig>();
  @Input() formGroup?: UntypedFormGroup;
  // currentValues = toSignal()
  visibleLayers = computed(() =>{ 
    this.formGroup?.valueChanges.pipe(debounceTime(300)).subscribe((formData) => {
      const { attributes } = this.config().ui.references;
      for (const id in attributes) {
       const result = this.computeAccessControl('visibility', attributes, id, formData);
       console.log('result', result);
      }
    });
    return this.config().ui.elementsLayout;
  });

  computeAccessControl(checkType: string, attributes: any, id: string, data: Record<string, any>): boolean {
    if (checkType in attributes[id]) {
      const { matchAllGroup, matchConditionsGroup, conditionGroups } = attributes[id].visibility as AccessControls;
      const mainFunc = matchAllGroup ? 'every' : 'some';
      const groupFunc = matchConditionsGroup ? 'every' : 'some';
      return conditionGroups?.[mainFunc]((groupArray) => {
        return groupArray?.[groupFunc]((group: ConditionGroup)=> {
          if (group.attributeType === ('form-attribute' as AttributeType) && group?.sourceAttribute) {
            switch (group.condition) {
              case 'equal':
                return data[group.sourceAttribute]?.toString() === group.conditionValue;
              case 'not-equal':
                return data[group.sourceAttribute]?.toString() !== group.conditionValue;
              case 'regex':
                const regex = new RegExp(group.conditionValue);
                return regex.test(data[group.sourceAttribute]?.toString());
              case 'contains':
                return data[group.sourceAttribute]?.toString()?.includes(group.conditionValue?.toString());
              case 'start-with':
                return data[group.sourceAttribute]?.toString()?.startsWith(group.conditionValue?.toString());
              case 'greater-than':
                return Number(data[group.sourceAttribute]) > Number(group.conditionValue);
              case 'less-than':
                return Number(data[group.sourceAttribute]) < Number(group.conditionValue);
            }
          } else if (group.attributeType === ('form-attribute' as AttributeType)) {
            return true;
          } else {
            return true;
          }
        });
      });
    }
    return false;
  }
}
