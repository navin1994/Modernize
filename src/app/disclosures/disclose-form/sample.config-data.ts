import {
  DIRECTION,
  FIELD_TYPES,
  FormConfig,
} from "src/app/models/ui-form-config.interface";

export const attribute_editor: FormConfig = {
  disclosure_name: "UI Attribute Editor",
  disclosure_type: "ATTRIBUTE_EDITOR_FORM_GROUP",
  ui: {
    type: FIELD_TYPES.FORM_GROUP,
    formLabel: "Form Group Attribute Editor",
    references: {
      attributes: {
        ATTRIBUTE_ID: {
          id: "ATTRIBUTE_ID",
          type: FIELD_TYPES.AUTOCOMPLETE,
          multiple: false,
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
          validations: [
            {
              _refValidation: "required",
            },
          ],
        },
        ATTRIBUTE_TYPE: {
          id: "ATTRIBUTE_TYPE",
          type: FIELD_TYPES.SELECT,
          multiple: false,
          label: "Attribute Type",
          initialValue: FIELD_TYPES.BASIC,
          staticSelection: {
            options: [
              { value: FIELD_TYPES.BASIC, label: "Text Field" },
              { value: FIELD_TYPES.AUTOCOMPLETE, label: "Autocomplete Input" },
              { value: FIELD_TYPES.NUMBER, label: "Number" },
              { value: FIELD_TYPES.SELECT, label: "Select" },
              { value: FIELD_TYPES.TEXTAREA, label: "Text Area" },
              { value: FIELD_TYPES.DATE, label: "Date" },
              {
                value: FIELD_TYPES.CHIPS_SELECT,
                label: "Single Selection Chips",
              },
              { value: FIELD_TYPES.RADIO_BUTTON, label: "Radio Buttons" },
              { value: FIELD_TYPES.CHECKBOX, label: "Checkbox" },
              { value: FIELD_TYPES.PASSWORD, label: "Password" },
            ],
          },
          editableLogic: {
            allWaysEditable: true,
          },
          validations: [
            {
              _refValidation: "required",
            },
          ],
        },
        ATTRIBUTE_SELECT_MULTIPLE: {
          id: "ATTRIBUTE_SELECT_MULTIPLE",
          type: FIELD_TYPES.SELECT,
          label: "Attribute Type multiple select",
          multiple: true,
          initialValue: [FIELD_TYPES.BASIC],
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
          validations: [
            {
              _refValidation: "required",
            },
          ],
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
                  attributeType: "form-attribute",
                  groupName: "A",
                  description: "Show if basic input is used for label",
                  sourceAttribute: "USE_RICH_TEXT",
                  condition: "equal",
                  conditionValue: "false",
                },
              ],
            ],
          },
          // Note: If any object is empty then remove it
          editableLogic: {
            // readonly: true,
            // allWaysEditable: true,
            statuses: ["Disclosed"],
            matchAllGroup: true,
            matchConditionsGroup: true,
            conditionGroups: [
              [
                {
                  attributeType: "form-attribute",
                  groupName: "A",
                  description: "Show if text in attribute label",
                  sourceAttribute: "ATTRIBUTE_TYPE",
                  condition: "regex",
                  conditionValue: ".+",
                },
              ],
            ],
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
                      sourceAttribute: "DATE", // Store form attribute
                      condition: "less-than", // provided static value to compare with current value of attribute
                      conditionalAttribute: "DATE_END",
                    },
                  ],
                ],
              },
            },
          ],
        },
        ATTRIBUTE_COUNT: {
          id: "ATTRIBUTE_COUNT",
          type: FIELD_TYPES.NUMBER,
          label: "Attribute Count",
          hint: "This is for testing purpose",
          validations: [
            {
              _refValidation: "required",
            },
          ],
        },
        ATTRIBUTE_LABEL_RTE: {
          id: "ATTRIBUTE_LABEL_RTE",
          type: FIELD_TYPES.RICH_TEXT,
          label: "Attribute Label",
          hint: "Write label to show for this attribute field",
          placeholder: "Attribute Label",
          visibility: {
            statuses: ["Unsaved"],
            matchAllGroup: true,
            matchConditionsGroup: true,
            conditionGroups: [
              [
                {
                  attributeType: "form-attribute",
                  groupName: "A",
                  description: "Show if rich text editor is used for label",
                  sourceAttribute: "USE_RICH_TEXT",
                  condition: "equal",
                  conditionValue: "true",
                },
              ],
            ],
          },
          validations: [
            {
              _refValidation: "required",
            },
          ],
        },
        USE_RICH_TEXT: {
          id: "USE_RICH_TEXT",
          type: FIELD_TYPES.CHECKBOX,
          label: "Use reach text editor for label",
          validations: [
            {
              _refValidation: "required",
            },
          ],
        },
        TEXT_AREA: {
          id: "TEXT_AREA",
          type: FIELD_TYPES.TEXTAREA,
          label: "Attribute TEXTAREA",
          hint: "This is for testing purpose",
          validations: [
            {
              _refValidation: "required",
            },
          ],
        },
        DATE: {
          id: "DATE",
          type: FIELD_TYPES.DATE,
          placeholder: "MMMM Do, YYYY",
          label: "Attribute DATE",
          dateFormat: "MMMM Do, YYYY",
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
                      condition: "less-than", // provided static value to compare with current value of attribute
                      conditionalAttribute: "DATE_END",
                    },
                  ],
                ],
              },
            },
          ],
        },
        DATE_END: {
          id: "DATE",
          type: FIELD_TYPES.DATE,
          placeholder: "DD-MM-YYYY",
          label: "Attribute End DATE",
          hint: "This is for testing purpose",
          dateFormat: "DD-MM-YYYY",
          validations: [
            {
              _refValidation: "required",
            },
          ],
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
              { value: FIELD_TYPES.NUMBER, label: "Number" },
            ],
          },
          validations: [
            {
              _refValidation: "required",
            },
          ],
        },
        ATTRIBUTE_INPUT_CHIPS: {
          id: "ATTRIBUTE_INPUT_CHIPS",
          type: FIELD_TYPES.CHIPS_INPUT,
          label: "Attribute Chips Input",
          hint: "This is for testing purpose",
          validations: [
            {
              _refValidation: "required",
            },
          ],
        },
        ATTRIBUTE_CHIPS_MULTI: {
          id: "ATTRIBUTE_CHIPS_MULTI",
          type: FIELD_TYPES.CHIPS_SELECT,
          label: "Attribute CHIPS",
          direction: DIRECTION.HORIZONTAL,
          multiple: true,
          staticSelection: {
            options: [
              { value: FIELD_TYPES.BASIC, label: "Text Field" },
              { value: FIELD_TYPES.AUTOCOMPLETE, label: "Autocomplete Input" },
              { value: FIELD_TYPES.NUMBER, label: "Number" },
            ],
          },
          validations: [
            {
              _refValidation: "required",
            },
          ],
        },
        ATTRIBUTE_CHIPS_MULTI_OBJECT_VALUE: {
          id: "ATTRIBUTE_CHIPS_MULTI_OBJECT_VALUE",
          type: FIELD_TYPES.CHIPS_SELECT,
          label: "Attribute CHIPS Multi select with Object values",
          direction: DIRECTION.HORIZONTAL,
          multiple: true,
          staticSelection: {
            options: [
              {
                value: { value: FIELD_TYPES.BASIC, label: "Text Field" },
                label: "Text Field",
              },
              {
                value: {
                  value: FIELD_TYPES.AUTOCOMPLETE,
                  label: "Autocomplete Input",
                },
                label: "Autocomplete Input",
              },
              {
                value: { value: FIELD_TYPES.NUMBER, label: "Number" },
                label: "Number",
              },
            ],
          },
          validations: [
            {
              _refValidation: "required",
            },
          ],
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
              { value: FIELD_TYPES.NUMBER, label: "Number" },
            ],
          },
          validations: [
            {
              _refValidation: "required",
            },
          ],
        },
        ATTRIBUTE_TYPE_GET_SERVER_OPTIONS: {
          id: "ATTRIBUTE_TYPE_GET_SERVER_OPTIONS",
          type: FIELD_TYPES.SELECT,
          multiple: true,
          label: "Options from API call with multiple select",
          get: {
            from: "http://localhost:3000/options",
            mapping: {
              label: "attribute_name|attribute_type",
            },
          },
          validations: [
            {
              _refValidation: "required",
            },
          ],
        },
        ATTRIBUTE_SELECT_MULTIPLE_WITH_OBJECT_VALUE: {
          id: "ATTRIBUTE_SELECT_MULTIPLE_WITH_OBJECT_VALUE",
          type: FIELD_TYPES.SELECT,
          label: "Attribute Type multiple select object value",
          multiple: true,
          initialValue: [{ value: FIELD_TYPES.BASIC, label: "Text Field" }],
          staticSelection: {
            options: [
              {
                value: { value: FIELD_TYPES.BASIC, label: "Text Field" },
                label: "Text Field",
              },
              {
                value: {
                  value: FIELD_TYPES.AUTOCOMPLETE,
                  label: "Autocomplete Input",
                },
                label: "Autocomplete Input",
              },
              {
                value: { value: FIELD_TYPES.NUMBER, label: "Number" },
                label: "Number",
              },
              {
                value: { value: FIELD_TYPES.SELECT, label: "Select" },
                label: "Select",
              },
              {
                value: { value: FIELD_TYPES.TEXTAREA, label: "Text Area" },
                label: "Text Area",
              },
              {
                value: { value: FIELD_TYPES.DATE, label: "Date" },
                label: "Date",
              },
              {
                value: { value: FIELD_TYPES.CHIPS_INPUT, label: "Chips Input" },
                label: "Chips Input",
              },
              {
                value: {
                  value: FIELD_TYPES.CHIPS_SELECT,
                  label: "Chips Select",
                },
                label: "Chips Select",
              },
              {
                value: {
                  value: FIELD_TYPES.RADIO_BUTTON,
                  label: "Radio Buttons",
                },
                label: "Radio Buttons",
              },
              {
                value: { value: FIELD_TYPES.CHECKBOX, label: "Checkbox" },
                label: "Checkbox",
              },
              {
                value: { value: FIELD_TYPES.PASSWORD, label: "Password" },
                label: "Password",
              },
            ],
          },
          validations: [
            {
              _refValidation: "required",
            },
          ],
        },
        ATTRIBUTE_SELECT_SINGLE_WITH_OBJECT_VALUE: {
          id: "ATTRIBUTE_SELECT_SINGLE_WITH_OBJECT_VALUE",
          type: FIELD_TYPES.SELECT,
          multiple: false,
          label: "Attribute Type single select object value",
          initialValue: { value: FIELD_TYPES.BASIC, label: "Text Field" },
          staticSelection: {
            options: [
              {
                value: { value: FIELD_TYPES.BASIC, label: "Text Field" },
                label: "Text Field",
              },
              {
                value: {
                  value: FIELD_TYPES.AUTOCOMPLETE,
                  label: "Autocomplete Input",
                },
                label: "Autocomplete Input",
              },
              {
                value: { value: FIELD_TYPES.NUMBER, label: "Number" },
                label: "Number",
              },
              {
                value: { value: FIELD_TYPES.SELECT, label: "Select" },
                label: "Select",
              },
              {
                value: { value: FIELD_TYPES.TEXTAREA, label: "Text Area" },
                label: "Text Area",
              },
              {
                value: { value: FIELD_TYPES.DATE, label: "Date" },
                label: "Date",
              },
              {
                value: { value: FIELD_TYPES.CHIPS_INPUT, label: "Chips Input" },
                label: "Chips Input",
              },
              {
                value: {
                  value: FIELD_TYPES.CHIPS_SELECT,
                  label: "Chips Select",
                },
                label: "Chips Select",
              },
              {
                value: {
                  value: FIELD_TYPES.RADIO_BUTTON,
                  label: "Radio Buttons",
                },
                label: "Radio Buttons",
              },
              {
                value: { value: FIELD_TYPES.CHECKBOX, label: "Checkbox" },
                label: "Checkbox",
              },
              {
                value: { value: FIELD_TYPES.PASSWORD, label: "Password" },
                label: "Password",
              },
            ],
          },
          validations: [
            {
              _refValidation: "required",
            },
          ],
        },
        SUB_FORM_GROUP: {
          id: "SUB_FORM_GROUP",
          type: FIELD_TYPES.FORM_GROUP,
          label: "This is sub form group",
          nestedElement: {
            type: FIELD_TYPES.FORM_GROUP,
            formLabel: "This is nested form group",
            references: {
              attributes: {
                ATTRIBUTE_ID: {
                  id: "ATTRIBUTE_ID",
                  type: FIELD_TYPES.AUTOCOMPLETE,
                  multiple: false,
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
                  validations: [
                    {
                      _refValidation: "required",
                    },
                  ],
                },
                ATTRIBUTE_TYPE: {
                  id: "ATTRIBUTE_TYPE",
                  type: FIELD_TYPES.SELECT,
                  multiple: false,
                  label: "Attribute Type",
                  initialValue: FIELD_TYPES.BASIC,
                  staticSelection: {
                    options: [
                      { value: FIELD_TYPES.BASIC, label: "Text Field" },
                      {
                        value: FIELD_TYPES.AUTOCOMPLETE,
                        label: "Autocomplete Input",
                      },
                      { value: FIELD_TYPES.NUMBER, label: "Number" },
                      { value: FIELD_TYPES.SELECT, label: "Select" },
                      { value: FIELD_TYPES.TEXTAREA, label: "Text Area" },
                      { value: FIELD_TYPES.DATE, label: "Date" },
                      {
                        value: FIELD_TYPES.CHIPS_SELECT,
                        label: "Single Selection Chips",
                      },
                      {
                        value: FIELD_TYPES.RADIO_BUTTON,
                        label: "Radio Buttons",
                      },
                      { value: FIELD_TYPES.CHECKBOX, label: "Checkbox" },
                      { value: FIELD_TYPES.PASSWORD, label: "Password" },
                    ],
                  },
                  editableLogic: {
                    allWaysEditable: true,
                  },
                  validations: [
                    {
                      _refValidation: "required",
                    },
                  ],
                },
                ATTRIBUTE_SELECT_MULTIPLE: {
                  id: "ATTRIBUTE_SELECT_MULTIPLE",
                  type: FIELD_TYPES.SELECT,
                  label: "Attribute Type multiple select",
                  multiple: true,
                  initialValue: [FIELD_TYPES.BASIC],
                  staticSelection: {
                    options: [
                      { value: FIELD_TYPES.BASIC, label: "Text Field" },
                      {
                        value: FIELD_TYPES.AUTOCOMPLETE,
                        label: "Autocomplete Input",
                      },
                      { value: FIELD_TYPES.NUMBER, label: "Number" },
                      { value: FIELD_TYPES.SELECT, label: "Select" },
                      { value: FIELD_TYPES.TEXTAREA, label: "Text Area" },
                      { value: FIELD_TYPES.DATE, label: "Date" },
                      { value: FIELD_TYPES.CHIPS_INPUT, label: "Chips Input" },
                      {
                        value: FIELD_TYPES.CHIPS_SELECT,
                        label: "Chips Select",
                      },
                      {
                        value: FIELD_TYPES.RADIO_BUTTON,
                        label: "Radio Buttons",
                      },
                      { value: FIELD_TYPES.CHECKBOX, label: "Checkbox" },
                      { value: FIELD_TYPES.PASSWORD, label: "Password" },
                    ],
                  },
                  validations: [
                    {
                      _refValidation: "required",
                    },
                  ],
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
                          attributeType: "form-attribute",
                          groupName: "A",
                          description: "Show if basic input is used for label",
                          sourceAttribute: "USE_RICH_TEXT",
                          condition: "equal",
                          conditionValue: "false",
                        },
                      ],
                    ],
                  },
                  // Note: If any object is empty then remove it
                  editableLogic: {
                    // readonly: true,
                    // allWaysEditable: true,
                    statuses: ["Disclosed"],
                    matchAllGroup: true,
                    matchConditionsGroup: true,
                    conditionGroups: [
                      [
                        {
                          attributeType: "form-attribute",
                          groupName: "A",
                          description: "Show if text in attribute label",
                          sourceAttribute: "ATTRIBUTE_TYPE",
                          condition: "regex",
                          conditionValue: ".+",
                        },
                      ],
                    ],
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
                              description:
                                "End date should be greater than start date",
                              sourceAttribute: "DATE", // Store form attribute
                              condition: "less-than", // provided static value to compare with current value of attribute
                              conditionalAttribute: "DATE_END",
                            },
                          ],
                        ],
                      },
                    },
                  ],
                },
                ATTRIBUTE_COUNT: {
                  id: "ATTRIBUTE_COUNT",
                  type: FIELD_TYPES.NUMBER,
                  label: "Attribute Count",
                  hint: "This is for testing purpose",
                  validations: [
                    {
                      _refValidation: "required",
                    },
                  ],
                },
                ATTRIBUTE_LABEL_RTE: {
                  id: "ATTRIBUTE_LABEL_RTE",
                  type: FIELD_TYPES.RICH_TEXT,
                  label: "Attribute Label",
                  hint: "Write label to show for this attribute field",
                  placeholder: "Attribute Label",
                  visibility: {
                    statuses: ["Unsaved"],
                    matchAllGroup: true,
                    matchConditionsGroup: true,
                    conditionGroups: [
                      [
                        {
                          attributeType: "form-attribute",
                          groupName: "A",
                          description:
                            "Show if rich text editor is used for label",
                          sourceAttribute: "USE_RICH_TEXT",
                          condition: "equal",
                          conditionValue: "true",
                        },
                      ],
                    ],
                  },
                  validations: [
                    {
                      _refValidation: "required",
                    },
                  ],
                },
                USE_RICH_TEXT: {
                  id: "USE_RICH_TEXT",
                  type: FIELD_TYPES.CHECKBOX,
                  label: "Use reach text editor for label",
                  validations: [
                    {
                      _refValidation: "required",
                    },
                  ],
                },
                TEXT_AREA: {
                  id: "TEXT_AREA",
                  type: FIELD_TYPES.TEXTAREA,
                  label: "Attribute TEXTAREA",
                  hint: "This is for testing purpose",
                  validations: [
                    {
                      _refValidation: "required",
                    },
                  ],
                },
                DATE: {
                  id: "DATE",
                  type: FIELD_TYPES.DATE,
                  placeholder: "MMMM Do, YYYY",
                  label: "Attribute DATE",
                  dateFormat: "MMMM Do, YYYY",
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
                              description:
                                "End date should be greater than start date",
                              // sourceAttribute: 'DATE', // Store form attribute
                              condition: "less-than", // provided static value to compare with current value of attribute
                              conditionalAttribute: "DATE_END",
                            },
                          ],
                        ],
                      },
                    },
                  ],
                },
                DATE_END: {
                  id: "DATE",
                  type: FIELD_TYPES.DATE,
                  placeholder: "DD-MM-YYYY",
                  label: "Attribute End DATE",
                  hint: "This is for testing purpose",
                  dateFormat: "DD-MM-YYYY",
                  validations: [
                    {
                      _refValidation: "required",
                    },
                  ],
                },
                ATTRIBUTE_RADIO: {
                  id: "ATTRIBUTE_RADIO",
                  type: FIELD_TYPES.RADIO_BUTTON,
                  label: "Attribute Radio Button",
                  direction: DIRECTION.HORIZONTAL,
                  staticSelection: {
                    options: [
                      { value: FIELD_TYPES.BASIC, label: "Text Field" },
                      {
                        value: FIELD_TYPES.AUTOCOMPLETE,
                        label: "Autocomplete Input",
                      },
                      { value: FIELD_TYPES.NUMBER, label: "Number" },
                    ],
                  },
                  validations: [
                    {
                      _refValidation: "required",
                    },
                  ],
                },
                ATTRIBUTE_INPUT_CHIPS: {
                  id: "ATTRIBUTE_INPUT_CHIPS",
                  type: FIELD_TYPES.CHIPS_INPUT,
                  label: "Attribute Chips Input",
                  hint: "This is for testing purpose",
                  validations: [
                    {
                      _refValidation: "required",
                    },
                  ],
                },
                ATTRIBUTE_CHIPS_MULTI: {
                  id: "ATTRIBUTE_CHIPS_MULTI",
                  type: FIELD_TYPES.CHIPS_SELECT,
                  label: "Attribute CHIPS",
                  direction: DIRECTION.HORIZONTAL,
                  multiple: true,
                  staticSelection: {
                    options: [
                      { value: FIELD_TYPES.BASIC, label: "Text Field" },
                      {
                        value: FIELD_TYPES.AUTOCOMPLETE,
                        label: "Autocomplete Input",
                      },
                      { value: FIELD_TYPES.NUMBER, label: "Number" },
                    ],
                  },
                  validations: [
                    {
                      _refValidation: "required",
                    },
                  ],
                },
                ATTRIBUTE_CHIPS_MULTI_OBJECT_VALUE: {
                  id: "ATTRIBUTE_CHIPS_MULTI_OBJECT_VALUE",
                  type: FIELD_TYPES.CHIPS_SELECT,
                  label: "Attribute CHIPS Multi select with Object values",
                  direction: DIRECTION.HORIZONTAL,
                  multiple: true,
                  staticSelection: {
                    options: [
                      {
                        value: {
                          value: FIELD_TYPES.BASIC,
                          label: "Text Field",
                        },
                        label: "Text Field",
                      },
                      {
                        value: {
                          value: FIELD_TYPES.AUTOCOMPLETE,
                          label: "Autocomplete Input",
                        },
                        label: "Autocomplete Input",
                      },
                      {
                        value: { value: FIELD_TYPES.NUMBER, label: "Number" },
                        label: "Number",
                      },
                    ],
                  },
                  validations: [
                    {
                      _refValidation: "required",
                    },
                  ],
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
                      {
                        value: FIELD_TYPES.AUTOCOMPLETE,
                        label: "Autocomplete Input",
                      },
                      { value: FIELD_TYPES.NUMBER, label: "Number" },
                    ],
                  },
                  validations: [
                    {
                      _refValidation: "required",
                    },
                  ],
                },
                ATTRIBUTE_TYPE_GET_SERVER_OPTIONS: {
                  id: "ATTRIBUTE_TYPE_GET_SERVER_OPTIONS",
                  type: FIELD_TYPES.SELECT,
                  multiple: true,
                  label: "Options from API call with multiple select",
                  get: {
                    from: "http://localhost:3000/options",
                    mapping: {
                      label: "attribute_name|attribute_type",
                    },
                  },
                  validations: [
                    {
                      _refValidation: "required",
                    },
                  ],
                },
                ATTRIBUTE_SELECT_MULTIPLE_WITH_OBJECT_VALUE: {
                  id: "ATTRIBUTE_SELECT_MULTIPLE_WITH_OBJECT_VALUE",
                  type: FIELD_TYPES.SELECT,
                  label: "Attribute Type multiple select object value",
                  multiple: true,
                  initialValue: [
                    { value: FIELD_TYPES.BASIC, label: "Text Field" },
                  ],
                  staticSelection: {
                    options: [
                      {
                        value: {
                          value: FIELD_TYPES.BASIC,
                          label: "Text Field",
                        },
                        label: "Text Field",
                      },
                      {
                        value: {
                          value: FIELD_TYPES.AUTOCOMPLETE,
                          label: "Autocomplete Input",
                        },
                        label: "Autocomplete Input",
                      },
                      {
                        value: { value: FIELD_TYPES.NUMBER, label: "Number" },
                        label: "Number",
                      },
                      {
                        value: { value: FIELD_TYPES.SELECT, label: "Select" },
                        label: "Select",
                      },
                      {
                        value: {
                          value: FIELD_TYPES.TEXTAREA,
                          label: "Text Area",
                        },
                        label: "Text Area",
                      },
                      {
                        value: { value: FIELD_TYPES.DATE, label: "Date" },
                        label: "Date",
                      },
                      {
                        value: {
                          value: FIELD_TYPES.CHIPS_INPUT,
                          label: "Chips Input",
                        },
                        label: "Chips Input",
                      },
                      {
                        value: {
                          value: FIELD_TYPES.CHIPS_SELECT,
                          label: "Chips Select",
                        },
                        label: "Chips Select",
                      },
                      {
                        value: {
                          value: FIELD_TYPES.RADIO_BUTTON,
                          label: "Radio Buttons",
                        },
                        label: "Radio Buttons",
                      },
                      {
                        value: {
                          value: FIELD_TYPES.CHECKBOX,
                          label: "Checkbox",
                        },
                        label: "Checkbox",
                      },
                      {
                        value: {
                          value: FIELD_TYPES.PASSWORD,
                          label: "Password",
                        },
                        label: "Password",
                      },
                    ],
                  },
                  validations: [
                    {
                      _refValidation: "required",
                    },
                  ],
                },
                ATTRIBUTE_SELECT_SINGLE_WITH_OBJECT_VALUE: {
                  id: "ATTRIBUTE_SELECT_SINGLE_WITH_OBJECT_VALUE",
                  type: FIELD_TYPES.SELECT,
                  multiple: false,
                  label: "Attribute Type single select object value",
                  initialValue: {
                    value: FIELD_TYPES.BASIC,
                    label: "Text Field",
                  },
                  staticSelection: {
                    options: [
                      {
                        value: {
                          value: FIELD_TYPES.BASIC,
                          label: "Text Field",
                        },
                        label: "Text Field",
                      },
                      {
                        value: {
                          value: FIELD_TYPES.AUTOCOMPLETE,
                          label: "Autocomplete Input",
                        },
                        label: "Autocomplete Input",
                      },
                      {
                        value: { value: FIELD_TYPES.NUMBER, label: "Number" },
                        label: "Number",
                      },
                      {
                        value: { value: FIELD_TYPES.SELECT, label: "Select" },
                        label: "Select",
                      },
                      {
                        value: {
                          value: FIELD_TYPES.TEXTAREA,
                          label: "Text Area",
                        },
                        label: "Text Area",
                      },
                      {
                        value: { value: FIELD_TYPES.DATE, label: "Date" },
                        label: "Date",
                      },
                      {
                        value: {
                          value: FIELD_TYPES.CHIPS_INPUT,
                          label: "Chips Input",
                        },
                        label: "Chips Input",
                      },
                      {
                        value: {
                          value: FIELD_TYPES.CHIPS_SELECT,
                          label: "Chips Select",
                        },
                        label: "Chips Select",
                      },
                      {
                        value: {
                          value: FIELD_TYPES.RADIO_BUTTON,
                          label: "Radio Buttons",
                        },
                        label: "Radio Buttons",
                      },
                      {
                        value: {
                          value: FIELD_TYPES.CHECKBOX,
                          label: "Checkbox",
                        },
                        label: "Checkbox",
                      },
                      {
                        value: {
                          value: FIELD_TYPES.PASSWORD,
                          label: "Password",
                        },
                        label: "Password",
                      },
                    ],
                  },
                  validations: [
                    {
                      _refValidation: "required",
                    },
                  ],
                },
              },
              validations: {
                required: {
                  type: "required",
                  errorMessage: "This field is required",
                  regex: "^(?!s*$).+",
                },
              },
              validationRelations: {
                DATE_END: ["ATTRIBUTE_LABEL", "DATE"],
                DATE: ["ATTRIBUTE_LABEL"],
              },
              showErrorAfterSubmit: false,
            },
            paragraphs: {
              textAttributes: {
                SAMPLE_TEXT: {
                  id: "SAMPLE_TEXT",
                  text: '<div style="color: red; font-weight: bold; margin-top: 10px;">The <I>criteria</I> parameter is <a href="https://example.com" target="_blank">Visit Example.com</a> a hash containing...{{TEXT_AREA}}</div>', // {{attribute}} or {{attribute.label}} add in this way for dynamic text
                  visibility: {
                    matchAllGroup: true,
                    matchConditionsGroup: true,
                    conditionGroups: [
                      [
                        {
                          attributeType: "form-attribute",
                          groupName: "A",
                          description:
                            "Show if start date is grater that end date",
                          sourceAttribute: "DATE_END",
                          condition: "less-than",
                          conditionalAttribute: "DATE",
                          // conditionValue: 'true'
                        },
                      ],
                    ],
                  },
                },
              },
            },
            elementsLayout: [
              [
                { _refAttributes: "ATTRIBUTE_ID" },
                { _refAttributes: "ATTRIBUTE_TYPE" },
              ],
              [
                { _refAttributes: "ATTRIBUTE_LABEL" },
                { _refAttributes: "ATTRIBUTE_COUNT" },
              ],
              [{ _paragraphAttributes: "SAMPLE_TEXT" }],
              [{ _refAttributes: "DATE" }, { _refAttributes: "DATE_END" }],
              [{ _refAttributes: "ATTRIBUTE_LABEL_RTE" }],
              [{ _refAttributes: "USE_RICH_TEXT" }],
              [
                { _refAttributes: "TEXT_AREA" },
                { _refAttributes: "ATTRIBUTE_INPUT_CHIPS" },
              ],
              [
                { _refAttributes: "ATTRIBUTE_RADIO" },
                { _refAttributes: "ATTRIBUTE_SELECT_MULTIPLE" },
              ],
              [
                { _refAttributes: "ATTRIBUTE_CHIPS_MULTI" },
                { _refAttributes: "ATTRIBUTE_CHECKBOX_GROUP" },
              ],
              [
                { _refAttributes: "ATTRIBUTE_TYPE_GET_SERVER_OPTIONS" },
                {
                  _refAttributes: "ATTRIBUTE_SELECT_MULTIPLE_WITH_OBJECT_VALUE",
                },
              ],
              [
                { _refAttributes: "ATTRIBUTE_SELECT_SINGLE_WITH_OBJECT_VALUE" },
                { _refAttributes: "ATTRIBUTE_CHIPS_MULTI_OBJECT_VALUE" },
              ],
            ],
          },
        },
        SUB_FORM_GROUP_WITH_NESTED_FORM_ARRAY: {
          id: "SUB_FORM_GROUP_WITH_NESTED_FORM_ARRAY",
          type: FIELD_TYPES.FORM_GROUP,
          label: "Sub Form Group with Nested Form Array",
          nestedElement: {
            type: FIELD_TYPES.FORM_GROUP,
            formLabel: "This is nested form group",
            references: {
              attributes: {
                ATTRIBUTE_ID: {
                  id: "ATTRIBUTE_ID",
                  type: FIELD_TYPES.AUTOCOMPLETE,
                  multiple: false,
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
                  validations: [
                    {
                      _refValidation: "required",
                    },
                  ],
                },
                FORM_ARRAY_OF_SINGLE_FIELD: {
                  id: "FORM_ARRAY_OF_SINGLE_FIELD",
                  type: FIELD_TYPES.FORM_ARRAY,
                  label: "Form Array of Single Field",
                  nestedElement: {
                    type: FIELD_TYPES.FORM_ARRAY,
                    formLabel: "This is nested form array",
                    references: {
                      attributes: {
                        TEXT_AREA: {
                          id: "TEXT_AREA",
                          type: FIELD_TYPES.TEXTAREA,
                          label: "Attribute TEXTAREA",
                          hint: "This is for testing purpose",
                          maxAllowedElementsInRow: 1,
                          validations: [
                            {
                              _refValidation: "required",
                            },
                          ],
                        },
                      },
                      validations: {
                        required: {
                          type: "required",
                          errorMessage: "This field is required",
                          regex: "^(?!s*$).+",
                        },
                      },
                      validationRelations: {},
                      showErrorAfterSubmit: false,
                    },
                    paragraphs: {
                      textAttributes: {
                        SAMPLE_TEXT: {
                          id: "SAMPLE_TEXT",
                          text: '<div style="color: red; font-weight: bold; margin-top: 10px;">The <I>criteria</I> parameter is <a href="https://example.com" target="_blank">Visit Example.com</a> a hash containing...{{TEXT_AREA}}</div>', // {{attribute}} or {{attribute.label}} add in this way for dynamic text
                          visibility: {
                            matchAllGroup: true,
                            matchConditionsGroup: true,
                            conditionGroups: [
                              [
                                {
                                  attributeType: "form-attribute",
                                  groupName: "A",
                                  description:
                                    "Show if start date is grater that end date",
                                  sourceAttribute: "DATE_END",
                                  condition: "less-than",
                                  conditionalAttribute: "DATE",
                                  // conditionValue: 'true'
                                },
                              ],
                            ],
                          },
                        },
                      },
                    },
                    elementsLayout: [
                      [{ _refAttributes: "TEXT_AREA" }],
                      [{ _paragraphAttributes: "SAMPLE_TEXT" }],
                    ],
                  },
                },
              },
              validations: {
                required: {
                  type: "required",
                  errorMessage: "This field is required",
                  regex: "^(?!s*$).+",
                },
              },
              validationRelations: {
                DATE_END: ["ATTRIBUTE_LABEL", "DATE"],
                DATE: ["ATTRIBUTE_LABEL"],
              },
              showErrorAfterSubmit: false,
            },
            paragraphs: { textAttributes: {} },
            elementsLayout: [
              [{ _refAttributes: "ATTRIBUTE_ID" }],
              [{ _refAttributes: "FORM_ARRAY_OF_SINGLE_FIELD" }],
            ],
          },
        },
        FORM_ARRAY_OF_SINGLE_FIELD: {
          id: "FORM_ARRAY_OF_SINGLE_FIELD",
          type: FIELD_TYPES.FORM_ARRAY,
          label: "Form Array of Single Field",
          nestedElement: {
            type: FIELD_TYPES.FORM_ARRAY,
            formLabel: "This is nested form array",
            references: {
              attributes: {
                TEXT_AREA: {
                  id: "TEXT_AREA",
                  type: FIELD_TYPES.TEXTAREA,
                  label: "Attribute TEXTAREA",
                  hint: "This is for testing purpose",
                  maxAllowedElementsInRow: 1,
                  validations: [
                    {
                      _refValidation: "required",
                    },
                  ],
                },
              },
              validations: {
                required: {
                  type: "required",
                  errorMessage: "This field is required",
                  regex: "^(?!s*$).+",
                },
              },
              validationRelations: {},
              showErrorAfterSubmit: false,
            },
            paragraphs: {
              textAttributes: {
                SAMPLE_TEXT: {
                  id: "SAMPLE_TEXT",
                  text: '<div style="color: red; font-weight: bold; margin-top: 10px;">The <I>criteria</I> parameter is <a href="https://example.com" target="_blank">Visit Example.com</a> a hash containing...{{TEXT_AREA}}</div>', // {{attribute}} or {{attribute.label}} add in this way for dynamic text
                  visibility: {
                    matchAllGroup: true,
                    matchConditionsGroup: true,
                    conditionGroups: [
                      [
                        {
                          attributeType: "form-attribute",
                          groupName: "A",
                          description:
                            "Show if start date is grater that end date",
                          sourceAttribute: "DATE_END",
                          condition: "less-than",
                          conditionalAttribute: "DATE",
                          // conditionValue: 'true'
                        },
                      ],
                    ],
                  },
                },
              },
            },
            elementsLayout: [
              [{ _refAttributes: "TEXT_AREA" }],
              [{ _paragraphAttributes: "SAMPLE_TEXT" }],
            ],
          },
        },
        FORM_ARRAY_OF_FORM_GROUP: {
          id: "FORM_ARRAY_OF_FORM_GROUP",
          type: FIELD_TYPES.FORM_ARRAY,
          label: "Form Array of Form Group",
          nestedElement: {
            type: FIELD_TYPES.FORM_ARRAY,
            formLabel: "This is nested form array",
            elementsLayout: [[{ _refAttributes: "SUB_FORM_GROUP" }]],
            paragraphs: { textAttributes: {} },
            references: {
              attributes: {
                SUB_FORM_GROUP: {
                  id: "SUB_FORM_GROUP",
                  type: FIELD_TYPES.FORM_GROUP,
                  label: "This is sub form group",
                  nestedElement: {
                    type: FIELD_TYPES.FORM_GROUP,
                    formLabel: "This is nested form group",
                    references: {
                      attributes: {
                        ATTRIBUTE_ID: {
                          id: "ATTRIBUTE_ID",
                          type: FIELD_TYPES.AUTOCOMPLETE,
                          multiple: false,
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
                          validations: [
                            {
                              _refValidation: "required",
                            },
                          ],
                        },
                        ATTRIBUTE_TYPE: {
                          id: "ATTRIBUTE_TYPE",
                          type: FIELD_TYPES.SELECT,
                          multiple: false,
                          label: "Attribute Type",
                          initialValue: FIELD_TYPES.BASIC,
                          staticSelection: {
                            options: [
                              { value: FIELD_TYPES.BASIC, label: "Text Field" },
                              {
                                value: FIELD_TYPES.AUTOCOMPLETE,
                                label: "Autocomplete Input",
                              },
                              { value: FIELD_TYPES.NUMBER, label: "Number" },
                              { value: FIELD_TYPES.SELECT, label: "Select" },
                              {
                                value: FIELD_TYPES.TEXTAREA,
                                label: "Text Area",
                              },
                              { value: FIELD_TYPES.DATE, label: "Date" },
                              {
                                value: FIELD_TYPES.CHIPS_SELECT,
                                label: "Single Selection Chips",
                              },
                              {
                                value: FIELD_TYPES.RADIO_BUTTON,
                                label: "Radio Buttons",
                              },
                              {
                                value: FIELD_TYPES.CHECKBOX,
                                label: "Checkbox",
                              },
                              {
                                value: FIELD_TYPES.PASSWORD,
                                label: "Password",
                              },
                            ],
                          },
                          editableLogic: {
                            allWaysEditable: true,
                          },
                          validations: [
                            {
                              _refValidation: "required",
                            },
                          ],
                        },
                        ATTRIBUTE_SELECT_MULTIPLE: {
                          id: "ATTRIBUTE_SELECT_MULTIPLE",
                          type: FIELD_TYPES.SELECT,
                          label: "Attribute Type multiple select",
                          multiple: true,
                          initialValue: [FIELD_TYPES.BASIC],
                          staticSelection: {
                            options: [
                              { value: FIELD_TYPES.BASIC, label: "Text Field" },
                              {
                                value: FIELD_TYPES.AUTOCOMPLETE,
                                label: "Autocomplete Input",
                              },
                              { value: FIELD_TYPES.NUMBER, label: "Number" },
                              { value: FIELD_TYPES.SELECT, label: "Select" },
                              {
                                value: FIELD_TYPES.TEXTAREA,
                                label: "Text Area",
                              },
                              { value: FIELD_TYPES.DATE, label: "Date" },
                              {
                                value: FIELD_TYPES.CHIPS_INPUT,
                                label: "Chips Input",
                              },
                              {
                                value: FIELD_TYPES.CHIPS_SELECT,
                                label: "Chips Select",
                              },
                              {
                                value: FIELD_TYPES.RADIO_BUTTON,
                                label: "Radio Buttons",
                              },
                              {
                                value: FIELD_TYPES.CHECKBOX,
                                label: "Checkbox",
                              },
                              {
                                value: FIELD_TYPES.PASSWORD,
                                label: "Password",
                              },
                            ],
                          },
                          validations: [
                            {
                              _refValidation: "required",
                            },
                          ],
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
                                  attributeType: "form-attribute",
                                  groupName: "A",
                                  description:
                                    "Show if basic input is used for label",
                                  sourceAttribute: "USE_RICH_TEXT",
                                  condition: "equal",
                                  conditionValue: "false",
                                },
                              ],
                            ],
                          },
                          // Note: If any object is empty then remove it
                          editableLogic: {
                            // readonly: true,
                            // allWaysEditable: true,
                            statuses: ["Disclosed"],
                            matchAllGroup: true,
                            matchConditionsGroup: true,
                            conditionGroups: [
                              [
                                {
                                  attributeType: "form-attribute",
                                  groupName: "A",
                                  description:
                                    "Show if text in attribute label",
                                  sourceAttribute: "ATTRIBUTE_TYPE",
                                  condition: "regex",
                                  conditionValue: ".+",
                                },
                              ],
                            ],
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
                                      description:
                                        "End date should be greater than start date",
                                      sourceAttribute: "DATE", // Store form attribute
                                      condition: "less-than", // provided static value to compare with current value of attribute
                                      conditionalAttribute: "DATE_END",
                                    },
                                  ],
                                ],
                              },
                            },
                          ],
                        },
                        ATTRIBUTE_COUNT: {
                          id: "ATTRIBUTE_COUNT",
                          type: FIELD_TYPES.NUMBER,
                          label: "Attribute Count",
                          hint: "This is for testing purpose",
                          validations: [
                            {
                              _refValidation: "required",
                            },
                          ],
                        },
                        ATTRIBUTE_LABEL_RTE: {
                          id: "ATTRIBUTE_LABEL_RTE",
                          type: FIELD_TYPES.RICH_TEXT,
                          label: "Attribute Label",
                          hint: "Write label to show for this attribute field",
                          placeholder: "Attribute Label",
                          visibility: {
                            statuses: ["Unsaved"],
                            matchAllGroup: true,
                            matchConditionsGroup: true,
                            conditionGroups: [
                              [
                                {
                                  attributeType: "form-attribute",
                                  groupName: "A",
                                  description:
                                    "Show if rich text editor is used for label",
                                  sourceAttribute: "USE_RICH_TEXT",
                                  condition: "equal",
                                  conditionValue: "true",
                                },
                              ],
                            ],
                          },
                          validations: [
                            {
                              _refValidation: "required",
                            },
                          ],
                        },
                        USE_RICH_TEXT: {
                          id: "USE_RICH_TEXT",
                          type: FIELD_TYPES.CHECKBOX,
                          label: "Use reach text editor for label",
                          validations: [
                            {
                              _refValidation: "required",
                            },
                          ],
                        },
                        TEXT_AREA: {
                          id: "TEXT_AREA",
                          type: FIELD_TYPES.TEXTAREA,
                          label: "Attribute TEXTAREA",
                          hint: "This is for testing purpose",
                          validations: [
                            {
                              _refValidation: "required",
                            },
                          ],
                        },
                        DATE: {
                          id: "DATE",
                          type: FIELD_TYPES.DATE,
                          placeholder: "MMMM Do, YYYY",
                          label: "Attribute DATE",
                          dateFormat: "MMMM Do, YYYY",
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
                                      description:
                                        "End date should be greater than start date",
                                      // sourceAttribute: 'DATE', // Store form attribute
                                      condition: "less-than", // provided static value to compare with current value of attribute
                                      conditionalAttribute: "DATE_END",
                                    },
                                  ],
                                ],
                              },
                            },
                          ],
                        },
                        DATE_END: {
                          id: "DATE",
                          type: FIELD_TYPES.DATE,
                          placeholder: "DD-MM-YYYY",
                          label: "Attribute End DATE",
                          hint: "This is for testing purpose",
                          dateFormat: "DD-MM-YYYY",
                          validations: [
                            {
                              _refValidation: "required",
                            },
                          ],
                        },
                        ATTRIBUTE_RADIO: {
                          id: "ATTRIBUTE_RADIO",
                          type: FIELD_TYPES.RADIO_BUTTON,
                          label: "Attribute Radio Button",
                          direction: DIRECTION.HORIZONTAL,
                          staticSelection: {
                            options: [
                              { value: FIELD_TYPES.BASIC, label: "Text Field" },
                              {
                                value: FIELD_TYPES.AUTOCOMPLETE,
                                label: "Autocomplete Input",
                              },
                              { value: FIELD_TYPES.NUMBER, label: "Number" },
                            ],
                          },
                          validations: [
                            {
                              _refValidation: "required",
                            },
                          ],
                        },
                        ATTRIBUTE_INPUT_CHIPS: {
                          id: "ATTRIBUTE_INPUT_CHIPS",
                          type: FIELD_TYPES.CHIPS_INPUT,
                          label: "Attribute Chips Input",
                          hint: "This is for testing purpose",
                          validations: [
                            {
                              _refValidation: "required",
                            },
                          ],
                        },
                        ATTRIBUTE_CHIPS_MULTI: {
                          id: "ATTRIBUTE_CHIPS_MULTI",
                          type: FIELD_TYPES.CHIPS_SELECT,
                          label: "Attribute CHIPS",
                          direction: DIRECTION.HORIZONTAL,
                          multiple: true,
                          staticSelection: {
                            options: [
                              { value: FIELD_TYPES.BASIC, label: "Text Field" },
                              {
                                value: FIELD_TYPES.AUTOCOMPLETE,
                                label: "Autocomplete Input",
                              },
                              { value: FIELD_TYPES.NUMBER, label: "Number" },
                            ],
                          },
                          validations: [
                            {
                              _refValidation: "required",
                            },
                          ],
                        },
                        ATTRIBUTE_CHIPS_MULTI_OBJECT_VALUE: {
                          id: "ATTRIBUTE_CHIPS_MULTI_OBJECT_VALUE",
                          type: FIELD_TYPES.CHIPS_SELECT,
                          label:
                            "Attribute CHIPS Multi select with Object values",
                          direction: DIRECTION.HORIZONTAL,
                          multiple: true,
                          staticSelection: {
                            options: [
                              {
                                value: {
                                  value: FIELD_TYPES.BASIC,
                                  label: "Text Field",
                                },
                                label: "Text Field",
                              },
                              {
                                value: {
                                  value: FIELD_TYPES.AUTOCOMPLETE,
                                  label: "Autocomplete Input",
                                },
                                label: "Autocomplete Input",
                              },
                              {
                                value: {
                                  value: FIELD_TYPES.NUMBER,
                                  label: "Number",
                                },
                                label: "Number",
                              },
                            ],
                          },
                          validations: [
                            {
                              _refValidation: "required",
                            },
                          ],
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
                              {
                                value: FIELD_TYPES.AUTOCOMPLETE,
                                label: "Autocomplete Input",
                              },
                              { value: FIELD_TYPES.NUMBER, label: "Number" },
                            ],
                          },
                          validations: [
                            {
                              _refValidation: "required",
                            },
                          ],
                        },
                        ATTRIBUTE_TYPE_GET_SERVER_OPTIONS: {
                          id: "ATTRIBUTE_TYPE_GET_SERVER_OPTIONS",
                          type: FIELD_TYPES.SELECT,
                          multiple: true,
                          label: "Options from API call with multiple select",
                          get: {
                            from: "http://localhost:3000/options",
                            mapping: {
                              label: "attribute_name|attribute_type",
                            },
                          },
                          validations: [
                            {
                              _refValidation: "required",
                            },
                          ],
                        },
                        ATTRIBUTE_SELECT_MULTIPLE_WITH_OBJECT_VALUE: {
                          id: "ATTRIBUTE_SELECT_MULTIPLE_WITH_OBJECT_VALUE",
                          type: FIELD_TYPES.SELECT,
                          label: "Attribute Type multiple select object value",
                          multiple: true,
                          initialValue: [
                            { value: FIELD_TYPES.BASIC, label: "Text Field" },
                          ],
                          staticSelection: {
                            options: [
                              {
                                value: {
                                  value: FIELD_TYPES.BASIC,
                                  label: "Text Field",
                                },
                                label: "Text Field",
                              },
                              {
                                value: {
                                  value: FIELD_TYPES.AUTOCOMPLETE,
                                  label: "Autocomplete Input",
                                },
                                label: "Autocomplete Input",
                              },
                              {
                                value: {
                                  value: FIELD_TYPES.NUMBER,
                                  label: "Number",
                                },
                                label: "Number",
                              },
                              {
                                value: {
                                  value: FIELD_TYPES.SELECT,
                                  label: "Select",
                                },
                                label: "Select",
                              },
                              {
                                value: {
                                  value: FIELD_TYPES.TEXTAREA,
                                  label: "Text Area",
                                },
                                label: "Text Area",
                              },
                              {
                                value: {
                                  value: FIELD_TYPES.DATE,
                                  label: "Date",
                                },
                                label: "Date",
                              },
                              {
                                value: {
                                  value: FIELD_TYPES.CHIPS_INPUT,
                                  label: "Chips Input",
                                },
                                label: "Chips Input",
                              },
                              {
                                value: {
                                  value: FIELD_TYPES.CHIPS_SELECT,
                                  label: "Chips Select",
                                },
                                label: "Chips Select",
                              },
                              {
                                value: {
                                  value: FIELD_TYPES.RADIO_BUTTON,
                                  label: "Radio Buttons",
                                },
                                label: "Radio Buttons",
                              },
                              {
                                value: {
                                  value: FIELD_TYPES.CHECKBOX,
                                  label: "Checkbox",
                                },
                                label: "Checkbox",
                              },
                              {
                                value: {
                                  value: FIELD_TYPES.PASSWORD,
                                  label: "Password",
                                },
                                label: "Password",
                              },
                            ],
                          },
                          validations: [
                            {
                              _refValidation: "required",
                            },
                          ],
                        },
                        ATTRIBUTE_SELECT_SINGLE_WITH_OBJECT_VALUE: {
                          id: "ATTRIBUTE_SELECT_SINGLE_WITH_OBJECT_VALUE",
                          type: FIELD_TYPES.SELECT,
                          multiple: false,
                          label: "Attribute Type single select object value",
                          initialValue: {
                            value: FIELD_TYPES.BASIC,
                            label: "Text Field",
                          },
                          staticSelection: {
                            options: [
                              {
                                value: {
                                  value: FIELD_TYPES.BASIC,
                                  label: "Text Field",
                                },
                                label: "Text Field",
                              },
                              {
                                value: {
                                  value: FIELD_TYPES.AUTOCOMPLETE,
                                  label: "Autocomplete Input",
                                },
                                label: "Autocomplete Input",
                              },
                              {
                                value: {
                                  value: FIELD_TYPES.NUMBER,
                                  label: "Number",
                                },
                                label: "Number",
                              },
                              {
                                value: {
                                  value: FIELD_TYPES.SELECT,
                                  label: "Select",
                                },
                                label: "Select",
                              },
                              {
                                value: {
                                  value: FIELD_TYPES.TEXTAREA,
                                  label: "Text Area",
                                },
                                label: "Text Area",
                              },
                              {
                                value: {
                                  value: FIELD_TYPES.DATE,
                                  label: "Date",
                                },
                                label: "Date",
                              },
                              {
                                value: {
                                  value: FIELD_TYPES.CHIPS_INPUT,
                                  label: "Chips Input",
                                },
                                label: "Chips Input",
                              },
                              {
                                value: {
                                  value: FIELD_TYPES.CHIPS_SELECT,
                                  label: "Chips Select",
                                },
                                label: "Chips Select",
                              },
                              {
                                value: {
                                  value: FIELD_TYPES.RADIO_BUTTON,
                                  label: "Radio Buttons",
                                },
                                label: "Radio Buttons",
                              },
                              {
                                value: {
                                  value: FIELD_TYPES.CHECKBOX,
                                  label: "Checkbox",
                                },
                                label: "Checkbox",
                              },
                              {
                                value: {
                                  value: FIELD_TYPES.PASSWORD,
                                  label: "Password",
                                },
                                label: "Password",
                              },
                            ],
                          },
                          validations: [
                            {
                              _refValidation: "required",
                            },
                          ],
                        },
                      },
                      validations: {
                        required: {
                          type: "required",
                          errorMessage: "This field is required",
                          regex: "^(?!s*$).+",
                        },
                      },
                      validationRelations: {
                        DATE_END: ["ATTRIBUTE_LABEL", "DATE"],
                        DATE: ["ATTRIBUTE_LABEL"],
                      },
                      showErrorAfterSubmit: false,
                    },
                    paragraphs: {
                      textAttributes: {
                        SAMPLE_TEXT: {
                          id: "SAMPLE_TEXT",
                          text: '<div style="color: red; font-weight: bold; margin-top: 10px;">The <I>criteria</I> parameter is <a href="https://example.com" target="_blank">Visit Example.com</a> a hash containing...{{TEXT_AREA}}</div>', // {{attribute}} or {{attribute.label}} add in this way for dynamic text
                          visibility: {
                            matchAllGroup: true,
                            matchConditionsGroup: true,
                            conditionGroups: [
                              [
                                {
                                  attributeType: "form-attribute",
                                  groupName: "A",
                                  description:
                                    "Show if start date is grater that end date",
                                  sourceAttribute: "DATE_END",
                                  condition: "less-than",
                                  conditionalAttribute: "DATE",
                                  // conditionValue: 'true'
                                },
                              ],
                            ],
                          },
                        },
                      },
                    },
                    elementsLayout: [
                      [
                        { _refAttributes: "ATTRIBUTE_ID" },
                        { _refAttributes: "ATTRIBUTE_TYPE" },
                      ],
                      [
                        { _refAttributes: "ATTRIBUTE_LABEL" },
                        { _refAttributes: "ATTRIBUTE_COUNT" },
                      ],
                      [{ _paragraphAttributes: "SAMPLE_TEXT" }],
                      [
                        { _refAttributes: "DATE" },
                        { _refAttributes: "DATE_END" },
                      ],
                      [{ _refAttributes: "ATTRIBUTE_LABEL_RTE" }],
                      [{ _refAttributes: "USE_RICH_TEXT" }],
                      [
                        { _refAttributes: "TEXT_AREA" },
                        { _refAttributes: "ATTRIBUTE_INPUT_CHIPS" },
                      ],
                      [
                        { _refAttributes: "ATTRIBUTE_RADIO" },
                        { _refAttributes: "ATTRIBUTE_SELECT_MULTIPLE" },
                      ],
                      [
                        { _refAttributes: "ATTRIBUTE_CHIPS_MULTI" },
                        { _refAttributes: "ATTRIBUTE_CHECKBOX_GROUP" },
                      ],
                      [
                        { _refAttributes: "ATTRIBUTE_TYPE_GET_SERVER_OPTIONS" },
                        {
                          _refAttributes:
                            "ATTRIBUTE_SELECT_MULTIPLE_WITH_OBJECT_VALUE",
                        },
                      ],
                      [
                        {
                          _refAttributes:
                            "ATTRIBUTE_SELECT_SINGLE_WITH_OBJECT_VALUE",
                        },
                        {
                          _refAttributes: "ATTRIBUTE_CHIPS_MULTI_OBJECT_VALUE",
                        },
                      ],
                    ],
                  },
                },
              },
              validations: {},
              showErrorAfterSubmit: true,
              validationRelations: {},
            },
          },
        },
        FORM_ARRAY_WITH_NESTED_SINGLE_FIELD_WITH_FORM_GROUP: {
          id: "FORM_ARRAY_WITH_NESTED_SINGLE_FIELD_WITH_FORM_GROUP",
          type: FIELD_TYPES.FORM_ARRAY,
          label: "Form Array with Nested Single Field OF Form Group",
          nestedElement: {
            type: FIELD_TYPES.FORM_ARRAY,
            formLabel: "Nested Form Array",
            references: {
              attributes: {
                FORM_ARRAY_OF_FORM_GROUP: {
                  id: "FORM_ARRAY_OF_FORM_GROUP",
                  type: FIELD_TYPES.FORM_ARRAY,
                  label: "Form Array of Form Group",
                  nestedElement: {
                    type: FIELD_TYPES.FORM_ARRAY,
                    formLabel: "This is nested form array",
                    elementsLayout: [[{ _refAttributes: "SUB_FORM_GROUP" }]],
                    paragraphs: { textAttributes: {} },
                    references: {
                      attributes: {
                        SUB_FORM_GROUP: {
                          id: "SUB_FORM_GROUP",
                          type: FIELD_TYPES.FORM_GROUP,
                          label: "This is sub form group",
                          nestedElement: {
                            type: FIELD_TYPES.FORM_GROUP,
                            formLabel: "This is nested form group",
                            references: {
                              attributes: {
                                ATTRIBUTE_ID: {
                                  id: "ATTRIBUTE_ID",
                                  type: FIELD_TYPES.AUTOCOMPLETE,
                                  multiple: false,
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
                                  validations: [
                                    {
                                      _refValidation: "required",
                                    },
                                  ],
                                },
                                ATTRIBUTE_TYPE: {
                                  id: "ATTRIBUTE_TYPE",
                                  type: FIELD_TYPES.SELECT,
                                  multiple: false,
                                  label: "Attribute Type",
                                  initialValue: FIELD_TYPES.BASIC,
                                  staticSelection: {
                                    options: [
                                      {
                                        value: FIELD_TYPES.BASIC,
                                        label: "Text Field",
                                      },
                                      {
                                        value: FIELD_TYPES.AUTOCOMPLETE,
                                        label: "Autocomplete Input",
                                      },
                                      {
                                        value: FIELD_TYPES.NUMBER,
                                        label: "Number",
                                      },
                                      {
                                        value: FIELD_TYPES.SELECT,
                                        label: "Select",
                                      },
                                      {
                                        value: FIELD_TYPES.TEXTAREA,
                                        label: "Text Area",
                                      },
                                      {
                                        value: FIELD_TYPES.DATE,
                                        label: "Date",
                                      },
                                      {
                                        value: FIELD_TYPES.CHIPS_SELECT,
                                        label: "Single Selection Chips",
                                      },
                                      {
                                        value: FIELD_TYPES.RADIO_BUTTON,
                                        label: "Radio Buttons",
                                      },
                                      {
                                        value: FIELD_TYPES.CHECKBOX,
                                        label: "Checkbox",
                                      },
                                      {
                                        value: FIELD_TYPES.PASSWORD,
                                        label: "Password",
                                      },
                                    ],
                                  },
                                  editableLogic: {
                                    allWaysEditable: true,
                                  },
                                  validations: [
                                    {
                                      _refValidation: "required",
                                    },
                                  ],
                                },
                                ATTRIBUTE_SELECT_MULTIPLE: {
                                  id: "ATTRIBUTE_SELECT_MULTIPLE",
                                  type: FIELD_TYPES.SELECT,
                                  label: "Attribute Type multiple select",
                                  multiple: true,
                                  initialValue: [FIELD_TYPES.BASIC],
                                  staticSelection: {
                                    options: [
                                      {
                                        value: FIELD_TYPES.BASIC,
                                        label: "Text Field",
                                      },
                                      {
                                        value: FIELD_TYPES.AUTOCOMPLETE,
                                        label: "Autocomplete Input",
                                      },
                                      {
                                        value: FIELD_TYPES.NUMBER,
                                        label: "Number",
                                      },
                                      {
                                        value: FIELD_TYPES.SELECT,
                                        label: "Select",
                                      },
                                      {
                                        value: FIELD_TYPES.TEXTAREA,
                                        label: "Text Area",
                                      },
                                      {
                                        value: FIELD_TYPES.DATE,
                                        label: "Date",
                                      },
                                      {
                                        value: FIELD_TYPES.CHIPS_INPUT,
                                        label: "Chips Input",
                                      },
                                      {
                                        value: FIELD_TYPES.CHIPS_SELECT,
                                        label: "Chips Select",
                                      },
                                      {
                                        value: FIELD_TYPES.RADIO_BUTTON,
                                        label: "Radio Buttons",
                                      },
                                      {
                                        value: FIELD_TYPES.CHECKBOX,
                                        label: "Checkbox",
                                      },
                                      {
                                        value: FIELD_TYPES.PASSWORD,
                                        label: "Password",
                                      },
                                    ],
                                  },
                                  validations: [
                                    {
                                      _refValidation: "required",
                                    },
                                  ],
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
                                          attributeType: "form-attribute",
                                          groupName: "A",
                                          description:
                                            "Show if basic input is used for label",
                                          sourceAttribute: "USE_RICH_TEXT",
                                          condition: "equal",
                                          conditionValue: "false",
                                        },
                                      ],
                                    ],
                                  },
                                  // Note: If any object is empty then remove it
                                  editableLogic: {
                                    // readonly: true,
                                    // allWaysEditable: true,
                                    statuses: ["Disclosed"],
                                    matchAllGroup: true,
                                    matchConditionsGroup: true,
                                    conditionGroups: [
                                      [
                                        {
                                          attributeType: "form-attribute",
                                          groupName: "A",
                                          description:
                                            "Show if text in attribute label",
                                          sourceAttribute: "ATTRIBUTE_TYPE",
                                          condition: "regex",
                                          conditionValue: ".+",
                                        },
                                      ],
                                    ],
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
                                              description:
                                                "End date should be greater than start date",
                                              sourceAttribute: "DATE", // Store form attribute
                                              condition: "less-than", // provided static value to compare with current value of attribute
                                              conditionalAttribute: "DATE_END",
                                            },
                                          ],
                                        ],
                                      },
                                    },
                                  ],
                                },
                                ATTRIBUTE_COUNT: {
                                  id: "ATTRIBUTE_COUNT",
                                  type: FIELD_TYPES.NUMBER,
                                  label: "Attribute Count",
                                  hint: "This is for testing purpose",
                                  validations: [
                                    {
                                      _refValidation: "required",
                                    },
                                  ],
                                },
                                ATTRIBUTE_LABEL_RTE: {
                                  id: "ATTRIBUTE_LABEL_RTE",
                                  type: FIELD_TYPES.RICH_TEXT,
                                  label: "Attribute Label",
                                  hint: "Write label to show for this attribute field",
                                  placeholder: "Attribute Label",
                                  visibility: {
                                    statuses: ["Unsaved"],
                                    matchAllGroup: true,
                                    matchConditionsGroup: true,
                                    conditionGroups: [
                                      [
                                        {
                                          attributeType: "form-attribute",
                                          groupName: "A",
                                          description:
                                            "Show if rich text editor is used for label",
                                          sourceAttribute: "USE_RICH_TEXT",
                                          condition: "equal",
                                          conditionValue: "true",
                                        },
                                      ],
                                    ],
                                  },
                                  validations: [
                                    {
                                      _refValidation: "required",
                                    },
                                  ],
                                },
                                USE_RICH_TEXT: {
                                  id: "USE_RICH_TEXT",
                                  type: FIELD_TYPES.CHECKBOX,
                                  label: "Use reach text editor for label",
                                  validations: [
                                    {
                                      _refValidation: "required",
                                    },
                                  ],
                                },
                                TEXT_AREA: {
                                  id: "TEXT_AREA",
                                  type: FIELD_TYPES.TEXTAREA,
                                  label: "Attribute TEXTAREA",
                                  hint: "This is for testing purpose",
                                  validations: [
                                    {
                                      _refValidation: "required",
                                    },
                                  ],
                                },
                                DATE: {
                                  id: "DATE",
                                  type: FIELD_TYPES.DATE,
                                  placeholder: "MMMM Do, YYYY",
                                  label: "Attribute DATE",
                                  dateFormat: "MMMM Do, YYYY",
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
                                              description:
                                                "End date should be greater than start date",
                                              // sourceAttribute: 'DATE', // Store form attribute
                                              condition: "less-than", // provided static value to compare with current value of attribute
                                              conditionalAttribute: "DATE_END",
                                            },
                                          ],
                                        ],
                                      },
                                    },
                                  ],
                                },
                                DATE_END: {
                                  id: "DATE",
                                  type: FIELD_TYPES.DATE,
                                  placeholder: "DD-MM-YYYY",
                                  label: "Attribute End DATE",
                                  hint: "This is for testing purpose",
                                  dateFormat: "DD-MM-YYYY",
                                  validations: [
                                    {
                                      _refValidation: "required",
                                    },
                                  ],
                                },
                                ATTRIBUTE_RADIO: {
                                  id: "ATTRIBUTE_RADIO",
                                  type: FIELD_TYPES.RADIO_BUTTON,
                                  label: "Attribute Radio Button",
                                  direction: DIRECTION.HORIZONTAL,
                                  staticSelection: {
                                    options: [
                                      {
                                        value: FIELD_TYPES.BASIC,
                                        label: "Text Field",
                                      },
                                      {
                                        value: FIELD_TYPES.AUTOCOMPLETE,
                                        label: "Autocomplete Input",
                                      },
                                      {
                                        value: FIELD_TYPES.NUMBER,
                                        label: "Number",
                                      },
                                    ],
                                  },
                                  validations: [
                                    {
                                      _refValidation: "required",
                                    },
                                  ],
                                },
                                ATTRIBUTE_INPUT_CHIPS: {
                                  id: "ATTRIBUTE_INPUT_CHIPS",
                                  type: FIELD_TYPES.CHIPS_INPUT,
                                  label: "Attribute Chips Input",
                                  hint: "This is for testing purpose",
                                  validations: [
                                    {
                                      _refValidation: "required",
                                    },
                                  ],
                                },
                                ATTRIBUTE_CHIPS_MULTI: {
                                  id: "ATTRIBUTE_CHIPS_MULTI",
                                  type: FIELD_TYPES.CHIPS_SELECT,
                                  label: "Attribute CHIPS",
                                  direction: DIRECTION.HORIZONTAL,
                                  multiple: true,
                                  staticSelection: {
                                    options: [
                                      {
                                        value: FIELD_TYPES.BASIC,
                                        label: "Text Field",
                                      },
                                      {
                                        value: FIELD_TYPES.AUTOCOMPLETE,
                                        label: "Autocomplete Input",
                                      },
                                      {
                                        value: FIELD_TYPES.NUMBER,
                                        label: "Number",
                                      },
                                    ],
                                  },
                                  validations: [
                                    {
                                      _refValidation: "required",
                                    },
                                  ],
                                },
                                ATTRIBUTE_CHIPS_MULTI_OBJECT_VALUE: {
                                  id: "ATTRIBUTE_CHIPS_MULTI_OBJECT_VALUE",
                                  type: FIELD_TYPES.CHIPS_SELECT,
                                  label:
                                    "Attribute CHIPS Multi select with Object values",
                                  direction: DIRECTION.HORIZONTAL,
                                  multiple: true,
                                  staticSelection: {
                                    options: [
                                      {
                                        value: {
                                          value: FIELD_TYPES.BASIC,
                                          label: "Text Field",
                                        },
                                        label: "Text Field",
                                      },
                                      {
                                        value: {
                                          value: FIELD_TYPES.AUTOCOMPLETE,
                                          label: "Autocomplete Input",
                                        },
                                        label: "Autocomplete Input",
                                      },
                                      {
                                        value: {
                                          value: FIELD_TYPES.NUMBER,
                                          label: "Number",
                                        },
                                        label: "Number",
                                      },
                                    ],
                                  },
                                  validations: [
                                    {
                                      _refValidation: "required",
                                    },
                                  ],
                                },
                                ATTRIBUTE_CHECKBOX_GROUP: {
                                  id: "ATTRIBUTE_CHECKBOX_GROUP",
                                  direction: DIRECTION.HORIZONTAL,
                                  type: FIELD_TYPES.CHECKBOX_GROUP,
                                  label: "Attribute Checkbox Group",
                                  multiple: true,
                                  staticSelection: {
                                    options: [
                                      {
                                        value: FIELD_TYPES.BASIC,
                                        label: "Text Field",
                                      },
                                      {
                                        value: FIELD_TYPES.AUTOCOMPLETE,
                                        label: "Autocomplete Input",
                                      },
                                      {
                                        value: FIELD_TYPES.NUMBER,
                                        label: "Number",
                                      },
                                    ],
                                  },
                                  validations: [
                                    {
                                      _refValidation: "required",
                                    },
                                  ],
                                },
                                ATTRIBUTE_TYPE_GET_SERVER_OPTIONS: {
                                  id: "ATTRIBUTE_TYPE_GET_SERVER_OPTIONS",
                                  type: FIELD_TYPES.SELECT,
                                  multiple: true,
                                  label:
                                    "Options from API call with multiple select",
                                  get: {
                                    from: "http://localhost:3000/options",
                                    mapping: {
                                      label: "attribute_name|attribute_type",
                                    },
                                  },
                                  validations: [
                                    {
                                      _refValidation: "required",
                                    },
                                  ],
                                },
                                ATTRIBUTE_SELECT_MULTIPLE_WITH_OBJECT_VALUE: {
                                  id: "ATTRIBUTE_SELECT_MULTIPLE_WITH_OBJECT_VALUE",
                                  type: FIELD_TYPES.SELECT,
                                  label:
                                    "Attribute Type multiple select object value",
                                  multiple: true,
                                  initialValue: [
                                    {
                                      value: FIELD_TYPES.BASIC,
                                      label: "Text Field",
                                    },
                                  ],
                                  staticSelection: {
                                    options: [
                                      {
                                        value: {
                                          value: FIELD_TYPES.BASIC,
                                          label: "Text Field",
                                        },
                                        label: "Text Field",
                                      },
                                      {
                                        value: {
                                          value: FIELD_TYPES.AUTOCOMPLETE,
                                          label: "Autocomplete Input",
                                        },
                                        label: "Autocomplete Input",
                                      },
                                      {
                                        value: {
                                          value: FIELD_TYPES.NUMBER,
                                          label: "Number",
                                        },
                                        label: "Number",
                                      },
                                      {
                                        value: {
                                          value: FIELD_TYPES.SELECT,
                                          label: "Select",
                                        },
                                        label: "Select",
                                      },
                                      {
                                        value: {
                                          value: FIELD_TYPES.TEXTAREA,
                                          label: "Text Area",
                                        },
                                        label: "Text Area",
                                      },
                                      {
                                        value: {
                                          value: FIELD_TYPES.DATE,
                                          label: "Date",
                                        },
                                        label: "Date",
                                      },
                                      {
                                        value: {
                                          value: FIELD_TYPES.CHIPS_INPUT,
                                          label: "Chips Input",
                                        },
                                        label: "Chips Input",
                                      },
                                      {
                                        value: {
                                          value: FIELD_TYPES.CHIPS_SELECT,
                                          label: "Chips Select",
                                        },
                                        label: "Chips Select",
                                      },
                                      {
                                        value: {
                                          value: FIELD_TYPES.RADIO_BUTTON,
                                          label: "Radio Buttons",
                                        },
                                        label: "Radio Buttons",
                                      },
                                      {
                                        value: {
                                          value: FIELD_TYPES.CHECKBOX,
                                          label: "Checkbox",
                                        },
                                        label: "Checkbox",
                                      },
                                      {
                                        value: {
                                          value: FIELD_TYPES.PASSWORD,
                                          label: "Password",
                                        },
                                        label: "Password",
                                      },
                                    ],
                                  },
                                  validations: [
                                    {
                                      _refValidation: "required",
                                    },
                                  ],
                                },
                                ATTRIBUTE_SELECT_SINGLE_WITH_OBJECT_VALUE: {
                                  id: "ATTRIBUTE_SELECT_SINGLE_WITH_OBJECT_VALUE",
                                  type: FIELD_TYPES.SELECT,
                                  multiple: false,
                                  label:
                                    "Attribute Type single select object value",
                                  initialValue: {
                                    value: FIELD_TYPES.BASIC,
                                    label: "Text Field",
                                  },
                                  staticSelection: {
                                    options: [
                                      {
                                        value: {
                                          value: FIELD_TYPES.BASIC,
                                          label: "Text Field",
                                        },
                                        label: "Text Field",
                                      },
                                      {
                                        value: {
                                          value: FIELD_TYPES.AUTOCOMPLETE,
                                          label: "Autocomplete Input",
                                        },
                                        label: "Autocomplete Input",
                                      },
                                      {
                                        value: {
                                          value: FIELD_TYPES.NUMBER,
                                          label: "Number",
                                        },
                                        label: "Number",
                                      },
                                      {
                                        value: {
                                          value: FIELD_TYPES.SELECT,
                                          label: "Select",
                                        },
                                        label: "Select",
                                      },
                                      {
                                        value: {
                                          value: FIELD_TYPES.TEXTAREA,
                                          label: "Text Area",
                                        },
                                        label: "Text Area",
                                      },
                                      {
                                        value: {
                                          value: FIELD_TYPES.DATE,
                                          label: "Date",
                                        },
                                        label: "Date",
                                      },
                                      {
                                        value: {
                                          value: FIELD_TYPES.CHIPS_INPUT,
                                          label: "Chips Input",
                                        },
                                        label: "Chips Input",
                                      },
                                      {
                                        value: {
                                          value: FIELD_TYPES.CHIPS_SELECT,
                                          label: "Chips Select",
                                        },
                                        label: "Chips Select",
                                      },
                                      {
                                        value: {
                                          value: FIELD_TYPES.RADIO_BUTTON,
                                          label: "Radio Buttons",
                                        },
                                        label: "Radio Buttons",
                                      },
                                      {
                                        value: {
                                          value: FIELD_TYPES.CHECKBOX,
                                          label: "Checkbox",
                                        },
                                        label: "Checkbox",
                                      },
                                      {
                                        value: {
                                          value: FIELD_TYPES.PASSWORD,
                                          label: "Password",
                                        },
                                        label: "Password",
                                      },
                                    ],
                                  },
                                  validations: [
                                    {
                                      _refValidation: "required",
                                    },
                                  ],
                                },
                              },
                              validations: {
                                required: {
                                  type: "required",
                                  errorMessage: "This field is required",
                                  regex: "^(?!s*$).+",
                                },
                              },
                              validationRelations: {
                                DATE_END: ["ATTRIBUTE_LABEL", "DATE"],
                                DATE: ["ATTRIBUTE_LABEL"],
                              },
                              showErrorAfterSubmit: false,
                            },
                            paragraphs: {
                              textAttributes: {
                                SAMPLE_TEXT: {
                                  id: "SAMPLE_TEXT",
                                  text: '<div style="color: red; font-weight: bold; margin-top: 10px;">The <I>criteria</I> parameter is <a href="https://example.com" target="_blank">Visit Example.com</a> a hash containing...{{TEXT_AREA}}</div>', // {{attribute}} or {{attribute.label}} add in this way for dynamic text
                                  visibility: {
                                    matchAllGroup: true,
                                    matchConditionsGroup: true,
                                    conditionGroups: [
                                      [
                                        {
                                          attributeType: "form-attribute",
                                          groupName: "A",
                                          description:
                                            "Show if start date is grater that end date",
                                          sourceAttribute: "DATE_END",
                                          condition: "less-than",
                                          conditionalAttribute: "DATE",
                                          // conditionValue: 'true'
                                        },
                                      ],
                                    ],
                                  },
                                },
                              },
                            },
                            elementsLayout: [
                              [
                                { _refAttributes: "ATTRIBUTE_ID" },
                                { _refAttributes: "ATTRIBUTE_TYPE" },
                              ],
                              [
                                { _refAttributes: "ATTRIBUTE_LABEL" },
                                { _refAttributes: "ATTRIBUTE_COUNT" },
                              ],
                              [{ _paragraphAttributes: "SAMPLE_TEXT" }],
                              [
                                { _refAttributes: "DATE" },
                                { _refAttributes: "DATE_END" },
                              ],
                              [{ _refAttributes: "ATTRIBUTE_LABEL_RTE" }],
                              [{ _refAttributes: "USE_RICH_TEXT" }],
                              [
                                { _refAttributes: "TEXT_AREA" },
                                { _refAttributes: "ATTRIBUTE_INPUT_CHIPS" },
                              ],
                              [
                                { _refAttributes: "ATTRIBUTE_RADIO" },
                                { _refAttributes: "ATTRIBUTE_SELECT_MULTIPLE" },
                              ],
                              [
                                { _refAttributes: "ATTRIBUTE_CHIPS_MULTI" },
                                { _refAttributes: "ATTRIBUTE_CHECKBOX_GROUP" },
                              ],
                              [
                                {
                                  _refAttributes:
                                    "ATTRIBUTE_TYPE_GET_SERVER_OPTIONS",
                                },
                                {
                                  _refAttributes:
                                    "ATTRIBUTE_SELECT_MULTIPLE_WITH_OBJECT_VALUE",
                                },
                              ],
                              [
                                {
                                  _refAttributes:
                                    "ATTRIBUTE_SELECT_SINGLE_WITH_OBJECT_VALUE",
                                },
                                {
                                  _refAttributes:
                                    "ATTRIBUTE_CHIPS_MULTI_OBJECT_VALUE",
                                },
                              ],
                            ],
                          },
                        },
                      },
                      validations: {},
                      showErrorAfterSubmit: true,
                      validationRelations: {},
                    },
                  },
                },
              },
              showErrorAfterSubmit: true,
              validationRelations: {},

              validations: {},
            },
            paragraphs: { textAttributes: {} },
            elementsLayout: [[{ _refAttributes: "FORM_ARRAY_OF_FORM_GROUP" }]],
          },
        },
        FORM_ARRAY_WITH_NESTED_FORM_GROUP_WITH_NESTED_ARRAY_OF_SINGLE_FIELD: {
          id: "FORM_ARRAY_WITH_NESTED_FORM_GROUP_WITH_NESTED_ARRAY_OF_SINGLE_FIELD",
          type: FIELD_TYPES.FORM_ARRAY,
          label:
            "Form Array with Nested Form Group OF Nested Array of Single Field",
          nestedElement: {
            type: FIELD_TYPES.FORM_ARRAY,
            formLabel: "Nested Form Array",
            references: {
              validations: {},
              validationRelations: {},
              showErrorAfterSubmit: true,
              attributes: {
                SUB_FORM_GROUP_WITH_NESTED_FORM_ARRAY: {
                  id: "SUB_FORM_GROUP_WITH_NESTED_FORM_ARRAY",
                  type: FIELD_TYPES.FORM_GROUP,
                  label: "Sub Form Group with Nested Form Array",
                  nestedElement: {
                    type: FIELD_TYPES.FORM_GROUP,
                    formLabel: "This is nested form group",
                    references: {
                      attributes: {
                        ATTRIBUTE_ID: {
                          id: "ATTRIBUTE_ID",
                          type: FIELD_TYPES.AUTOCOMPLETE,
                          multiple: false,
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
                          validations: [
                            {
                              _refValidation: "required",
                            },
                          ],
                        },
                        FORM_ARRAY_OF_SINGLE_FIELD: {
                          id: "FORM_ARRAY_OF_SINGLE_FIELD",
                          type: FIELD_TYPES.FORM_ARRAY,
                          label: "Form Array of Single Field",
                          nestedElement: {
                            type: FIELD_TYPES.FORM_ARRAY,
                            formLabel: "This is nested form array",
                            references: {
                              attributes: {
                                TEXT_AREA: {
                                  id: "TEXT_AREA",
                                  type: FIELD_TYPES.TEXTAREA,
                                  label: "Attribute TEXTAREA",
                                  hint: "This is for testing purpose",
                                  maxAllowedElementsInRow: 1,
                                  validations: [
                                    {
                                      _refValidation: "required",
                                    },
                                  ],
                                },
                              },
                              validations: {
                                required: {
                                  type: "required",
                                  errorMessage: "This field is required",
                                  regex: "^(?!s*$).+",
                                },
                              },
                              validationRelations: {},
                              showErrorAfterSubmit: false,
                            },
                            paragraphs: {
                              textAttributes: {
                                SAMPLE_TEXT: {
                                  id: "SAMPLE_TEXT",
                                  text: '<div style="color: red; font-weight: bold; margin-top: 10px;">The <I>criteria</I> parameter is <a href="https://example.com" target="_blank">Visit Example.com</a> a hash containing...{{TEXT_AREA}}</div>', // {{attribute}} or {{attribute.label}} add in this way for dynamic text
                                  visibility: {
                                    matchAllGroup: true,
                                    matchConditionsGroup: true,
                                    conditionGroups: [
                                      [
                                        {
                                          attributeType: "form-attribute",
                                          groupName: "A",
                                          description:
                                            "Show if start date is grater that end date",
                                          sourceAttribute: "DATE_END",
                                          condition: "less-than",
                                          conditionalAttribute: "DATE",
                                          // conditionValue: 'true'
                                        },
                                      ],
                                    ],
                                  },
                                },
                              },
                            },
                            elementsLayout: [
                              [{ _refAttributes: "TEXT_AREA" }],
                              [{ _paragraphAttributes: "SAMPLE_TEXT" }],
                            ],
                          },
                        },
                      },
                      validations: {
                        required: {
                          type: "required",
                          errorMessage: "This field is required",
                          regex: "^(?!s*$).+",
                        },
                      },
                      validationRelations: {
                        DATE_END: ["ATTRIBUTE_LABEL", "DATE"],
                        DATE: ["ATTRIBUTE_LABEL"],
                      },
                      showErrorAfterSubmit: false,
                    },
                    paragraphs: { textAttributes: {} },
                    elementsLayout: [
                      [{ _refAttributes: "ATTRIBUTE_ID" }],
                      [{ _refAttributes: "FORM_ARRAY_OF_SINGLE_FIELD" }],
                    ],
                  },
                },
              },
            },
            paragraphs: { textAttributes: {} },
            elementsLayout: [
              [{ _refAttributes: "SUB_FORM_GROUP_WITH_NESTED_FORM_ARRAY" }],
            ],
          },
        },
      },
      validations: {
        required: {
          type: "required",
          errorMessage: "This field is required",
          regex: "^(?!s*$).+",
        },
      },
      validationRelations: {
        DATE_END: ["ATTRIBUTE_LABEL", "DATE"],
        DATE: ["ATTRIBUTE_LABEL"],
      },
      showErrorAfterSubmit: false,
    },
    paragraphs: {
      textAttributes: {
        SAMPLE_TEXT: {
          id: "SAMPLE_TEXT",
          text: '<div style="color: red; font-weight: bold; margin-top: 10px;">The <I>criteria</I> parameter is <a href="https://example.com" target="_blank">Visit Example.com</a> a hash containing...{{TEXT_AREA}}</div>', // {{attribute}} or {{attribute.label}} add in this way for dynamic text
          visibility: {
            matchAllGroup: true,
            matchConditionsGroup: true,
            conditionGroups: [
              [
                {
                  attributeType: "form-attribute",
                  groupName: "A",
                  description: "Show if start date is grater that end date",
                  sourceAttribute: "DATE_END",
                  condition: "less-than",
                  conditionalAttribute: "DATE",
                  // conditionValue: 'true'
                },
              ],
            ],
          },
        },
      },
    },
    actions: {
      justification: "justify-content-center",
      buttons: [
        {
          label: "Submit",
          color: "warn",
          type: "extended-fab",
          icon: "home",
          runValidation: true,
          nextStatus: "Disclosed",
          confirmationText: "Do you really want to save and proceed?",
          confirmBtnLabel: "Yes",
          cancelBtnLabel: "No",
          tooltip: "This is sample button",
          visibility: {
            statuses: ["Unsaved"],
            matchAllGroup: true,
            matchConditionsGroup: true,
            conditionGroups: [
              [
                {
                  attributeType: "form-attribute",
                  groupName: "A",
                  description: "Show if rich text editor is used for label",
                  sourceAttribute: "USE_RICH_TEXT",
                  condition: "equal",
                  conditionValue: "true",
                },
              ],
            ],
          },
        },
        {
          label: "Submit",
          color: "primary",
          type: "raised",
          icon: "home",
          runValidation: true,
          nextStatus: "Disclosed",
          confirmationText: "Do you really want to save and proceed?",
          confirmBtnLabel: "Yes",
          cancelBtnLabel: "No",
          tooltip: "This is sample button",
          // visibility?: AccessControls;
        },
      ],
    },
    elementsLayout: [
      [
        { _refAttributes: "ATTRIBUTE_ID" },
        { _refAttributes: "ATTRIBUTE_TYPE" },
      ],
      [
        { _refAttributes: "ATTRIBUTE_LABEL" },
        { _refAttributes: "ATTRIBUTE_COUNT" },
      ],
      [{ _paragraphAttributes: "SAMPLE_TEXT" }],
      [{ _refAttributes: "DATE" }, { _refAttributes: "DATE_END" }],
      [{ _refAttributes: "ATTRIBUTE_LABEL_RTE" }],
      [{ _refAttributes: "USE_RICH_TEXT" }],
      [
        { _refAttributes: "TEXT_AREA" },
        { _refAttributes: "ATTRIBUTE_INPUT_CHIPS" },
      ],
      [
        { _refAttributes: "ATTRIBUTE_RADIO" },
        { _refAttributes: "ATTRIBUTE_SELECT_MULTIPLE" },
      ],
      [
        { _refAttributes: "ATTRIBUTE_CHIPS_MULTI" },
        { _refAttributes: "ATTRIBUTE_CHECKBOX_GROUP" },
      ],
      [
        { _refAttributes: "ATTRIBUTE_TYPE_GET_SERVER_OPTIONS" },
        { _refAttributes: "ATTRIBUTE_SELECT_MULTIPLE_WITH_OBJECT_VALUE" },
      ],
      [
        { _refAttributes: "ATTRIBUTE_SELECT_SINGLE_WITH_OBJECT_VALUE" },
        { _refAttributes: "ATTRIBUTE_CHIPS_MULTI_OBJECT_VALUE" },
      ],
      [{ _refAttributes: "SUB_FORM_GROUP" }],
      [{ _refAttributes: "SUB_FORM_GROUP_WITH_NESTED_FORM_ARRAY" }],
      [{ _refAttributes: "FORM_ARRAY_OF_SINGLE_FIELD" }],
      [{ _refAttributes: "FORM_ARRAY_OF_SINGLE_FIELD_WITH_FORM_GROUP" }],
      [{ _refAttributes: "FORM_ARRAY_OF_SINGLE_FIELD_WITH_NESTED_FORM_ARRAY" }],
      [
        {
          _refAttributes:
            "FORM_ARRAY_OF_SINGLE_FIELD_WITH_NESTED_FORM_ARRAY_OF_SINGLE_FIELD",
        },
      ],
    ],
  },
  version_id: "ajadh83usdfbyHSYSB93nsjn",
};

