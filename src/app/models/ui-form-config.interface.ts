// Contains information specific ONLY to UI rendering.
export const FIELD_TYPES = {
    BASIC: "input-basic",
    AUTOCOMPLETE: "input-autocomplete",
    NUMBER: "input-number",
    RICH_TEXT: "rich-text",
    SELECT: "input-select",
    TEXTAREA: "input-textarea",
    DATE: "input-date",
    DATE_RANGE: "input-date-range",
    CHIPS_SELECT: "chips-single-select",
    CHIPS_MULTI_SELECT: "chips-multi-select",
    RADIO_BUTTON: "input-radio",
    CHECKBOX: "input-checkbox",
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
    formLabel: string;
    references: {
        attributes: Record<string, ReferenceAttribute>;
    };
    elementsLayout: ElementLayoutData[][];
}

export interface ReferenceAttribute {
    id: string;
    type: FieldType;
    label: string;
    placeholder?: string;
    hint?: string;
    visibility?: AccessControls;
    editableLogic?: AccessControls;
    staticSelection?: StaticSelection;
    get?: GetServerRequest;
    validations?: Validations;
}

export interface GetServerRequest {
    from: string; // The URL from which to fetch data
    mapping: {
      label: string; // The name of the property to use as the label in UI
      value: string; // The name of the property to use as the value in UI
    };
}

export interface StaticSelection {
    initialValue: string;
    options: {
        value: string;
        label: string;
    }[];
}

export interface ElementLayoutData {
    _refAttributes?: string;
    paragraph?: string;
    header?: string;
}

// Assuming these interfaces will have further implementation details.
export interface AccessControls {
    matchAllGroup: boolean;
    matchConditionsGroup: boolean;
    conditionGroups: ConditionGroup[][];
    statuses?: string[];
    userPermissions?: string[];
    allWaysEditable?: boolean;
}

export type ConditionType = 'equal' | 'not-equal' | 'regex' | 'contains' | 'greater-than' | 'less-than' | 'start-with';
export type AttributeType = 'form-attribute' | 'user-attribute';
export interface ConditionGroup {
    attributeType: AttributeType;
    groupName: string;
    description: string;
    sourceAttribute?: string;
    userAttribute?: string;
    condition: ConditionType;
    conditionValue: string;
}

export interface Validations {
    // Define properties, like required, min/max, custom messages, etc.
}

