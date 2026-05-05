import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';
import dotenv from 'dotenv';
import { google } from 'googleapis';
import { createServer as createViteServer } from 'vite';

import { GoogleService } from './services/google.service.js';
import { AppSheetService } from './services/appsheet.service.js';
import { ReportService } from './services/report.service.js';

dotenv.config();

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
  
  console.log('[AUTH] Client ID exists:', !!clientId);
  console.log('[AUTH] Client Secret exists:', !!clientSecret);
  
  if (!clientId || !clientSecret) {
    throw new Error('GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET is missing in environment variables');
  }

  try {
    console.log('[AUTH] Creating OAuth client...');
    if (!google.auth || !google.auth.OAuth2) {
      console.error('[AUTH] google.auth.OAuth2 is missing! Check googleapis import.');
      throw new Error('Google OAuth2 library not loaded correctly');
    }

    const redirectUri = `${getBaseUrl(req)}/auth/callback`;
    console.log('[AUTH] Redirect URI:', redirectUri);

    return new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectUri
    );
  } catch (err: any) {
    console.error('[AUTH] Failed to create OAuth client:', err.message);
    throw err;
  }
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
    console.error('Auth URL Error:', err);
    res.status(500).json({ 
      error: 'OAuth initialization failed', 
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    }); 
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
    const { appId, apiKey, tableName, rowId, templateId, templateName, folderOutputId, keyCol, childTable, foreignKey, childName } = req.body;
    const { google: googleSvc } = getServices(req);
    const appsheetSvc = new AppSheetService(appId, apiKey);
    const keyColumn = keyCol || 'ma_id';
    
    console.log(`[REPORT] Starting for App: ${appId}, Table: ${tableName}, Row: ${rowId}, KeyCol: ${keyColumn}, TemplateName: ${templateName}`);

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
        ten_mau: templateName || templateId,
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

// --- GLOBAL ERROR HANDLER ---
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[GLOBAL ERROR]', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// --- VITE INTEGRATION / SPA FALLBACK ---
async function init() {
  if (process.env.NODE_ENV !== 'production' && !isVercel) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response, next: NextFunction) => {
      if (req.path.startsWith('/api/') || req.path.startsWith('/auth/')) return next();
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  if (!isVercel) {
    app.listen(3000, '0.0.0.0', () => console.log('Server running on http://0.0.0.0:3000'));
  }
}

init().catch(console.error);

export default app;