// FormArray as main config, covers all cases (array of groups, array of fields, nested arrays)
export const attribute_editor_array: FormConfig = {
  disclosure_name: "UI Attribute Editor",
  disclosure_type: "ATTRIBUTE_EDITOR_ARRAY",
  ui: {
    type: "form-array",
    formLabel: "Form Array Attribute Editor",
    references: {
      attributes: {
        SUB_FORM_GROUP_WITH_NESTED_FORM_ARRAY: {
          id: "SUB_FORM_GROUP_WITH_NESTED_FORM_ARRAY",
          type: FIELD_TYPES.FORM_GROUP,
          label: "Sub Form Group with Nested Form Array",
          nestedElement: {
            type: FIELD_TYPES.FORM_GROUP,
            formLabel: "This is nested form group",
            references: {
              attributes: {
                ATTRIBUTE_ID: {
                  id: "ATTRIBUTE_ID",
                  type: FIELD_TYPES.AUTOCOMPLETE,
                  multiple: false,
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
                  validations: [
                    {
                      _refValidation: "required",
                    },
                  ],
                },
                FORM_ARRAY_OF_SINGLE_FIELD: {
                  id: "FORM_ARRAY_OF_SINGLE_FIELD",
                  type: FIELD_TYPES.FORM_ARRAY,
                  label: "Form Array of Single Field",
                  nestedElement: {
                    type: FIELD_TYPES.FORM_ARRAY,
                    formLabel: "This is nested form array",
                    references: {
                      attributes: {
                        TEXT_AREA: {
                          id: "TEXT_AREA",
                          type: FIELD_TYPES.TEXTAREA,
                          label: "Attribute TEXTAREA",
                          hint: "This is for testing purpose",
                          maxAllowedElementsInRow: 1,
                          validations: [
                            {
                              _refValidation: "required",
                            },
                          ],
                        },
                      },
                      validations: {
                        required: {
                          type: "required",
                          errorMessage: "This field is required",
                          regex: "^(?!s*$).+",
                        },
                      },
                      validationRelations: {},
                      showErrorAfterSubmit: false,
                    },
                    paragraphs: {
                      textAttributes: {
                        SAMPLE_TEXT: {
                          id: "SAMPLE_TEXT",
                          text: '<div style="color: red; font-weight: bold; margin-top: 10px;">The <I>criteria</I> parameter is <a href="https://example.com" target="_blank">Visit Example.com</a> a hash containing...{{TEXT_AREA}}</div>', // {{attribute}} or {{attribute.label}} add in this way for dynamic text
                          visibility: {
                            matchAllGroup: true,
                            matchConditionsGroup: true,
                            conditionGroups: [
                              [
                                {
                                  attributeType: "form-attribute",
                                  groupName: "A",
                                  description:
                                    "Show if start date is grater that end date",
                                  sourceAttribute: "DATE_END",
                                  condition: "less-than",
                                  conditionalAttribute: "DATE",
                                  // conditionValue: 'true'
                                },
                              ],
                            ],
                          },
                        },
                      },
                    },
                    elementsLayout: [
                      [{ _refAttributes: "TEXT_AREA" }],
                      [{ _paragraphAttributes: "SAMPLE_TEXT" }],
                    ],
                  },
                },
              },
              validations: {
                required: {
                  type: "required",
                  errorMessage: "This field is required",
                  regex: "^(?!s*$).+",
                },
              },
              validationRelations: {
                DATE_END: ["ATTRIBUTE_LABEL", "DATE"],
                DATE: ["ATTRIBUTE_LABEL"],
              },
              showErrorAfterSubmit: false,
            },
            paragraphs: { textAttributes: {} },
            elementsLayout: [
              [{ _refAttributes: "ATTRIBUTE_ID" }],
              [{ _refAttributes: "FORM_ARRAY_OF_SINGLE_FIELD" }],
            ],
          },
        },
      },
      validations: {
        required: {
          type: "required",
          errorMessage: "This field is required",
          regex: "^(?!s*$).+",
        },
      },
      validationRelations: {},
      showErrorAfterSubmit: true,
    },
    paragraphs: {
      textAttributes: {
        SAMPLE_TEXT: {
          id: "SAMPLE_TEXT",
          text: '<div style="color: red; font-weight: bold; margin-top: 10px;">The <I>criteria</I> parameter is <a href="https://example.com" target="_blank">Visit Example.com</a> a hash containing...</div>',
        },
      },
    },
    actions: attribute_editor.ui.actions,
    elementsLayout: [[{ _refAttributes: "SUB_FORM_GROUP_WITH_NESTED_FORM_ARRAY" }]],
  },
  version_id: "ajadh83usdfbyHSYSB93nsjn-array",
};

