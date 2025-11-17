import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  Radio,
  InputNumber,
  Select,
  Space,
  Upload,
  Button,
  Typography,
} from "antd";
import { Formik, Field } from "formik";
import TextArea from "antd/lib/input/TextArea";
import { CloseCircleFilled, UploadOutlined } from "@ant-design/icons";
import type { FieldProps } from "formik";
import type { UploadFile } from "antd/es/upload/interface";

import { menuItemFormValidationSchema } from "./MenuItemFormModal.validation";
import { CREATE_MODE, MENU_ITEM_CURRENCY_OPTIONS } from "./MenuItemFormModal.const";
import { getMenuItemFormInitialValues, getUploadProps } from "./menuItemFormModal.helper";

import type { MenuItemFormModalProps } from "./MenuItemModal.type";
import type { Currency, ItemCategory, MenuItemFormValues } from "@services/menu.type";

import "./menuItemFormModal.style.scss";

const { Title } = Typography;

export const MenuItemFormModalComponent: React.FC<MenuItemFormModalProps> = ({
  open,
  mode,
  initial,
  onCancel,
  onSubmit,
  showUpload = true,
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const initialValues: MenuItemFormValues = getMenuItemFormInitialValues(initial);

  const handleCancel = () => {
    setFileList([]);
    onCancel();
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={menuItemFormValidationSchema}
      onSubmit={async (values, helpers) => {
        const file = showUpload ? (fileList[0]?.originFileObj as File | undefined) : undefined;

        await onSubmit(values, helpers, file);
        if (mode === CREATE_MODE) {
          setFileList([]);
        }
      }}
      enableReinitialize
    >
      {({ submitForm, isSubmitting, submitCount }) => {
        const showImageError = showUpload && submitCount > 0 && fileList.length === 0;

        return (
          <Modal
            open={open}
            title={
              <Title className="menu-item-modal__title" level={4}>
                {mode === CREATE_MODE ? "Add Menu Item" : "Update Menu Item"}
              </Title>
            }
            onCancel={handleCancel}
            onOk={submitForm}
            okButtonProps={{
              loading: isSubmitting,
              className: "menu-item-modal__ok-button",
            }}
            className="menu-item-modal"
            closeIcon={<CloseCircleFilled />}
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
                <Form.Item
                  label="Item Image"
                  validateStatus={showImageError ? "error" : ""}
                  help={showImageError ? "Please select an image before submitting." : undefined}
                >
                  <Upload {...getUploadProps(fileList, setFileList)}>
                    <Button icon={<UploadOutlined />}>Select Image</Button>
                  </Upload>
                </Form.Item>
              ) : null}
            </Form>
          </Modal>
        );
      }}
    </Formik>
  );
};
