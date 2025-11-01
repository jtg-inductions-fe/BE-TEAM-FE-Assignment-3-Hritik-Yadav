import React from "react";
import { Modal, Form, Input, Radio, Space, TimePicker } from "antd";
import { Formik, Field } from "formik";
import type { FieldProps } from "formik";

import type { RestaurantFormValues, RestaurantPayload } from "@services/restaurant.type";
import type { RestaurantFormModalProps } from "./RestaurantModal.type";

import {
  RESTAURANT_MODAL_TIME_FORMAT,
  getRestaurantFormInitialValues,
} from "./RestaurantFormModal.const";
import { restaurantFormValidationSchema } from "./RestaurantFormModal.validation";

export const RestaurantFormModal: React.FC<RestaurantFormModalProps> = ({
  open,
  mode,
  initial,
  onCancel,
  onSubmit,
}) => {
  const initialValues: RestaurantFormValues = getRestaurantFormInitialValues(initial);

  return (
    <Formik<RestaurantFormValues>
      initialValues={initialValues}
      validationSchema={restaurantFormValidationSchema}
      onSubmit={async (values, helpers) => {
        const payload: RestaurantPayload = {
          name: values.name,
          openingTime: values.openingTime.format(RESTAURANT_MODAL_TIME_FORMAT),
          closingTime: values.closingTime.format(RESTAURANT_MODAL_TIME_FORMAT),
          status: values.status,
        };
        await onSubmit(payload);
        helpers.setSubmitting(false);
      }}
      enableReinitialize
    >
      {({ submitForm, isSubmitting }) => (
        <Modal
          open={open}
          title={mode === "create" ? "Create Restaurant" : "Update Restaurant"}
          onCancel={onCancel}
          onOk={submitForm}
          okButtonProps={{ loading: isSubmitting }}
          destroyOnClose
        >
          <Form layout="vertical">
            <Field name="name">
              {({ field, meta }: FieldProps<RestaurantFormValues["name"]>) => (
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
                      onBlur={() => form.setFieldTouched(field.name, true)}
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
                      onBlur={() => form.setFieldTouched(field.name, true)}
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
                    onBlur={() => form.setFieldTouched(field.name, true)}
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
