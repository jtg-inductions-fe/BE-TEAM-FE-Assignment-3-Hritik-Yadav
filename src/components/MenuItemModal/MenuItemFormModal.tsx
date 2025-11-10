import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Radio, InputNumber, Select, Space, Upload, Button, message } from "antd";
import { Formik, Field } from "formik";
import TextArea from "antd/lib/input/TextArea";
import { UploadOutlined } from "@ant-design/icons";
import type { FieldProps } from "formik";
import type { UploadChangeParam } from "antd/es/upload";
import type { UploadFile } from "antd/es/upload/interface";

import { menuItemFormValidationSchema } from "./MenuItemFormModal.validation";
import {
  getMenuItemFormInitialValues,
  MENU_ITEM_CURRENCY_OPTIONS,
} from "./MenuItemFormModal.const";
import type { MenuItemFormModalProps } from "./MenuItemModal.type";
import type { Currency, ItemCategory, MenuItemFormValues } from "@services/menu.type";

export const MenuItemFormModal: React.FC<MenuItemFormModalProps> = ({
  open,
  mode,
  initial,
  onCancel,
  onSubmit,
  showUpload = true,
}) => {
  const [imageName, setImageName] = useState(initial?.imageName ?? "");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    setImageName(initial?.imageName ?? "");
    setSelectedFile(null);
    setFileList([]);
  }, [initial?.imageName]);

  const initialValues: MenuItemFormValues = getMenuItemFormInitialValues(initial);

  const uploadProps = {
    beforeUpload: () => false,
    onChange: (info: UploadChangeParam<UploadFile>) => {
      const latestFileList = info.fileList.slice(-1);
      setFileList(latestFileList);
      const latestFile = latestFileList[0]?.originFileObj ?? null;
      setSelectedFile(latestFile);

      if (!latestFile) {
        setImageName(initial?.imageName ?? "");
      } else {
        setImageName(latestFile.name);
      }
    },
    maxCount: 1,
    fileList,
    accept: "image/*",
    onRemove: () => {
      setSelectedFile(null);
      setImageName(initial?.imageName ?? "");
    },
  };

  return (
    <Formik<MenuItemFormValues>
      initialValues={initialValues}
      validationSchema={menuItemFormValidationSchema}
      onSubmit={async (values, helpers) => {
        if (showUpload && !selectedFile) {
          message.error("Please upload an image before submitting.");
          helpers.setSubmitting(false);
          return;
        }

        try {
          await onSubmit(values, showUpload ? selectedFile ?? undefined : undefined);
          if (mode === "create") {
            helpers.resetForm();
            setImageName(initial?.imageName ?? "");
            setSelectedFile(null);
            setFileList([]);
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
                <Upload {...uploadProps}>
                  <Button icon={<UploadOutlined />}>Select Image</Button>
                </Upload>
                {imageName ? (
                  <div className="menu-item-form__image-name">
                    {mode === "create" ? "Selected image" : "Current image"}: {imageName}
                  </div>
                ) : null}
              </Form.Item>
            ) : null}
          </Form>
        </Modal>
      )}
    </Formik>
  );
};
