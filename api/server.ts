import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';
import dotenv from 'dotenv';
import { google } from 'googleapis';
import axios from 'axios';
import { Readable } from 'stream';
import * as XLSX from 'xlsx';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';

dotenv.config();

// --- INLINED SERVICES ---

class GoogleService {
  private sheets = google.sheets('v4');
  private drive = google.drive('v3');
  constructor(private auth: any) {}

  // Chuyển đổi mảng 2 chiều thành mảng đối tượng JSON dựa vào Header
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
      // Nếu sheet không tồn tại, trả về mảng rỗng thay vì lỗi 500
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
        // Thêm headers
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
    // Lấy tiêu đề để biết thứ tự cột
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
    
    // Tìm hàng dựa trên giá trị ID (ma_id)
    const rowIndex = rows.findIndex(r => String(r[idIndex]) === String(idValue));
    
    if (rowIndex === -1) throw new Error(`Không tìm thấy bản ghi có ID: ${idValue}`);

    // Xóa hàng bằng BatchUpdate
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

  async fetchMetadata(fileId: string) {
    const res = await this.drive.files.get({ auth: this.auth, fileId, fields: 'mimeType, name' });
    return res.data;
  }

  async downloadFile(fileId: string) {
    // Lấy metadata để kiểm tra loại file
    const meta = await this.drive.files.get({ auth: this.auth, fileId, fields: 'mimeType, name' });
    const mimeType = meta.data.mimeType;

    if (mimeType === 'application/vnd.google-apps.document') {
      // Nếu là Google Doc, phải EXPORT sang DOCX
      console.log(`[DRIVE] Exporting Google Doc "${meta.data.name}" to DOCX...`);
      const res = await this.drive.files.export(
        { 
          auth: this.auth, 
          fileId, 
          mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
        }, 
        { responseType: 'arraybuffer' }
      );
      return { buffer: res.data as ArrayBuffer, mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' };
    }

    if (mimeType === 'application/vnd.google-apps.spreadsheet') {
      // Nếu là Google Sheet, phải EXPORT sang XLSX
      console.log(`[DRIVE] Exporting Google Sheet "${meta.data.name}" to XLSX...`);
      const res = await this.drive.files.export(
        { 
          auth: this.auth, 
          fileId, 
          mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
        }, 
        { responseType: 'arraybuffer' }
      );
      return { buffer: res.data as ArrayBuffer, mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' };
    }

    // Nếu là file binary thuần túy (.docx, .xlsx đã upload)
    const res = await this.drive.files.get({ auth: this.auth, fileId, alt: 'media' }, { responseType: 'arraybuffer' });
    return { buffer: res.data as ArrayBuffer, mimeType: mimeType || 'application/octet-stream' };
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
    await this.drive.files.delete({
      auth: this.auth,
      fileId
    });
  }

  async cleanupFiles(folderId: string, days: number) {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - days);
    const rfc3339Date = thresholdDate.toISOString();

    const res = await this.drive.files.list({
      auth: this.auth,
      q: `'${folderId}' in parents and createdTime < '${rfc3339Date}' and trashed = false`,
      fields: 'files(id, name)'
    });

    const filesToDelete = res.data.files || [];
    for (const file of filesToDelete) {
      if (file.id) {
        await this.drive.files.delete({ auth: this.auth, fileId: file.id });
      }
    }
    return filesToDelete.length;
  }
}

class AppSheetService {
  constructor(public appId: string, public accessKey: string) {}
  async getTableRow(tableName: string, rowId: string, keyCol: string = 'ma_id') {
    const url = `https://api.appsheet.com/api/v2/apps/${this.appId}/tables/${tableName}/Action`;
    const res = await axios.post(url, { Action: 'Find', Properties: { Locale: 'vi-VN' }, Rows: [{ [keyCol]: rowId }] }, { headers: { ApplicationAccessKey: this.accessKey } });
    return res.data[0];
  }
  async getTable(tableName: string) {
    const url = `https://api.appsheet.com/api/v2/apps/${this.appId}/tables/${tableName}/Action`;
    const res = await axios.post(url, { Action: 'Find', Properties: { Locale: 'vi-VN' }, Rows: [] }, { headers: { ApplicationAccessKey: this.accessKey } });
    return Array.isArray(res.data) ? res.data : [];
  }