export const attribute_editor_single_field_array: FormConfig = {
  disclosure_name: "UI Attribute Editor",
  disclosure_type: "ATTRIBUTE_EDITOR_ARRAY",
  ui: {
    type: "form-array",
    formLabel: "Form Array Attribute Editor",
    references: {
      attributes: {
        ATTRIBUTE_ID: {
          id: "ATTRIBUTE_ID",
          type: FIELD_TYPES.AUTOCOMPLETE,
          multiple: false,
          label: "Attribute ID",
          hint: "Select attribute id from this <b>field<b>",
          placeholder: "Attribute ID",
          maxAllowedElementsInRow: 3,
          get: {
            from: "http://localhost:3000/options",
            mapping: {
              label: "attribute_name|attribute_type",
              value: "id",
            },
          },
          validations: [
            {
              _refValidation: "required",
            },
          ],
        },
      },
      validations: {
        required: {
          type: "required",
          errorMessage: "This field is required",
          regex: "^(?!s*$).+",
        },
      },
      validationRelations: {},
      showErrorAfterSubmit: true,
    },
    paragraphs: {
      textAttributes: {
        SAMPLE_TEXT: {
          id: "SAMPLE_TEXT",
          text: '<div style="color: red; font-weight: bold; margin-top: 10px;">The <I>criteria</I> parameter is <a href="https://example.com" target="_blank">Visit Example.com</a> a hash containing...</div>',
        },
      },
    },
    actions: attribute_editor.ui.actions,
    elementsLayout: [[{ _refAttributes: "ATTRIBUTE_ID" }]],
  },
  version_id: "ajadh83usdfbyHSYSB93nsjn-array",
};
