// Contains information specific ONLY to UI rendering.
export const FIELD_TYPES = {
  BASIC: "input-basic",
  AUTOCOMPLETE: "input-autocomplete",
  NUMBER: "input-number",
  RICH_TEXT: "rich-text",
  SELECT: "input-select",
  TEXTAREA: "input-textarea",
  DATE: "input-date",
  CHIPS_INPUT: "input-chips",
  CHIPS_SELECT: "chips-select",
  RADIO_BUTTON: "input-radio",
  CHECKBOX: "input-checkbox",
  CHECKBOX_GROUP: "input-checkbox-group",
  FORM_GROUP: "form-group",
  FORM_ARRAY: "form-array",
  PASSWORD: "input-password",
} as const;

export type FieldType = (typeof FIELD_TYPES)[keyof typeof FIELD_TYPES];

export interface FormConfig {
  disclosure_name: string;
  disclosure_type: string;
  ui: UiFormConfig;
  version_id?: string;
}

export type UiFormReferences = {
  attributes: Record<string, ReferenceAttribute>;
  validations: Record<string, ReferenceValidation>;
  validationRelations: Record<string, string[]>;
  showErrorAfterSubmit: boolean;
};

// Union type for UiFormConfig
export type UiFormConfig = UiFormConfigFormGroup | UiFormConfigFormArray;
export interface UiFormConfigFormGroup {
  type: typeof FIELD_TYPES.FORM_GROUP;
  formLabel?: string;
  references: UiFormReferences; // attributes: Record<string, ReferenceAttribute>
  paragraphs: {
    textAttributes: Record<string, ReferenceTextAttribute>;
  };
  actions?: {
    justification: Justification;
    buttons: ActionButton[];
  };
  elementsLayout: ElementLayoutData[][];
}

export interface UiFormConfigFormArray {
  type: typeof FIELD_TYPES.FORM_ARRAY;
  formLabel?: string;
  references: {
    attributes: { [key: string]: ReferenceAttribute }; // Only 1 record allowed
    validations: Record<string, ReferenceValidation>;
    validationRelations: Record<string, string[]>;
    showErrorAfterSubmit: boolean;
  };
  paragraphs: {
    textAttributes: Record<string, ReferenceTextAttribute>;
  };
  actions?: {
    justification: Justification;
    buttons: ActionButton[];
  };
  elementsLayout: ElementLayoutData[][];
}

export type Justification =
  | "justify-content-center"
  | "justify-content-around"
  | "justify-content-between"
  | "justify-content-end"
  | "justify-content-start"
  | "justify-content-evenly";

export type Color = "primary" | "accent" | "warn" | "info";

export interface ActionButton {
  label: string;
  color: Color;
  type:
    | "basic"
    | "raised"
    | "stroked"
    | "flat"
    | "icon"
    | "fab"
    | "mini-fab"
    | "extended-fab";
  icon?: string;
  runValidation?: boolean;
  nextStatus?: string;
  api?: string;
  confirmationText?: string;
  confirmBtnLabel?: string;
  cancelBtnLabel?: string;
  visibility?: AccessControls;
  tooltip?: string;
}

export interface ReferenceTextAttribute {
  id: string;
  text: string;
  visibility?: AccessControls;
}

// Types for discriminated unions
export type GetAllowedType =
  | typeof FIELD_TYPES.AUTOCOMPLETE
  | typeof FIELD_TYPES.SELECT
  | typeof FIELD_TYPES.CHIPS_SELECT
  | typeof FIELD_TYPES.RADIO_BUTTON
  | typeof FIELD_TYPES.CHECKBOX_GROUP;

export type MultipleRequiredType =
  | typeof FIELD_TYPES.AUTOCOMPLETE
  | typeof FIELD_TYPES.SELECT
  | typeof FIELD_TYPES.CHIPS_SELECT
  | typeof FIELD_TYPES.CHECKBOX_GROUP;

export type DirectionRequiredType =
  | typeof FIELD_TYPES.RADIO_BUTTON
  | typeof FIELD_TYPES.CHIPS_SELECT
  | typeof FIELD_TYPES.CHECKBOX_GROUP;

export type StaticSelectionRequiredType =
  | typeof FIELD_TYPES.AUTOCOMPLETE
  | typeof FIELD_TYPES.SELECT
  | typeof FIELD_TYPES.RADIO_BUTTON
  | typeof FIELD_TYPES.CHIPS_SELECT
  | typeof FIELD_TYPES.CHECKBOX_GROUP;

