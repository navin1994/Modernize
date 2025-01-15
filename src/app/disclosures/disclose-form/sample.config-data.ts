import { AttributeType, ConditionType, FIELD_TYPES, FormConfig } from "src/app/models/ui-form-config.interface";

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
              value: "attribute_name",
            },
          },
          validations: ["required"],
        },
        ATTRIBUTE_TYPE: {
          id: "ATTRIBUTE_TYPE",
          type: FIELD_TYPES.SELECT,
          label: "Attribute Type",
          staticSelection: {
            initialValue: "",
            options: [
              { value: FIELD_TYPES.BASIC, label: "Text Field" },
              { value: FIELD_TYPES.AUTOCOMPLETE, label: "Autocomplete Input" },
              { value: FIELD_TYPES.NUMBER, label: "Number" },
              { value: FIELD_TYPES.SELECT, label: "Select" },
              { value: FIELD_TYPES.TEXTAREA, label: "Text Area" },
              { value: FIELD_TYPES.DATE, label: "Date" },
              { value: FIELD_TYPES.CHIPS_SELECT, label: "Single Selection Chips" },
              { value: FIELD_TYPES.CHIPS_MULTI_SELECT, label: "Multiple Selection Chips" },
              { value: FIELD_TYPES.RADIO_BUTTON, label: "Radio Buttons" },
              { value: FIELD_TYPES.CHECKBOX, label: "Checkbox" },
              { value: FIELD_TYPES.DATE_RANGE, label: "Date Range" },
              { value: FIELD_TYPES.PASSWORD, label: "Password" },
            ],
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

      },
    },
    elementsLayout: [
      [
        { _refAttributes: "ATTRIBUTE_ID" },
        { _refAttributes: "ATTRIBUTE_TYPE" },
      ],
      [{ _refAttributes: "ATTRIBUTE_LABEL" }],
      [{ _refAttributes: "ATTRIBUTE_LABEL_RTE" }],
      [{ _refAttributes: "USE_RICH_TEXT" }],
      [{ paragraph: "<p>The criteria parameter is a hash containing...</p>" }],
    ],
  },
  version_id: "ajadh83usdfbyHSYSB93nsjn",
};