import { google } from 'googleapis';
import { Readable } from 'stream';

export class GoogleService {
  private sheets = google.sheets('v4');
  private drive = google.drive('v3');
  constructor(private auth: any) {}

  private rowsToObjects(rows: any[][]) {
    if (!rows || rows.length < 2) return [];
    const headers = rows[0];
    return rows.slice(1).map(row => {
      const obj: any = {};
      headers.forEach((header: string, index: number) => {
        obj[header] = row[index] || '';
      });
      return obj;
    });
  }

  async getRows(spreadsheetId: string, range: string) {
    try {
      const res = await this.sheets.spreadsheets.values.get({ auth: this.auth, spreadsheetId, range });
      return this.rowsToObjects(res.data.values || []);
    } catch (err: any) {
      console.error(`[SHEETS ERROR] Error fetching ${range}:`, err.message);
      if (err.message.includes('not found') || err.message.includes('Unable to parse range')) {
        return [];
      }
      throw err;
    }
  }

  async ensureDatabase(spreadsheetId: string) {
    const requiredSheets = [
      { name: 'ung_dung', headers: ['ma_id', 'ten_ung_dung', 'app_id', 'khoa_api', 'folder_mau_id', 'folder_xuat_id', 'bang_chinh', 'trang_thai', 'ngay_tao'] },
      { name: 'mau_bieu', headers: ['ma_id', 'ten_mau', 'ma_mau', 'file_id_drive', 'loai_file', 'ma_ung_dung', 'bang_chinh', 'key_col', 'child_table', 'foreign_key', 'child_name', 'ngay_tao'] },
      { name: 'anh_xa_bien', headers: ['ma_id', 'ma_mau', 'bien_mau', 'cot_appsheet', 'kieu_du_lieu'] },
      { name: 'nhat_ky_in', headers: ['ma_id', 'ten_mau', 'ngay_tao', 'nguoi_dung', 'trang_thai', 'file_id_drive'] },
      { name: 'cau_hinh', headers: ['ma_id', 'ten_tham_so', 'gia_tri', 'mo_ta'] }
    ];

    const spreadsheet = await this.sheets.spreadsheets.get({ auth: this.auth, spreadsheetId });
    const existingSheets = spreadsheet.data.sheets?.map(s => s.properties?.title) || [];

    for (const sheetDef of requiredSheets) {
      if (!existingSheets.includes(sheetDef.name)) {
        console.log(`[SHEETS] Creating missing sheet: ${sheetDef.name}`);
        await this.sheets.spreadsheets.batchUpdate({
          auth: this.auth,
          spreadsheetId,
          requestBody: {
            requests: [{ addSheet: { properties: { title: sheetDef.name } } }]
          }
        });
        await this.sheets.spreadsheets.values.update({
          auth: this.auth,
          spreadsheetId,
          range: `${sheetDef.name}!1:1`,
          valueInputOption: 'RAW',
          requestBody: { values: [sheetDef.headers] }
        });
      }
    }
    return true;
  }

  async appendRow(spreadsheetId: string, range: string, data: any) {
    const res = await this.sheets.spreadsheets.values.get({ auth: this.auth, spreadsheetId, range: `${range}!1:1` });
    const headers = res.data.values?.[0] || [];
    const values = headers.map((h: string) => data[h] || '');
    
    await this.sheets.spreadsheets.values.append({
      auth: this.auth,
      spreadsheetId,
      range,
      valueInputOption: 'RAW',
      requestBody: { values: [values] }
    });
  }

  async updateRow(spreadsheetId: string, range: string, idColumn: string, idValue: string, data: any) {
    const res = await this.sheets.spreadsheets.values.get({ auth: this.auth, spreadsheetId, range });
    const rows = res.data.values || [];
    if (rows.length < 1) throw new Error('Sheet trống');
    const headers = rows[0];
    const idIndex = headers.indexOf(idColumn);
    if (idIndex === -1) throw new Error(`Không tìm thấy cột ${idColumn}`);
    const rowIndex = rows.findIndex(r => String(r[idIndex]) === String(idValue));
    if (rowIndex === -1) throw new Error(`Không tìm thấy bản ghi có ID: ${idValue}`);
    
    const newValues = headers.map((h: string) => data[h] !== undefined ? data[h] : rows[rowIndex][headers.indexOf(h)]);
    
    await this.sheets.spreadsheets.values.update({
      auth: this.auth,
      spreadsheetId,
      range: `${range}!A${rowIndex + 1}`,
      valueInputOption: 'RAW',
      requestBody: { values: [newValues] }
    });
  }

