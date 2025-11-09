import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Radio, InputNumber, Select, Space } from "antd";
import { Formik, Field } from "formik";
import TextArea from "antd/lib/input/TextArea";
import type { FieldProps } from "formik";

import { UploadBox } from "../UploadBox";
import { menuItemFormValidationSchema } from "./MenuItemFormModal.validation";
import {
  getMenuItemFormInitialValues,
  MENU_ITEM_CURRENCY_OPTIONS,
} from "./MenuItemFormModal.const";
import type { MenuItemFormModalProps } from "./MenuItemModal.type";
import type {
  Currency,
  ItemCategory,
  MenuItemFormValues,
  MenuItemPayload,
} from "@services/menu.type";

export const MenuItemFormModal: React.FC<MenuItemFormModalProps> = ({
  open,
  mode,
  initial,
  onCancel,
  onSubmit,
  showUpload = true,
}) => {
  const [imageName, setImageName] = useState(initial?.imageName ?? "");

  useEffect(() => {
    setImageName(initial?.imageName ?? "");
  }, [initial?.imageName]);

  const initialValues: MenuItemFormValues = getMenuItemFormInitialValues(initial);

  return (
    <Formik<MenuItemFormValues>
      initialValues={initialValues}
      validationSchema={menuItemFormValidationSchema}
      onSubmit={async (values, helpers) => {
        try {
          const payload: MenuItemPayload = {
            name: values.name,
            description: values.description,
            amount: {
              currency: values.amount.currency,
              price: values.amount.price,
            },
            imageName: showUpload ? imageName : (initial?.imageName ?? ""),
            category: values.category,
            rating: values.rating,
            quantity: values.quantity,
          };
          await onSubmit(payload);
          if (mode === "create") {
            helpers.resetForm();
            setImageName(initial?.imageName ?? "");
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
          title={mode === "create" ? "Add Menu Item" : "Update Menu Item"}
          onCancel={onCancel}
          onOk={submitForm}
          okButtonProps={{ loading: isSubmitting }}
          destroyOnClose
        >
          <Form layout="vertical">
            <Field name="name">
              {({ field, meta }: FieldProps<string>) => (
                <Form.Item
                  label="Item Name"
                  validateStatus={meta.touched && meta.error ? "error" : ""}
                  help={meta.touched && meta.error ? meta.error : ""}
                >
                  <Input {...field} placeholder="e.g., Margherita Pizza" />
                </Form.Item>
              )}
            </Field>

            <Field name="description">
              {({ field, meta }: FieldProps<string>) => (
                <Form.Item
                  label="Description"
                  validateStatus={meta.touched && meta.error ? "error" : ""}
                  help={meta.touched && meta.error ? String(meta.error) : ""}
                >
                  <TextArea {...field} placeholder="Describe the item" rows={3} />
                </Form.Item>
              )}
            </Field>

            <Space align="start">
              <Field name="amount.price">
                {({ field, meta, form }: FieldProps<number>) => (
                  <Form.Item
                    label="Price"
                    validateStatus={meta.touched && meta.error ? "error" : ""}
                    help={meta.touched && meta.error ? String(meta.error) : ""}
                  >
                    <InputNumber
                      {...field}
                      min={0}
                      onChange={(value) => {
                        form.setFieldValue(field.name, value);
                      }}
                      placeholder="Enter price"
                    />
                  </Form.Item>
                )}
              </Field>

              <Field name="amount.currency">
                {({ field, form }: FieldProps<Currency>) => (
                  <Form.Item label="Currency">
                    <Select
                      value={field.value}
                      onChange={(value) => {
                        form.setFieldValue(field.name, value);
                      }}
                      options={MENU_ITEM_CURRENCY_OPTIONS.map((currency) => ({
                        label: currency,
                        value: currency,
                      }))}
                    />
                  </Form.Item>
                )}
              </Field>
            </Space>

            <Field name="category">
              {({ field, form }: FieldProps<ItemCategory>) => (
                <Form.Item label="Category">
                  <Radio.Group
                    value={field.value}
                    onChange={(e) => form.setFieldValue(field.name, e.target.value)}
                  >
                    <Radio value="VEG">Veg</Radio>
                    <Radio value="NONVEG">Non-Veg</Radio>
                  </Radio.Group>
                </Form.Item>
              )}
            </Field>

            <Field name="quantity">
              {({ field, meta, form }: FieldProps<number>) => (
                <Form.Item
                  label="Available Quantity"
                  validateStatus={meta.touched && meta.error ? "error" : ""}
                  help={meta.touched && meta.error ? String(meta.error) : ""}
                >
                  <InputNumber
                    value={field.value}
                    min={0}
                    placeholder="Enter stock quantity"
                    onChange={(value) => {
                      form.setFieldValue(field.name, value ?? 0);
                    }}
                  />
                </Form.Item>
              )}
            </Field>
            {showUpload ? (
              <Form.Item label="Item Image">
                <UploadBox setImageName={setImageName} />
              </Form.Item>
            ) : null}
          </Form>
        </Modal>
      )}
    </Formik>
  );
};
