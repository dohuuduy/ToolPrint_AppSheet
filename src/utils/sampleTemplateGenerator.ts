import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import * as XLSX from 'xlsx';

export const generateSampleWord = (config: any) => {
  const { ten_mau, child_name, main_cols, child_cols } = config;
  const variableName = child_name || 'items';
  
  const defaultMain = ['ten_khoa_hoc', 'ngay_dao_tao', 'giang_vien', 'dia_diem', 'noi_dung_tom_tat'];
  const defaultChild = ['ma_nhan_vien', 'ho_va_ten', 'don_vi', 'chuc_vu', 'ket_qua_danh_gia'];

  const finalMainCols = main_cols && main_cols.length > 0 ? main_cols : defaultMain;
  const finalChildCols = child_cols && child_cols.length > 0 ? child_cols : defaultChild;

  const html = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset='utf-8'><title>Sample Template</title></head>
    <body style="font-family: 'Times New Roman', serif;">
      <div style="text-align: center;">
        <p style="margin: 0; font-weight: bold;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
        <p style="margin: 0; font-weight: bold; border-bottom: 1px solid black; display: inline-block; padding-bottom: 5px;">Độc lập - Tự do - Hạnh phúc</p>
      </div>

      <h1 style="text-align: center; color: #000; margin-top: 30px; text-transform: uppercase;">BIỂU MẪU: ${ten_mau || 'BÁO CÁO ĐÀO TẠO'}</h1>
      
      <h3>I. THÔNG TIN CHUNG</h3>
      <table style="width: 100%; border-collapse: collapse;">
        ${finalMainCols.map((c: string) => `
          <tr>
            <td style="width: 40%; padding: 5px;">- ${c.replace(/_/g, ' ')}:</td>
            <td style="padding: 5px; font-weight: bold;">{${c}}</td>
          </tr>
        `).join('')}
      </table>
      
      ${child_name ? `
      <h3>II. DANH SÁCH CHI TIẾT (${variableName})</h3>
      <table border="1" style="width: 100%; border-collapse: collapse; border: 1px solid black;">
        <tr style="background-color: #f2f2f2; text-align: center; font-weight: bold;">
          <th style="padding: 5px; border: 1px solid black;">STT</th>
          ${finalChildCols.map((c: string) => `<th style="padding: 5px; border: 1px solid black;">${c.replace(/_/g, ' ')}</th>`).join('')}
        </tr>
        <tr>
          <td style="padding: 5px; text-align: center; border: 1px solid black;">{#${variableName}}{stt}</td>
          ${finalChildCols.map((c: string, idx: number) => `
            <td style="padding: 5px; border: 1px solid black;">{${c}}${idx === finalChildCols.length - 1 ? `{/${variableName}}` : ''}</td>
          `).join('')}
        </tr>
      </table>
      ` : ''}
      
      <div style="margin-top: 50px; float: right; width: 250px; text-align: center;">
        <p style="font-style: italic;">Ngày {ngay_in}, tháng {thang_in}, năm {nam_in}</p>
        <p style="font-weight: bold;">NGƯỜI LẬP BIỂU</p>
        <br/><br/><br/>
        <p>.........................................</p>
      </div>
    </body>
    </html>
  `;

  const blob = new Blob([html], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Mau_${ten_mau.replace(/\s+/g, '_')}.doc`;
  a.click();
  URL.revokeObjectURL(url);
};

export const generateSampleExcel = (config: any) => {
  const { ten_mau, child_name, main_cols, child_cols } = config;
  const variableName = child_name || 'items';
  
  const defaultMain = ['ten_khoa_hoc', 'ngay_dao_tao', 'giang_vien', 'dia_diem'];
  const defaultChild = ['ma_nhan_vien', 'ho_va_ten', 'don_vi', 'ket_qua'];

  const finalMainCols = main_cols && main_cols.length > 0 ? main_cols : defaultMain;
  const finalChildCols = child_cols && child_cols.length > 0 ? child_cols : defaultChild;

  const data: any[][] = [
    ['DANH SÁCH BÁO CÁO'],
    [`MẪU BIỂU: ${ten_mau || 'TÊN BIỂU MẪU'}`],
    [''],
    ['THÔNG TIN BẢNG CHÍNH'],
  ];
  
  finalMainCols.forEach((c: string) => {
    data.push([c.replace(/_/g, ' ').toUpperCase(), `{${c}}`]);
  });
  
  if (child_name) {
    data.push(['']);
    data.push([`DANH SÁCH CHI TIẾT (${variableName.toUpperCase()})`]);
    const header = ['STT', ...finalChildCols.map((c: string) => c.replace(/_/g, ' ').toUpperCase())];
    const row = [`{${variableName}.stt}`, ...finalChildCols.map((c: string) => `{${variableName}.${c}}`)];
    data.push(header);
    data.push(row);
  }
  
  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sample");
  
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
  
  function s2ab(s: string) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  }
  
  const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Mau_${ten_mau.replace(/\s+/g, '_')}.xlsx`;
  a.click();
  URL.revokeObjectURL(url);
};