  async deleteRow(spreadsheetId: string, range: string, idColumn: string, idValue: string) {
    const res = await this.sheets.spreadsheets.values.get({ auth: this.auth, spreadsheetId, range });
    const rows = res.data.values || [];
    if (rows.length < 1) throw new Error('Sheet trống');
    const headers = rows[0];
    const idIndex = headers.indexOf(idColumn);
    if (idIndex === -1) throw new Error(`Không tìm thấy cột ${idColumn}`);
    const rowIndex = rows.findIndex(r => String(r[idIndex]) === String(idValue));
    if (rowIndex === -1) throw new Error(`Không tìm thấy bản ghi có ID: ${idValue}`);

    const sheetInfo = await this.sheets.spreadsheets.get({ auth: this.auth, spreadsheetId });
    const sheet = sheetInfo.data.sheets?.find(s => s.properties?.title === range);
    if (!sheet) throw new Error(`Không tìm thấy Sheet "${range}"`);

    await this.sheets.spreadsheets.batchUpdate({
      auth: this.auth,
      spreadsheetId,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: sheet.properties?.sheetId,
                dimension: 'ROWS',
                startIndex: rowIndex,
                endIndex: rowIndex + 1
              }
            }
          }
        ]
      }
    });
  }

  async downloadFile(fileId: string) {
    const meta = await this.drive.files.get({ auth: this.auth, fileId, fields: 'mimeType, name' });
    const mimeType = meta.data.mimeType;

    if (mimeType === 'application/vnd.google-apps.document') {
      const res = await this.drive.files.export(
        { auth: this.auth, fileId, mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }, 
        { responseType: 'arraybuffer' }
      );
      return { buffer: Buffer.from(res.data as ArrayBuffer), mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' };
    }

    if (mimeType === 'application/vnd.google-apps.spreadsheet') {
      const res = await this.drive.files.export(
        { auth: this.auth, fileId, mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }, 
        { responseType: 'arraybuffer' }
      );
      return { buffer: Buffer.from(res.data as ArrayBuffer), mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' };
    }

    const res = await this.drive.files.get({ auth: this.auth, fileId, alt: 'media' }, { responseType: 'arraybuffer' });
    return { buffer: Buffer.from(res.data as ArrayBuffer), mimeType: mimeType || 'application/octet-stream' };
  }

  async uploadFile(name: string, content: Buffer, mimeType: string, folderId?: string) {
    const res = await this.drive.files.create({ 
      auth: this.auth, 
      requestBody: { name, parents: folderId ? [folderId] : [] }, 
      media: { mimeType, body: Readable.from(content) } 
    });
    return res.data;
  }

  async listFiles(folderId: string) {
    const res = await this.drive.files.list({
      auth: this.auth,
      q: `'${folderId}' in parents and trashed = false`,
      fields: 'files(id, name, mimeType, createdTime, size)',
      orderBy: 'createdTime desc'
    });
    return res.data.files || [];
  }

  async deleteFile(fileId: string) {
    await this.drive.files.delete({ auth: this.auth, fileId });
  }

  async cleanupFiles(folderId: string, days: number) {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - days);
    const res = await this.drive.files.list({
      auth: this.auth,
      q: `'${folderId}' in parents and createdTime < '${thresholdDate.toISOString()}' and trashed = false`,
      fields: 'files(id, name)'
    });

    const filesToDelete = res.data.files || [];
    for (const file of filesToDelete) {
      if (file.id) await this.drive.files.delete({ auth: this.auth, fileId: file.id });
    }
    return filesToDelete.length;
  }
}
