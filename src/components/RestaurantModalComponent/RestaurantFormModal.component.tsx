import React from "react";
import { Modal, Form, Input, Radio, Space, TimePicker } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { Formik, Field } from "formik";
import type { FieldProps } from "formik";

import {
  RESTAURANT_MODAL_TIME_FORMAT,
  getRestaurantFormInitialValues,
} from "./RestaurantFormModal,component.const";
import { restaurantFormValidationSchema } from "./RestaurantFormModal.validation";
import "./restaurantModal.component.style.scss";

import type { RestaurantFormValues, RestaurantPayload } from "@services/restaurant.type";
import type { RestaurantFormModalProps } from "./RestaurantModal.component.type";

export const RestaurantFormModalComponent: React.FC<RestaurantFormModalProps> = ({
  open,
  mode,
  initial,
  onCancel,
  onSubmit,
}) => {
  const initialValues: RestaurantFormValues = getRestaurantFormInitialValues(initial);
  const titleText = mode === "create" ? "Create Restaurant" : "Update Restaurant";

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={restaurantFormValidationSchema}
      onSubmit={async (values, helpers) => {
        try {
          const payload: RestaurantPayload = {
            name: values.name,
            openingTime: values.openingTime.format(RESTAURANT_MODAL_TIME_FORMAT),
            closingTime: values.closingTime.format(RESTAURANT_MODAL_TIME_FORMAT),
            status: values.status,
          };
          await onSubmit(payload);
          if (mode === "create") {
            helpers.resetForm();
          }
        } finally {
          helpers.setSubmitting(false);
        }
      }}
      enableReinitialize
    >
      {({ submitForm, isSubmitting }) => (
        <Modal
          open={open}
          title={
            <div className="restaurant-modal__header">
              <span className="restaurant-modal__title">{titleText}</span>
              <button
                type="button"
                onClick={onCancel}
                className="restaurant-modal__close-button"
                aria-label="Close"
              >
                <CloseOutlined aria-hidden />
              </button>
            </div>
          }
          onCancel={onCancel}
          onOk={submitForm}
          okButtonProps={{ loading: isSubmitting, className: "restaurant-modal__ok-button" }}
          className="restaurant-modal"
          closable={false}
          destroyOnClose
        >
          <Form layout="vertical">
            <Field name="name">
              {({ field, meta }: FieldProps<string>) => (
                <Form.Item
                  label="Name"
                  validateStatus={meta.touched && meta.error ? "error" : ""}
                  help={meta.touched && meta.error ? meta.error : ""}
                >
                  <Input {...field} placeholder="Restaurant name" />
                </Form.Item>
              )}
            </Field>

            <Space size="large">
              <Field name="openingTime">
                {({ field, form, meta }: FieldProps<RestaurantFormValues["openingTime"]>) => (
                  <Form.Item
                    label="Opening Time"
                    validateStatus={meta.touched && meta.error ? "error" : ""}
                    help={meta.touched && meta.error ? String(meta.error) : ""}
                  >
                    <TimePicker
                      value={field.value}
                      format={RESTAURANT_MODAL_TIME_FORMAT}
                      onChange={(time) => {
                        if (time) {
                          form.setFieldValue(field.name, time);
                        }
                      }}
                      allowClear={false}
                    />
                  </Form.Item>
                )}
              </Field>

              <Field name="closingTime">
                {({ field, form, meta }: FieldProps<RestaurantFormValues["closingTime"]>) => (
                  <Form.Item
                    label="Closing Time"
                    validateStatus={meta.touched && meta.error ? "error" : ""}
                    help={meta.touched && meta.error ? String(meta.error) : ""}
                  >
                    <TimePicker
                      value={field.value}
                      format={RESTAURANT_MODAL_TIME_FORMAT}
                      onChange={(time) => {
                        if (time) {
                          form.setFieldValue(field.name, time);
                        }
                      }}
                      allowClear={false}
                    />
                  </Form.Item>
                )}
              </Field>
            </Space>

            <Field name="status">
              {({ field, form, meta }: FieldProps<RestaurantFormValues["status"]>) => (
                <Form.Item
                  label="Status"
                  validateStatus={meta.touched && meta.error ? "error" : ""}
                  help={meta.touched && meta.error ? meta.error : ""}
                >
                  <Radio.Group
                    value={field.value}
                    onChange={(event) => form.setFieldValue(field.name, event.target.value)}
                  >
                    <Radio value="active">Active</Radio>
                    <Radio value="inactive">Inactive</Radio>
                  </Radio.Group>
                </Form.Item>
              )}
            </Field>
          </Form>
        </Modal>
      )}
    </Formik>
  );
};