  async getTables() {
    const url = `https://api.appsheet.com/api/v2/apps/${this.appId}/tables/Action`;
    try {
      const res = await axios.post(url, { 
        Action: 'Find', 
        Properties: { Locale: 'vi-VN', Top: 1 }, 
        Rows: [] 
      }, { 
        headers: { ApplicationAccessKey: this.accessKey } 
      });
      // AppSheet API doesn't have a direct "List Tables" for v2, 
      // but we can infer from the response or use a specific pattern if available.
      // However, AppSheet usually requires knowing the table name.
      // A better way is to handle table name entry and then fetch columns.
      return []; 
    } catch (err) {
      return [];
    }
  }

  async getColumns(tableName: string) {
    console.log(`[APPSHEET] Fetching columns for table: ${tableName}`);
    const url = `https://api.appsheet.com/api/v2/apps/${this.appId}/tables/${tableName}/Action`;
    const res = await axios.post(url, { 
      Action: 'Find', 
      Properties: { Locale: 'vi-VN', Top: 1 }, 
      Rows: [] 
    }, { 
      headers: { ApplicationAccessKey: this.accessKey } 
    });
    
    if (res.data && res.data.length > 0) {
      console.log(`[APPSHEET] Columns found: ${Object.keys(res.data[0]).join(', ')}`);
      return Object.keys(res.data[0]);
    }
    console.warn(`[APPSHEET] No data found in table ${tableName}, columns cannot be determined.`);
    return [];
  }
}

class ReportService {
  static formatValue(val: any): any {
    if (val === null || val === undefined) return '';
    
    // Nếu là mảng, xử lý từng phần tử trong mảng
    if (Array.isArray(val)) {
      return val.map(item => this.formatValue(item));
    }

    // Nếu là Object (không phải Date), xử lý từng thuộc tính
    if (typeof val === 'object' && !(val instanceof Date)) {
      const formattedObj: any = {};
      Object.keys(val).forEach(key => {
        formattedObj[key] = this.formatValue(val[key]);
      });
      return formattedObj;
    }
    
    // Kiểm tra nếu là chuỗi ngày tháng từ AppSheet
    const dateRegex = /^\d{4}-\d{2}-\d{2}/; 
    const mdDateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}/;

    if (typeof val === 'string' && (dateRegex.test(val) || mdDateRegex.test(val))) {
      const d = new Date(val);
      if (!isNaN(d.getTime())) {
        const day = d.getDate().toString().padStart(2, '0');
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
      }
    }

    // Kiểm tra nếu là số
    if (typeof val === 'number' || (!isNaN(Number(val)) && typeof val === 'string' && val.trim() !== '' && !val.includes('/'))) {
      const num = Number(val);
      return new Intl.NumberFormat('vi-VN', { 
        minimumFractionDigits: 0, 
        maximumFractionDigits: 2 
      }).format(num);
    }

    return String(val);
  }

  static async mergeWord(templateBuffer: ArrayBuffer, data: any): Promise<Buffer> {
    const zip = new PizZip(templateBuffer);
    
    // Định dạng lại toàn bộ dữ liệu (bao gồm cả danh sách con)
    const formattedData = this.formatValue(data);

    const doc = new Docxtemplater(zip, { 
      paragraphLoop: true, 
      linebreaks: true 
    });
    
    doc.render(formattedData);
    return doc.getZip().generate({ type: 'nodebuffer', compression: 'DEFLATE' });
  }

