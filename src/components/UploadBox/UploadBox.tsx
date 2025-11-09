import React, { useState } from "react";
import axios from "axios";
import { Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadChangeParam } from "antd/es/upload";
import type { UploadFile } from "antd/es/upload/interface";

import { getSignedUrl } from "@services/upload.service";
import { useAuthContext } from "@/context/AuthContext";

import type { UploadBoxProps } from "./uploadBox.type";

export const UploadBox: React.FC<UploadBoxProps> = ({ setImageName }) => {
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const { authUser, isAuthLoading } = useAuthContext();

  const handleUpload = async () => {
    const file = fileList[0].originFileObj;
    if (!isAuthLoading) {
      const token = await authUser?.getIdToken();

      if (!file) {
        message.error("Please select a file first!");
        return;
      }

      setUploading(true);
      try {
        if (token) {
          const url = await getSignedUrl(token, file.name, file.type);
          const { uploadUrl, imageName } = url.data;

          const response = await axios.put(uploadUrl, file, {
            headers: {
              "Content-Type": file.type,
            },
          });

          if (response.status == 200) {
            message.success(`${file.name} uploaded successfully.`);
            setImageName(imageName);
            setUploaded(true);
          } else {
            message.error(`${file.name} upload failed.`);
          }
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unexpected upload error";
        message.error(`Upload Error: ${errorMessage}`);
      } finally {
        setUploading(false);
      }
    }
  };

  const uploadProps = {
    onChange: (info: UploadChangeParam<UploadFile>) => {
      setFileList(info.fileList.slice(0, 1));
    },
    beforeUpload: () => {
      return false;
    },
    fileList: fileList,
    maxCount: 1,
    disabled: fileList.length >= 1,
  };

  return (
    <>
      <div>
        <Upload {...uploadProps}>
          <Button icon={<UploadOutlined />}>Select File</Button>
        </Upload>
      </div>

      <Button
        type="primary"
        onClick={handleUpload}
        loading={uploading}
        disabled={fileList.length === 0 || uploaded}
        style={{ marginTop: 16 }}
      >
        {uploading ? "Uploading" : uploaded ? "Uploaded" : "Start Upload"}
      </Button>
    </>
  );
};
