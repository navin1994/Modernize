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
  PASSWORD: "input-password",
} as const;

export type FieldType = (typeof FIELD_TYPES)[keyof typeof FIELD_TYPES];

export interface FormConfig {
  disclosure_name: string;
  disclosure_type: string;
  ui: UiFormConfig;
  version_id?: string;
}

export interface UiFormConfig {
  formLabel?: string;
  references: {
    attributes: Record<string, ReferenceAttribute>;
    validations: Record<string,  ReferenceValidation>;
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
export interface ReferenceAttribute {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  hint?: string;
  dateFormat?: string;
  initialValue?: any;
  visibility?: AccessControls;
  editableLogic?: AccessControls;
  staticSelection?: StaticSelection;
  direction?: DirectionType;
  multiple?: boolean;
  get?: GetServerRequest;
  validations?: Validation[];
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