  static async mergeExcel(templateBuffer: ArrayBuffer, data: any): Promise<Buffer> {
    const workbook = XLSX.read(templateBuffer, { type: 'buffer', cellStyles: true });
    
    workbook.SheetNames.forEach(sheetName => {
      const sheet = workbook.Sheets[sheetName];
      if (!sheet) return;

      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];
      const newRows: any[][] = [];
      
      // Tìm key nào là mảng (dữ liệu con)
      const childKeys = Object.keys(data).filter(k => Array.isArray(data[k]));
      
      rows.forEach((row) => {
        let isRepeatingRow = false;
        let repeatingKey = '';

        // Kiểm tra xem hàng này có chứa token của mảng con không (VD: {items.ten})
        row.forEach((cell) => {
          if (typeof cell === 'string') {
            childKeys.forEach(key => {
              if (cell.includes(`{${key}.`)) {
                isRepeatingRow = true;
                repeatingKey = key;
              }
            });
          }
        });

        if (isRepeatingRow && repeatingKey) {
          const childData = data[repeatingKey] || [];
          if (childData.length === 0) {
            // Nếu không có dữ liệu con, có thể giữ nguyên hàng (để hiện token rỗng) hoặc bỏ qua. 
            // Ở đây ta giữ nguyên hàng nhưng xóa token.
            const newRow = row.map(cell => {
              if (typeof cell !== 'string') return cell;
              let newVal = cell;
              childKeys.forEach(ck => {
                const regex = new RegExp(`\\{${ck}\\.[^\\}]+\\}`, 'g');
                newVal = newVal.replace(regex, '');
              });
              return newVal;
            });
            newRows.push(newRow);
          } else {
            childData.forEach((item: any) => {
            const newRow = row.map(cell => {
              if (typeof cell !== 'string') return cell;
              let newVal = cell;
              
              // Thay thế field con
              Object.keys(item).forEach(fKey => {
                const token = `{${repeatingKey}.${fKey}}`;
                if (newVal.includes(token)) {
                  newVal = newVal.replace(new RegExp(token, 'g'), this.formatValue(item[fKey]));
                }
              });
              
              // Thay thế field cha (nếu có)
              Object.keys(data).forEach(pKey => {
                if (!Array.isArray(data[pKey])) {
                  const token = `{${pKey}}`;
                  if (newVal.includes(token)) {
                    newVal = newVal.replace(new RegExp(token, 'g'), this.formatValue(data[pKey]));
                  }
                }
              });
              
              return newVal;
            });
            newRows.push(newRow);
          });
        }
      } else {
        // Hàng bình thường, chỉ thay thế field cha
        const newRow = row.map(cell => {
          if (typeof cell !== 'string') return cell;
          let newVal = cell;
          Object.keys(data).forEach(pKey => {
            if (!Array.isArray(data[pKey])) {
              const token = `{${pKey}}`;
              if (newVal.includes(token)) {
                newVal = newVal.replace(new RegExp(token, 'g'), this.formatValue(data[pKey]));
              }
            }
          });
          return newVal;
        });
        newRows.push(newRow);
      }
    });

      const newSheet = XLSX.utils.aoa_to_sheet(newRows);
      
      // Copy Merges if any (simple copy)
      if (sheet['!merges']) newSheet['!merges'] = sheet['!merges'];
      
      workbook.Sheets[sheetName] = newSheet;
    });

    return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  }
}

// --- EXPRESS APP SETUP ---

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const isVercel = process.env.VERCEL === '1';

// Mandatory for Vercel behind reverse proxy
app.set('trust proxy', 1);

app.use(cookieSession({
  name: 'appsheet_print_session',
  keys: [process.env.NEXTAUTH_SECRET || 'appsheet-print-secret-key'],
  maxAge: 7 * 24 * 60 * 60 * 1000,
  secure: true, 
  httpOnly: true,
  sameSite: 'none'
}));

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

