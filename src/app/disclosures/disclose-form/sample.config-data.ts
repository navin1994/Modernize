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
          hint: "Select attribute id from this <b>field<b>",
          placeholder: "Attribute ID",
          get: {
            from: "http://localhost:3000/options",
            mapping: {
              label: "attribute_name|attribute_type",
              value: "id",
            },
          },
          
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
          validations: [
            {
              _refValidation: "required"
            }
          ]
        },
        ATTRIBUTE_SELECT_MULTIPLE: {
          id: "ATTRIBUTE_SELECT_MULTIPLE",
          type: FIELD_TYPES.SELECT,
          label: "Attribute Type multiple select",
          multiple: true,
          // initialValue: { value: FIELD_TYPES.BASIC, label: "Text Field" },
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
          
        },
        ATTRIBUTE_LABEL: {
          id: "ATTRIBUTE_LABEL",
          type: FIELD_TYPES.BASIC,
          label: "Attribute Label Basic Input",
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
            ],
          },
          // Note: If any object is empty then remove it
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
          validations: [
            {
              _refValidation: "required",
            },
            {
              comparativeValidations: {
                  matchAllGroup: true,
                  matchConditionsGroup: true,
                  conditionGroups: [
                    [
                      {
                        attributeType: "form-attribute",
                          groupName: "Navin",
                          description: "End date should be greater than start date",
                          sourceAttribute: 'DATE', // Store form attribute
                          condition: 'less-than', // provided static value to compare with current value of attribute
                          conditionalAttribute: 'DATE_END',
                      }
                    ]
                  ],
              }
            }
          ]
        },
        ATTRIBUTE_COUNT: {
          id: "ATTRIBUTE_COUNT",
          type: FIELD_TYPES.NUMBER,
          label: "Attribute Count",
          hint: "This is for testing purpose",
          
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
          
        },
        USE_RICH_TEXT: {
          id: "USE_RICH_TEXT",
          type: FIELD_TYPES.CHECKBOX,
          label: "Use reach text editor for label",
          
        },
        TEXT_AREA: {
          id: "TEXT_AREA",
          type: FIELD_TYPES.TEXTAREA,
          label: "Attribute TEXTAREA",
          hint: "This is for testing purpose",
          
        },
        DATE: {
          id: "DATE",
          type: FIELD_TYPES.DATE,
          placeholder: "MMMM Do, YYYY",
          label: "Attribute DATE",
          dateFormat: 'MMMM Do, YYYY',
          hint: "The popover content is very dynamic or needs to interact heavily with services without the constraints of mat-menu",
          validations: [
            {
              _refValidation: "required",
            },
            {
              comparativeValidations: {
                  matchAllGroup: true,
                  matchConditionsGroup: true,
                  conditionGroups: [
                    [
                      {
                        attributeType: "self", // When attributeType is self then sourceAttribute is not required
                          groupName: "Test",
                          description: "End date should be greater than start date",
                          // sourceAttribute: 'DATE', // Store form attribute
                          condition: 'less-than', // provided static value to compare with current value of attribute
                          conditionalAttribute: 'DATE_END',
                      }
                    ]
                  ],
              }
            }
          ]
          
        },
        DATE_END: {
          id: "DATE",
          type: FIELD_TYPES.DATE,
          placeholder: "DD-MM-YYYY",
          label: "Attribute End DATE",
          hint: "This is for testing purpose",
          dateFormat: 'DD-MM-YYYY',
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
          
        },
        ATTRIBUTE_INPUT_CHIPS: {
          id: "ATTRIBUTE_INPUT_CHIPS",
          type: FIELD_TYPES.CHIPS_INPUT,
          label: "Attribute Chips Input",
          hint: "This is for testing purpose",
          
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
          
        },
        ATTRIBUTE_CHECKBOX_GROUP: {
          id: "ATTRIBUTE_CHECKBOX_GROUP",
          direction: DIRECTION.HORIZONTAL,
          type: FIELD_TYPES.CHECKBOX_GROUP,
          label: "Attribute Checkbox Group",
          multiple: true,
          staticSelection: {
            options: [
              { value: FIELD_TYPES.BASIC, label: "Text Field" },
              { value: FIELD_TYPES.AUTOCOMPLETE, label: "Autocomplete Input" },
              { value: FIELD_TYPES.NUMBER, label: "Number" }
            ],
          },
        },
        ATTRIBUTE_TYPE_GET_SERVER_OPTIONS: {
          id: "ATTRIBUTE_TYPE_GET_SERVER_OPTIONS",
          type: FIELD_TYPES.SELECT,
          multiple: true,
          label: "Options from API call with multiple select",
          get: {
            from: "http://localhost:3000/options",
            mapping: {
              label: "attribute_name"
            },
          },
        },
        ATTRIBUTE_SELECT_MULTIPLE_WITH_OBJECT_VALUE: {
          id: "ATTRIBUTE_SELECT_MULTIPLE_WITH_OBJECT_VALUE",
          type: FIELD_TYPES.SELECT,
          label: "Attribute Type multiple select object value",
          multiple: true,
          // initialValue: { value: FIELD_TYPES.BASIC, label: "Text Field" },
          staticSelection: {
            options: [
              { value: { value: FIELD_TYPES.BASIC, label: "Text Field" }, label: "Text Field" },
              { value: { value: FIELD_TYPES.AUTOCOMPLETE, label: "Autocomplete Input" }, label: "Autocomplete Input" },
              { value: { value: FIELD_TYPES.NUMBER, label: "Number" }, label: "Number" },
              { value: { value: FIELD_TYPES.SELECT, label: "Select" }, label: "Select" },
              { value: { value: FIELD_TYPES.TEXTAREA, label: "Text Area" }, label: "Text Area" },
              { value: { value: FIELD_TYPES.DATE, label: "Date" }, label: "Date" },
              { value: { value: FIELD_TYPES.CHIPS_INPUT, label: "Chips Input" }, label: "Chips Input" },
              { value: { value: FIELD_TYPES.CHIPS_SELECT, label: "Chips Select" }, label: "Chips Select" },
              { value: { value: FIELD_TYPES.RADIO_BUTTON, label: "Radio Buttons" }, label: "Radio Buttons" },
              { value: { value: FIELD_TYPES.CHECKBOX, label: "Checkbox" }, label: "Checkbox" },
              { value: { value: FIELD_TYPES.PASSWORD, label: "Password" }, label: "Password" },
            ],
          },
          
        },
        ATTRIBUTE_SELECT_SINGLE_WITH_OBJECT_VALUE: {
          id: "ATTRIBUTE_SELECT_SINGLE_WITH_OBJECT_VALUE",
          type: FIELD_TYPES.SELECT,
          label: "Attribute Type single select object value",
          // initialValue: { value: FIELD_TYPES.BASIC, label: "Text Field" },
          staticSelection: {
            options: [
              { value: { value: FIELD_TYPES.BASIC, label: "Text Field" }, label: "Text Field" },
              { value: { value: FIELD_TYPES.AUTOCOMPLETE, label: "Autocomplete Input" }, label: "Autocomplete Input" },
              { value: { value: FIELD_TYPES.NUMBER, label: "Number" }, label: "Number" },
              { value: { value: FIELD_TYPES.SELECT, label: "Select" }, label: "Select" },
              { value: { value: FIELD_TYPES.TEXTAREA, label: "Text Area" }, label: "Text Area" },
              { value: { value: FIELD_TYPES.DATE, label: "Date" }, label: "Date" },
              { value: { value: FIELD_TYPES.CHIPS_INPUT, label: "Chips Input" }, label: "Chips Input" },
              { value: { value: FIELD_TYPES.CHIPS_SELECT, label: "Chips Select" }, label: "Chips Select" },
              { value: { value: FIELD_TYPES.RADIO_BUTTON, label: "Radio Buttons" }, label: "Radio Buttons" },
              { value: { value: FIELD_TYPES.CHECKBOX, label: "Checkbox" }, label: "Checkbox" },
              { value: { value: FIELD_TYPES.PASSWORD, label: "Password" }, label: "Password" },
            ],
          },
          
        },
      },
      validations: {
        required: {
          type: "required",
          errorMessage: "This field is required",
          regex: "^(?!\s*$).+"
        }
      },
      validationRelations: {
        DATE_END: [
          'ATTRIBUTE_LABEL',
          'DATE'
        ],
        DATE: [
          'ATTRIBUTE_LABEL'
        ]
      },
      showErrorAfterSubmit: false,
    },
    paragraphs: {
      textAttributes: {
        SAMPLE_TEXT: {
          id: 'SAMPLE_TEXT',
          text: "<div style=\"color: red; font-weight: bold; margin-top: 10px;\">The <I>criteria</I> parameter is <a href=\"https://example.com\" target=\"_blank\">Visit Example.com</a> a hash containing...{{TEXT_AREA}}</div>", // {{attribute}} or {{attribute.label}} add in this way for dynamic text
          visibility: {
            matchAllGroup: true,
            matchConditionsGroup: true,
            conditionGroups: [
              [
                {
                  attributeType: 'form-attribute',
                  groupName: 'A',
                  description: 'Show if start date is grater that end date',
                  sourceAttribute: 'DATE_END',
                  condition: 'less-than',
                  conditionalAttribute: 'DATE'
                  // conditionValue: 'true'
                }
              ]
            ]
          },
        }
      }
    },
    actions: {
      justification: 'justify-content-center',
      buttons: [
        {
          label: 'Submit',
          color: 'warn',
          type: 'extended-fab',
          icon: 'home',
          runValidation: true,
          nextStatus: 'Disclosed',
          confirmationText: 'Do you really want to save and proceed?',
          confirmBtnLabel: 'Yes',
          cancelBtnLabel: 'No',
          tooltip: 'This is sample button',
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
        },
        {
          label: 'Submit',
          color: 'primary',
          type: 'raised',
          icon: 'home',
          runValidation: true,
          nextStatus: 'Disclosed',
          confirmationText: 'Do you really want to save and proceed?',
          confirmBtnLabel: 'Yes',
          cancelBtnLabel: 'No',
          tooltip: 'This is sample button'
          // visibility?: AccessControls;
        }
      ]
    },
    elementsLayout: [
      [
        { _refAttributes: "ATTRIBUTE_ID" },
        { _refAttributes: "ATTRIBUTE_TYPE" }
      ],
      [{ _refAttributes: "ATTRIBUTE_LABEL" },
        { _refAttributes: "ATTRIBUTE_COUNT" }
      ],
      [{ _paragraphAttributes: "SAMPLE_TEXT" }],
      [{ _refAttributes: "DATE" },{ _refAttributes: "DATE_END" }],
      [{ _refAttributes: "ATTRIBUTE_LABEL_RTE" }],
      [{ _refAttributes: "USE_RICH_TEXT" }],
      [{ _refAttributes: "TEXT_AREA" }, { _refAttributes: "ATTRIBUTE_INPUT_CHIPS" }],
      [{ _refAttributes: "ATTRIBUTE_RADIO" }, { _refAttributes: "ATTRIBUTE_SELECT_MULTIPLE" }],
      [{ _refAttributes: "ATTRIBUTE_CHIPS_MULTI" }, { _refAttributes: "ATTRIBUTE_CHECKBOX_GROUP" }],
      [{ _refAttributes: "ATTRIBUTE_TYPE_GET_SERVER_OPTIONS" }, {_refAttributes: "ATTRIBUTE_SELECT_MULTIPLE_WITH_OBJECT_VALUE"}],
      [{_refAttributes: "ATTRIBUTE_SELECT_SINGLE_WITH_OBJECT_VALUE"}]
    ],
  },
  version_id: "ajadh83usdfbyHSYSB93nsjn",
};