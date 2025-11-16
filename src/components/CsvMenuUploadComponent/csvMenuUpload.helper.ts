import { UploadFile } from "antd";

export const getCsvUploadProps = (
  fileList: UploadFile[],
  setFileList: (next: UploadFile[]) => void,
) => ({
  beforeUpload: () => false,
  onChange: (info: { fileList: UploadFile[] }) => {
    setFileList(info.fileList.slice(-1));
  },
  maxCount: 1,
  fileList,
  accept: "text/csv",
  onRemove: () => {
    setFileList([]);
  },
});