const getBaseUrl = (req: Request) => {
  if (process.env.APP_URL && !process.env.APP_URL.includes('localhost')) {
    return process.env.APP_URL.endsWith('/') ? process.env.APP_URL.slice(0, -1) : process.env.APP_URL;
  }
  const protocol = req.headers['x-forwarded-proto'] || 'http';
  return `${protocol}://${req.headers['host']}`;
};

const getOAuthClient = (req: Request) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  
  if (!clientId || !clientSecret) {
    throw new Error('GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET is missing in environment variables');
  }

  return new google.auth.OAuth2(
    clientId,
    clientSecret,
    `${getBaseUrl(req)}/auth/callback`
  );
};

// --- ENDPOINTS ---

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    version: '5.0.3-debug', 
    isVercel,
    config: {
      has_client_id: !!process.env.GOOGLE_CLIENT_ID,
      has_client_secret: !!process.env.GOOGLE_CLIENT_SECRET,
      has_sheet_id: !!process.env.GOOGLE_SHEET_ID,
      app_url: process.env.APP_URL || 'not_set'
    }
  });
});

app.get('/api/auth/url', (req, res) => {
  try {
    const client = getOAuthClient(req);
    const url = client.generateAuthUrl({ 
      access_type: 'offline', 
      scope: [
        'https://www.googleapis.com/auth/spreadsheets', 
        'https://www.googleapis.com/auth/drive', 
        'https://www.googleapis.com/auth/userinfo.profile', 
        'https://www.googleapis.com/auth/userinfo.email'
      ], 
      prompt: 'consent' 
    });
    res.json({ url });
  } catch (err: any) { 
    console.error('Auth URL Error:', err.message);
    res.status(500).json({ error: 'OAuth initialization failed', details: err.message }); 
  }
});

app.get(['/auth/callback', '/auth/callback/'], async (req: any, res) => {
  const { code } = req.query;
  try {
    const client = getOAuthClient(req);
    const { tokens } = await client.getToken(code as string);
    client.setCredentials(tokens);
    
    // Log user email to track who is logging in
    const userInfo = await google.oauth2({ version: 'v2', auth: client }).userinfo.get();
    console.log(`[AUTH] User Logged In: ${userInfo.data.email}`);
    
    req.session.tokens = JSON.stringify(tokens);
    res.send('<html><body><script>setTimeout(()=>{if(window.opener){window.opener.postMessage({type:"OAUTH_AUTH_SUCCESS"},"*");window.close();}else{window.location.href="/";}},500)</script></body></html>');
  } catch (err) { res.status(500).send('Login failed'); }
});

app.get('/api/user', async (req: any, res) => {
  if (!req.session.tokens) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const tokens = JSON.parse(req.session.tokens);
    const client = getOAuthClient(req);
    client.setCredentials(tokens);
    const userInfo = await google.oauth2({ version: 'v2', auth: client }).userinfo.get();
    res.json(userInfo.data);
  } catch (err) { res.status(401).json({ error: 'Expired' }); }
});

app.post('/api/auth/logout', (req: any, res) => {
  req.session = null;
  res.json({ success: true });
});

const getServices = (req: any) => {
  if (!req.session.tokens) throw new Error('Unauthenticated');
  const tokens = JSON.parse(req.session.tokens);
  const client = getOAuthClient(req);
  client.setCredentials(tokens);
  return { google: new GoogleService(client) };
};

