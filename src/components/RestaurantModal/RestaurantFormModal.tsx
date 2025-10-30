import React from "react";
import { Modal, Form, Input, Radio, Space, TimePicker } from "antd";
import { Formik } from "formik";
import * as Yup from "yup";
import moment from "moment";

import type {
  RestaurantFormValues,
  RestaurantPayload,
  RestaurantStatus,
} from "@services/restaurant.type";
import type { RestaurantFormModalProps } from "./RestaurantModal.type";

const timeFormat = "HH:mm";

const Schema = Yup.object().shape({
  name: Yup.string().min(2).max(100).required("Name is required"),
  openingTime: Yup.mixed().required("Opening time is required"),
  closingTime: Yup.mixed().required("Closing time is required"),
  status: Yup.mixed<RestaurantStatus>().oneOf(["active", "inactive"]).required("Required"),
});

export const RestaurantFormModal: React.FC<RestaurantFormModalProps> = ({
  open,
  mode,
  initial,
  onCancel,
  onSubmit,
}) => {
  const initialValues: RestaurantFormValues = {
    name: initial?.name ?? "",
    openingTime: initial?.openingTime
      ? moment(initial.openingTime, timeFormat)
      : moment("08:00", timeFormat),
    closingTime: initial?.closingTime
      ? moment(initial.closingTime, timeFormat)
      : moment("22:00", timeFormat),
    status: (initial?.status as RestaurantStatus) ?? "active",
  };

  return (
    <Formik<RestaurantFormValues>
      initialValues={initialValues}
      validationSchema={Schema}
      onSubmit={async (values, helpers) => {
        const payload: RestaurantPayload = {
          name: values.name,
          openingTime: values.openingTime.format(timeFormat),
          closingTime: values.closingTime.format(timeFormat),
          status: values.status,
        };
        await onSubmit(payload);
        helpers.setSubmitting(false);
      }}
      enableReinitialize
    >
      {({ values, errors, touched, handleChange, setFieldValue, submitForm, isSubmitting }) => (
        <Modal
          open={open}
          title={mode === "create" ? "Create Restaurant" : "Update Restaurant"}
          onCancel={onCancel}
          onOk={submitForm}
          okButtonProps={{ loading: isSubmitting }}
          destroyOnClose
        >
          <Form layout="vertical">
            <Form.Item
              label="Name"
              validateStatus={touched.name && errors.name ? "error" : ""}
              help={touched.name && errors.name ? errors.name : ""}
            >
              <Input
                name="name"
                value={values.name}
                onChange={handleChange}
                placeholder="Restaurant name"
              />
            </Form.Item>

            <Space size="large">
              <Form.Item
                label="Opening Time"
                validateStatus={touched.openingTime && errors.openingTime ? "error" : ""}
                help={touched.openingTime && errors.openingTime ? String(errors.openingTime) : ""}
              >
                <TimePicker
                  value={values.openingTime}
                  format={timeFormat}
                  onChange={(time) => {
                    if (time) {
                      setFieldValue("openingTime", time);
                    }
                  }}
                />
              </Form.Item>

              <Form.Item
                label="Closing Time"
                validateStatus={touched.closingTime && errors.closingTime ? "error" : ""}
                help={touched.closingTime && errors.closingTime ? String(errors.closingTime) : ""}
              >
                <TimePicker
                  value={values.closingTime}
                  format={timeFormat}
                  onChange={(time) => {
                    if (time) {
                      setFieldValue("closingTime", time);
                    }
                  }}
                />
              </Form.Item>
            </Space>

            <Form.Item
              label="Status"
              validateStatus={touched.status && errors.status ? "error" : ""}
              help={touched.status && errors.status ? errors.status : ""}
            >
              <Radio.Group name="status" onChange={handleChange} value={values.status}>
                <Radio value="active">Active</Radio>
                <Radio value="inactive">Inactive</Radio>
              </Radio.Group>
            </Form.Item>
          </Form>
        </Modal>
      )}
    </Formik>
  );
};
