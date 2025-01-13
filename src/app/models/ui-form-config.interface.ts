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
}

export interface UiFormConfig {
    version_id?: string;
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
    visibility?: Visibility;
    staticSelection?: StaticSelection;
    get?: GetServerRequest;
    validations?: Validations;
    editableLogic?: EditableLogic;
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
export interface Visibility {
    // Define properties as needed
}

export interface Validations {
    // Define properties, like required, min/max, custom messages, etc.
}

export interface EditableLogic {
    statuses?: string[];
    userRole?: string[];
    alwaysEditable?: boolean;
    attributeConditions?: AttributeConditions;
}

export interface AttributeConditions {
    // Define condition-related properties
}
