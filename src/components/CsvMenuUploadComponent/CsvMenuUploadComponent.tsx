import React, { useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Modal, Typography, Upload, UploadFile } from "antd";

import { getCsvUploadProps } from "./csvMenuUpload.helper";

import type { CsvMenuUploadComponentProps } from "./csvMenuUpload.type";

import "./csvMenuUpload.style.scss";

const { Title } = Typography;

export const CsvMenuUploadComponent: React.FC<CsvMenuUploadComponentProps> = ({
  onUpload,
  uploading,
}) => {
  const [visible, setVisible] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  return (
    <>
      <Button type="primary" onClick={() => setVisible(true)}>
        Upload Menu CSV
      </Button>
      <Modal
        title={
          <Title level={4} className="csv-upload__title">
            Menu Items (Upload CSV)
          </Title>
        }
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        centered
      >
        <Upload {...getCsvUploadProps(fileList, setFileList)}>
          <Button icon={<UploadOutlined />}>Select File</Button>
        </Upload>
        <Button
          type="primary"
          onClick={() => onUpload((fileList[0]?.originFileObj as File ))}
          disabled={fileList.length !== 1}
          loading={uploading}
          className="csv-upload__upload-button"
        >
          {uploading ? "Uploading" : "Start Upload"}
        </Button>
      </Modal>
    </>
  );
};
