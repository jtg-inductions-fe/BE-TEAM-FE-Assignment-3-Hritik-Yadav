export interface CsvMenuUploadComponentProps {
  onUpload: (file: File) => Promise<unknown> | void;
  uploading: boolean;
}
