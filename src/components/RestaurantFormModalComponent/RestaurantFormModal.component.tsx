import React from "react";
import { Formik, Field } from "formik";
import { Modal, Form, Input, Radio, TimePicker, Typography } from "antd";
import { CloseCircleFilled } from "@ant-design/icons";

import type { FieldProps } from "formik";

import { RESTAURANT_MODAL_TIME_FORMAT } from "./RestaurantFormModal.const";
import { restaurantFormValidationSchema } from "./RestaurantFormModal.validation";
import { getRestaurantFormInitialValues } from "./restaurantFormModal.helper";

import type { RestaurantFormValues } from "@services/restaurant.type";
import type { RestaurantFormModalProps } from "./RestaurantFormModal.type";

import "./restaurantFormModal.style.scss";

const { Title } = Typography;

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
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ submitForm, isSubmitting }) => (
        <Modal
          open={open}
          title={
            <Title className="restaurant-modal__title" level={4}>
              {titleText}
            </Title>
          }
          onCancel={onCancel}
          onOk={submitForm}
          okButtonProps={{ loading: isSubmitting, className: "restaurant-modal__ok-button" }}
          className="restaurant-modal"
          closeIcon={<CloseCircleFilled />}
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

            <div className="restaurant-modal__time-slot">
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
            </div>

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
