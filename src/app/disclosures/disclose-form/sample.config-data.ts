import { DIRECTION, FIELD_TYPES, FormConfig } from "src/app/models/ui-form-config.interface";

export const attribute_editor: FormConfig = {
  disclosure_name: "UI Attribute Editor",
  disclosure_type: "ATTRIBUTE_EDITOR",
  ui: {
    formLabel: "UI Attribute Editor",
    references: {
      attributes: {
        ATTRIBUTE_ID: {
          id: "ATTRIBUTE_ID",
          type: FIELD_TYPES.AUTOCOMPLETE,
          label: "Attribute ID",
          hint: "Select attribute id from this field",
          placeholder: "Attribute ID",
          get: {
            from: "https://my.api.mockaroo.com/attribute_list.json?key=1e24b6b0",
            mapping: {
              label: "attribute_name|id|attribute_type",
              value: "id",
            },
          },
          validations: ["required"],
        },
        ATTRIBUTE_TYPE: {
          id: "ATTRIBUTE_TYPE",
          type: FIELD_TYPES.SELECT,
          multiple: false,
          label: "Attribute Type",
          initialValue: { value: FIELD_TYPES.BASIC, label: "Text Field" },
          staticSelection: {
            options: [
              { value: FIELD_TYPES.BASIC, label: "Text Field" },
              { value: FIELD_TYPES.AUTOCOMPLETE, label: "Autocomplete Input" },
              { value: FIELD_TYPES.NUMBER, label: "Number" },
              { value: FIELD_TYPES.SELECT, label: "Select" },
              { value: FIELD_TYPES.TEXTAREA, label: "Text Area" },
              { value: FIELD_TYPES.DATE, label: "Date" },
              { value: FIELD_TYPES.CHIPS_SELECT, label: "Single Selection Chips" },
              { value: FIELD_TYPES.RADIO_BUTTON, label: "Radio Buttons" },
              { value: FIELD_TYPES.CHECKBOX, label: "Checkbox" },
              { value: FIELD_TYPES.PASSWORD, label: "Password" },
            ],
          },
          editableLogic: {
            allWaysEditable: true
          },
          validations: ["required"],
        },
        ATTRIBUTE_SELECT_MULTIPLE: {
          id: "ATTRIBUTE_SELECT_MULTIPLE",
          type: FIELD_TYPES.SELECT,
          label: "Attribute Type",
          multiple: true,
          initialValue: { value: FIELD_TYPES.BASIC, label: "Text Field" },
          staticSelection: {
            options: [
              { value: FIELD_TYPES.BASIC, label: "Text Field" },
              { value: FIELD_TYPES.AUTOCOMPLETE, label: "Autocomplete Input" },
              { value: FIELD_TYPES.NUMBER, label: "Number" },
              { value: FIELD_TYPES.SELECT, label: "Select" },
              { value: FIELD_TYPES.TEXTAREA, label: "Text Area" },
              { value: FIELD_TYPES.DATE, label: "Date" },
              { value: FIELD_TYPES.CHIPS_INPUT, label: "Chips Input" },
              { value: FIELD_TYPES.CHIPS_SELECT, label: "Chips Select" },
              { value: FIELD_TYPES.RADIO_BUTTON, label: "Radio Buttons" },
              { value: FIELD_TYPES.CHECKBOX, label: "Checkbox" },
              { value: FIELD_TYPES.PASSWORD, label: "Password" },
            ],
          },
          editableLogic: {
            allWaysEditable: true
          },
          validations: ["required"],
        },
        ATTRIBUTE_LABEL: {
          id: "ATTRIBUTE_LABEL",
          type: FIELD_TYPES.BASIC,
          label: "Attribute Label",
          hint: "Write label to show for this attribute field",
          placeholder: "Attribute Label",
          visibility: {
            matchAllGroup: true,
            matchConditionsGroup: true,
            conditionGroups: [
              [
                {
                  attributeType: 'form-attribute',
                  groupName: 'A',
                  description: 'Show if basic input is used for label',
                  sourceAttribute: 'USE_RICH_TEXT',
                  condition: 'equal',
                  conditionValue: 'false'
                }
              ]
            ]
          },
          editableLogic: {
            // readonly: true,
            // allWaysEditable: true,
            statuses: ['Disclosed'],
            matchAllGroup: true,
            matchConditionsGroup: true,
            conditionGroups: [
              [
                {
                  attributeType: 'form-attribute',
                  groupName: 'A',
                  description: 'Show if text in attribute label',
                  sourceAttribute: 'ATTRIBUTE_TYPE',
                  condition: 'regex',
                  conditionValue: '.+'
                }
              ]
            ]
          },
          validations: ["required"],
        },
        ATTRIBUTE_COUNT: {
          id: "ATTRIBUTE_COUNT",
          type: FIELD_TYPES.NUMBER,
          label: "Attribute Count",
          hint: "This is for testing purpose",
          validations: ["required"],
        },
        ATTRIBUTE_LABEL_RTE: {
          id: "ATTRIBUTE_LABEL_RTE",
          type: FIELD_TYPES.RICH_TEXT,
          label: "Attribute Label",
          hint: "Write label to show for this attribute field",
          placeholder: "Attribute Label",
          visibility: {
            statuses: ['Unsaved'],
            matchAllGroup: true,
            matchConditionsGroup: true,
            conditionGroups: [
              [
                {
                  attributeType: 'form-attribute',
                  groupName: 'A',
                  description: 'Show if rich text editor is used for label',
                  sourceAttribute: 'USE_RICH_TEXT',
                  condition: 'equal',
                  conditionValue: 'true'
                }
              ]
            ]
          },
          validations: ["required"],
        },
        USE_RICH_TEXT: {
          id: "USE_RICH_TEXT",
          type: FIELD_TYPES.CHECKBOX,
          label: "Use reach text editor for label",
          validations: ["required"],
        },
        TEXT_AREA: {
          id: "TEXT_AREA",
          type: FIELD_TYPES.TEXTAREA,
          label: "Attribute TEXTAREA",
          hint: "This is for testing purpose",
          validations: ["required"],
        },
        DATE: {
          id: "DATE",
          type: FIELD_TYPES.DATE,
          placeholder: "DD/MM/YYYY",
          label: "Attribute DATE",
          hint: "This is for testing purpose",
          validations: ["required"],
        },
        ATTRIBUTE_RADIO: {
          id: "ATTRIBUTE_RADIO",
          type: FIELD_TYPES.RADIO_BUTTON,
          label: "Attribute Radio Button",
          direction: DIRECTION.HORIZONTAL,
          staticSelection: {
            options: [
              { value: FIELD_TYPES.BASIC, label: "Text Field" },
              { value: FIELD_TYPES.AUTOCOMPLETE, label: "Autocomplete Input" },
              { value: FIELD_TYPES.NUMBER, label: "Number" }
            ],
          },
          validations: ["required"],
        },
        ATTRIBUTE_INPUT_CHIPS: {
          id: "ATTRIBUTE_INPUT_CHIPS",
          type: FIELD_TYPES.CHIPS_INPUT,
          label: "Attribute Chips Input",
          hint: "This is for testing purpose",
          validations: ["required"],
        },
        ATTRIBUTE_CHIPS_MULTI: {
          id: "ATTRIBUTE_RADIO",
          type: FIELD_TYPES.CHIPS_SELECT,
          label: "Attribute CHIPS",
          direction: DIRECTION.HORIZONTAL,
          multiple: true,
          staticSelection: {
            options: [
              { value: FIELD_TYPES.BASIC, label: "Text Field" },
              { value: FIELD_TYPES.AUTOCOMPLETE, label: "Autocomplete Input" },
              { value: FIELD_TYPES.NUMBER, label: "Number" }
            ],
          },
          validations: ["required"],
        },
        ATTRIBUTE_CHECKBOX_GROUP: {
          id: "ATTRIBUTE_CHECKBOX_GROUP",
          direction: DIRECTION.HORIZONTAL,
          type: FIELD_TYPES.CHECKBOX_GROUP,
          label: "Attribute Checkbox Group",
          staticSelection: {
            options: [
              { value: FIELD_TYPES.BASIC, label: "Text Field" },
              { value: FIELD_TYPES.AUTOCOMPLETE, label: "Autocomplete Input" },
              { value: FIELD_TYPES.NUMBER, label: "Number" }
            ],
          },
          validations: ["required"],
        },
      },
    },
    elementsLayout: [
      [
        { _refAttributes: "ATTRIBUTE_ID" },
        { _refAttributes: "ATTRIBUTE_TYPE" },
      ],
      [{ _refAttributes: "ATTRIBUTE_LABEL" },
        { _refAttributes: "ATTRIBUTE_COUNT" }
      ],
      [{ _refAttributes: "DATE" }, { _refAttributes: "ATTRIBUTE_INPUT_CHIPS" }],
      [{ _refAttributes: "ATTRIBUTE_LABEL_RTE" }],
      [{ _refAttributes: "USE_RICH_TEXT" }],
      [{ _refAttributes: "TEXT_AREA" }],
      [{ _refAttributes: "ATTRIBUTE_RADIO" }, { _refAttributes: "ATTRIBUTE_SELECT_MULTIPLE" }],
      [{ _refAttributes: "ATTRIBUTE_CHIPS_MULTI" }, { _refAttributes: "ATTRIBUTE_CHECKBOX_GROUP" }],
      [{ paragraph: "<p>The criteria parameter is a hash containing...</p>" }],
    ],
  },
  version_id: "ajadh83usdfbyHSYSB93nsjn",
};