export interface AppSheetConfig {
  ma_id: string;
  ten_ung_dung: string;
  app_id: string;
  khoa_api: string;
  folder_mau_id: string;
  folder_xuat_id: string;
  bang_chinh: string;
  trang_thai: string;
  ngay_tao: string;
}

export interface ReportTemplate {
  ma_id: string;
  ten_mau: string;
  ma_mau: string;
  file_id_drive: string;
  loai_file: 'DOCX' | 'XLSX';
  ma_ung_dung: string;
  bang_chinh: string;
  key_col: string;
  child_table?: string;
  foreign_key?: string;
  child_name?: string;
  ngay_tao: string;
}

export interface PrintLog {
  ma_id: string;
  ten_mau: string;
  ngay_tao: string;
  nguoi_dung: string;
  trang_thai: string;
  file_id_drive: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  picture: string;
}