export type ReferenceAttribute =
  // input-date: dateFormat required
  | ({
      type: typeof FIELD_TYPES.DATE;
      dateFormat: string;
      direction?: DirectionType;
    } & BaseReferenceAttribute)
  | ({
      type: typeof FIELD_TYPES.FORM_GROUP;
      nestedElement: UiFormConfigFormGroup;
      direction?: DirectionType;
    } & BaseReferenceAttribute)
  | ({
      type: typeof FIELD_TYPES.FORM_ARRAY;
      nestedElement: UiFormConfigFormArray;
      direction?: DirectionType;
    } & BaseReferenceAttribute)
  | ({
      type: typeof FIELD_TYPES.RADIO_BUTTON;
      direction?: DirectionType;
      staticSelection?: StaticSelection;
      get?: GetServerRequest;
    } & BaseReferenceAttribute)
  | ({
      type: Exclude<DirectionRequiredType & MultipleRequiredType & StaticSelectionRequiredType, typeof FIELD_TYPES.RADIO_BUTTON>;
      staticSelection: StaticSelection;
      multiple: boolean;
      direction?: DirectionType;
      get?: never;
    } & BaseReferenceAttribute)
  | ({
      type: Exclude<MultipleRequiredType & StaticSelectionRequiredType, DirectionRequiredType | typeof FIELD_TYPES.RADIO_BUTTON>;
      staticSelection: StaticSelection;
      multiple: boolean;
      get?: never;
      direction?: DirectionType;
    } & BaseReferenceAttribute)
  | ({
      type: Exclude<DirectionRequiredType & MultipleRequiredType & GetAllowedType, typeof FIELD_TYPES.RADIO_BUTTON>;
      get: GetServerRequest;
      multiple: boolean;
      direction?: DirectionType;
      staticSelection?: never;
    } & BaseReferenceAttribute)
  | ({
      type: Exclude<MultipleRequiredType & GetAllowedType, DirectionRequiredType | typeof FIELD_TYPES.RADIO_BUTTON>;
      get: GetServerRequest;
      multiple: boolean;
      staticSelection?: never;
      direction?: DirectionType;
    } & BaseReferenceAttribute)
  | ({
      type: Exclude<GetAllowedType, MultipleRequiredType | typeof FIELD_TYPES.RADIO_BUTTON>;
      get: GetServerRequest;
      multiple?: never;
      direction?: DirectionType;
      staticSelection?: never;
    } & BaseReferenceAttribute)
  | ({
      type: Exclude<
        FieldType,
        typeof FIELD_TYPES.DATE | StaticSelectionRequiredType | GetAllowedType | typeof FIELD_TYPES.FORM_GROUP | typeof FIELD_TYPES.FORM_ARRAY
      >;
      staticSelection?: never;
      get?: never;
      multiple?: never;
      direction?: DirectionType;
      dateFormat?: never;
      nestedElement?: never;
    } & BaseReferenceAttribute);
export interface BaseReferenceAttribute {
  id: string;
  label: string;
  placeholder?: string;
  hint?: string;
  initialValue?: any;
  visibility?: AccessControls;
  editableLogic?: AccessControls;
  validations?: Validation[];
  // maxAllowedElementsInRow is only required for attributes in UiFormConfigFormArray,
  // and only when type is NOT FORM_GROUP or FORM_ARRAY apply condition in code
  maxAllowedElementsInRow?: number; 
}

export interface GetServerRequest {
  from: string; // The URL from which to fetch data
  mapping: {
    label: string; // The name of the property to use as the label in UI
    value?: string; // The name of the property to use as the value in UI
  };
}
export const DIRECTION = {
  HORIZONTAL: "HORIZONTAL",
  VERTICAL: "VERTICAL",
} as const;

export type DirectionType = (typeof DIRECTION)[keyof typeof DIRECTION];
export interface StaticSelection {
  options: {
    value: any;
    label: string;
  }[];
}

export interface ElementLayoutData {
  _refAttributes?: string;
  _paragraphAttributes?: string;
  header?: string;
}

// Assuming these interfaces will have further implementation details.
export interface AccessControls {
  matchAllGroup?: boolean;
  matchConditionsGroup?: boolean;
  conditionGroups?: ConditionGroup[][];
  statuses?: string[];
  userPermissions?: string[];
  userRole?: string[];
  allWaysEditable?: boolean;
  readonly?: boolean;
}

export const COMPARISON_TYPES = {
  EQUAL: "equal",
  NOT_EQUAL: "not-equal",
  REGULAR_EXPRESSION: "regex",
  CONTAINS: "contains",
  GREATER_THAN: "greater-than",
  GREATER_THAN_EQUAL_TO: "greater-than-equal-to",
  LESS_THAN: "less-than",
  LESS_THAN_EQUAL_TO: "less-than-equal-to",
  START_WITH: "start-with",
};

export type ConditionType =
  (typeof COMPARISON_TYPES)[keyof typeof COMPARISON_TYPES];
export type AttributeType = "form-attribute" | "user-attribute" | "self";
export interface ConditionGroup {
  attributeType: AttributeType;
  groupName: string;
  description: string;
  sourceAttribute?: string; // Store form attribute
  userAttribute?: string; // Store user attribute
  condition: ConditionType;
  conditionValue?: string; // provided static value to compare with current value of attribute
  conditionalAttribute?: string; // provided attribute to dynamically compare with current value of attribute
}

export interface Validation {
  _refValidation?: string;
  comparativeValidations?: AccessControls;
}

export interface ReferenceValidation {
  type: string;
  errorMessage: string;
  regex: string;
}
