export const UNSAVED = 'Unsaved';
export const VISIBILITY = 'visibility';
export const EDITABLE_LOGIC = 'editableLogic';
export const DEFAULT_DATE_FORMAT = 'DD/MM/YYYY';
export const ARRAY_OF_OBJECTS = 'array_of_objects';
export const ARRAY = 'array';
export const OBJECT = 'object';
export const DATE = 'date';
export const NUMBER = 'number';
export const BOOLEAN = 'boolean';
export const NULL = 'null';
export const UNDEFINED = 'undefined';





// Below is dummy data for testing purposes
import { UiFormConfig, FIELD_TYPES } from "./ui-form-config.interface";

export const sampleUiFormConfig: UiFormConfig = {
  formLabel: "Sample Form",
  references: {
    attributes: {
      firstName: {
        id: "firstName",
        type: FIELD_TYPES.BASIC,
        label: "First Name",
        placeholder: "Enter your first name",
      },
      lastName: {
        id: "lastName",
        type: FIELD_TYPES.BASIC,
        label: "Last Name",
        placeholder: "Enter your last name",
      },
      address: {
        id: "address",
        type: FIELD_TYPES.FORM_GROUP,
        label: "Address",
        formGroupAttributes: {
          formLabel: "Address",
          references: {
            attributes: {
              street: {
                id: "street",
                type: FIELD_TYPES.BASIC,
                label: "Street",
              },
              city: {
                id: "city",
                type: FIELD_TYPES.BASIC,
                label: "City",
              },
            },
            validations: {},
            validationRelations: {},
            showErrorAfterSubmit: false,
          },
          paragraphs: { textAttributes: {} },
          elementsLayout: [
            [
              { _refAttributes: "street" },
              { _refAttributes: "city" },
            ],
          ],
        },
      },
    },
    validations: {
      firstNameRequired: {
        type: "required",
        errorMessage: "First name is required",
        regex: "",
      },
    },
    validationRelations: {
      firstName: ["firstNameRequired"],
    },
    showErrorAfterSubmit: true,
  },
  paragraphs: {
    textAttributes: {
      intro: {
        id: "intro",
        text: "Please fill out the form below.",
      },
    },
  },
  actions: {
    justification: "justify-content-end",
    buttons: [
      {
        label: "Submit",
        color: "primary",
        type: "raised",
        runValidation: true,
      },
    ],
  },
  elementsLayout: [
    [
      { _refAttributes: "firstName" },
      { _refAttributes: "lastName" },
    ],
    [
      { _refAttributes: "address" },
    ],
  ],
};