app.get('/api/db/init', async (req: any, res) => {
  try {
    const { google: googleSvc } = getServices(req);
    await googleSvc.ensureDatabase(process.env.GOOGLE_SHEET_ID!);
    res.json({ success: true, message: 'Khởi tạo database thành công' });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

app.get('/api/db/:sheetName', async (req: any, res) => {
  try {
    const { google: googleSvc } = getServices(req);
    const data = await googleSvc.getRows(process.env.GOOGLE_SHEET_ID!, req.params.sheetName);
    res.json(data);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

app.post('/api/db/:sheetName', async (req: any, res) => {
  try {
    const { google: googleSvc } = getServices(req);
    const data = { ...req.body, ngay_tao: req.body.ngay_tao || new Date().toISOString() };
    await googleSvc.appendRow(process.env.GOOGLE_SHEET_ID!, req.params.sheetName, data);
    res.json({ success: true });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/db/:sheetName/:id', async (req: any, res) => {
  try {
    const { google: googleSvc } = getServices(req);
    await googleSvc.deleteRow(process.env.GOOGLE_SHEET_ID!, req.params.sheetName, 'ma_id', req.params.id);
    res.json({ success: true });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

app.put('/api/db/:sheetName/:id', async (req: any, res) => {
  try {
    const { google: googleSvc } = getServices(req);
    await googleSvc.updateRow(process.env.GOOGLE_SHEET_ID!, req.params.sheetName, 'ma_id', req.params.id, req.body);
    res.json({ success: true });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

// --- DRIVE MANAGEMENT ENDPOINTS ---

app.get('/api/drive/files/:folderId', async (req: any, res) => {
  try {
    const { google: googleSvc } = getServices(req);
    const files = await googleSvc.listFiles(req.params.folderId);
    res.json(files);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/drive/files/:fileId', async (req: any, res) => {
  try {
    const { google: googleSvc } = getServices(req);
    await googleSvc.deleteFile(req.params.fileId);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/drive/cleanup', async (req: any, res) => {
  try {
    const { folderId, days } = req.body;
    if (!folderId || days === undefined) return res.status(400).json({ error: 'Thiếu thông tin' });
    const { google: googleSvc } = getServices(req);
    const count = await googleSvc.cleanupFiles(folderId, days);
    res.json({ success: true, count });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/appsheet/columns', async (req: any, res) => {
  try {
    const { appId, apiKey, tableName } = req.body;
    if (!appId || !apiKey || !tableName) return res.status(400).json({ error: 'Thiếu thông tin' });
    const appsheetSvc = new AppSheetService(appId, apiKey);
    const columns = await appsheetSvc.getColumns(tableName);
    res.json(columns);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

app.post('/api/report/generate', async (req: any, res) => {
  try {
    const { appId, apiKey, tableName, rowId, templateId, folderOutputId, keyCol, childTable, foreignKey, childName } = req.body;
    const { google: googleSvc } = getServices(req);
    const appsheetSvc = new AppSheetService(appId, apiKey);
    const keyColumn = keyCol || 'ma_id';
    
    console.log(`[REPORT] Starting for App: ${appId}, Table: ${tableName}, Row: ${rowId}, KeyCol: ${keyColumn}`);

    // 1. Lấy dữ liệu từ AppSheet
    let rowData;
    try {
      console.log(`[REPORT] Fetching parent row from table: ${tableName}, Row ID: ${rowId}`);
      const parentRow = await appsheetSvc.getTableRow(tableName, rowId, keyColumn);
      
      if (!parentRow) {
        console.error(`[REPORT] Row not found. RowID: ${rowId}, Table: ${tableName}`);
        return res.status(404).json({ success: false, error: `Không tìm thấy ID: ${rowId} tại cột [${keyColumn}] trong bảng ${tableName}.` });
      }
      rowData = { ...parentRow };

      // Xử lý nạp dữ liệu con
      if (childTable && foreignKey) {
        console.log(`[REPORT] Fetching child table: ${childTable} with FK: ${foreignKey}`);
        const allChildren = await appsheetSvc.getTable(childTable);
        const filteredChildren = allChildren.filter((c: any) => String(c[foreignKey]) === String(rowId));
        rowData[childName || 'items'] = filteredChildren.map((item: any, idx: number) => ({
          ...item,
          stt: idx + 1,
          index: idx + 1
        }));
        console.log(`[REPORT] Found ${filteredChildren.length} child rows.`);
      }
    } catch (e: any) {
      console.error('[APPSHEET ERROR]', e.response?.data || e.message);
      const details = e.response?.data?.Message || e.message;
      return res.status(400).json({ success: false, error: `Lỗi AppSheet: ${details}. Hãy kiểm tra cấu hình bảng.` });
    }

    const now = new Date();
    rowData['ngay_in'] = now.getDate().toString().padStart(2, '0');
    rowData['thang_in'] = (now.getMonth() + 1).toString().padStart(2, '0');
    rowData['nam_in'] = now.getFullYear().toString();
    rowData['ngay_thang_nam'] = `Ngày ${rowData['ngay_in']} tháng ${rowData['thang_in']} năm ${rowData['nam_in']}`;

    // 2. Xử lý Trộn File
    let uploadResult;
    try {
      console.log(`[DRIVE] Token Status: ${req.session.tokens ? 'OK' : 'MISSING'}`);
      console.log(`[DRIVE] Requested Template ID: "${templateId}"`);
      
      const { buffer, mimeType: templateMimeType } = await googleSvc.downloadFile(templateId.trim());
      console.log(`[DRIVE] Downloaded Template size: ${buffer.byteLength} bytes, MIME: ${templateMimeType}`);
      
      let outputBuffer: Buffer;
      let finalMimeType: string;
      let fileName: string;

      if (templateMimeType.includes('spreadsheet') || templateMimeType.includes('excel')) {
        outputBuffer = await ReportService.mergeExcel(buffer, rowData);
        finalMimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        fileName = `Report_${tableName}_${rowId}_${Date.now()}.xlsx`;
      } else {
        outputBuffer = await ReportService.mergeWord(buffer, rowData);
        finalMimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        fileName = `Report_${tableName}_${rowId}_${Date.now()}.docx`;
      }
      
      uploadResult = await googleSvc.uploadFile(
        fileName, 
        outputBuffer, 
        finalMimeType, 
        folderOutputId ? folderOutputId.trim() : undefined
      );
    } catch (e: any) {
      console.error('[DRIVE/PROCESS ERROR]', e.response?.data || e.message);
      let details = e.message;
      if (e.response?.status === 404) {
        details = `Không tìm thấy File ID: "${templateId}". Vui lòng kiểm tra: 1. ID có đúng không? 2. Bạn đã SHARE quyền chỉnh sửa cho Email chưa? 3. File có nằm trong Thùng rác không?`;
      } else if (e.response?.status === 403) {
        details = `Lỗi quyền truy cập (403). Hãy thử Đăng xuất và Đăng nhập lại để cập nhật quyền truy cập Drive mới.`;
      }
      return res.status(500).json({ success: false, error: `Lỗi Google Drive/Xử lý file: ${details}` });
    }
    
    // 3. Ghi log (Không chặn luồng chính nếu lỗi log)
    try {
      await googleSvc.appendRow(process.env.GOOGLE_SHEET_ID!, 'nhat_ky_in', {
        ngay_tao: new Date().toISOString(),
        ma_id: rowId,
        nguoi_dung: 'Hệ thống',
        ten_mau: templateId,
        trang_thai: 'Thành công',
        file_id_drive: uploadResult.id
      });
    } catch (e) {
      console.warn('[LOG WARNING] Could not append row to sheet');
    }
    
    res.json({ success: true, fileId: uploadResult.id });
  } catch (err: any) { 
    console.error('[CRITICAL SERVER ERROR]', err);
    res.status(500).json({ success: false, error: err.message }); 
  }
});

// SPA Fallback
const distPath = path.join(process.cwd(), 'dist');
app.use(express.static(distPath));
app.get('*', (req: Request, res: Response, next: NextFunction) => {
  if (req.path.startsWith('/api/') || req.path.startsWith('/auth/')) return next();
  res.sendFile(path.join(distPath, 'index.html'));
});

if (!isVercel) {
  app.listen(3000, '0.0.0.0', () => console.log('Server running...'));
}

export default app;
