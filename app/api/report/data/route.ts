import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { GoogleService } from '@/services/google.service';
import { AppSheetService } from '@/services/appsheet.service';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rowId = searchParams.get('id');
  const templateId = searchParams.get('template');

  if (!rowId || !templateId) {
    return NextResponse.json({ error: 'Thiếu ID dòng hoặc mã mẫu biểu' }, { status: 400 });
  }

  try {
    const session = await getServerSession(authOptions) as any;
    if (!session?.accessToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const sheetId = process.env.GOOGLE_SHEET_ID;
    if (!sheetId) return NextResponse.json({ error: 'Missing GOOGLE_SHEET_ID' }, { status: 500 });

    // 1. Lấy thông tin mẫu biểu
    const dataTemplates = await GoogleService.getSheetData(session.accessToken, sheetId, 'mau_bieu!A:Z');
    if (!dataTemplates || dataTemplates.length < 1) throw new Error('Không có dữ liệu mẫu biểu');
    
    const hTpl = dataTemplates[0];
    const templates = dataTemplates.slice(1).map(row => {
      const obj: any = {};
      hTpl.forEach((h: string, i: number) => obj[h] = row[i] || '');
      return obj;
    });

    const template = templates.find((t: any) => t.ma_id === templateId);

    if (!template) {
      return NextResponse.json({ error: 'Không tìm thấy cấu hình mẫu biểu' }, { status: 404 });
    }

    // 2. Lấy thông tin ứng dụng AppSheet
    const dataApps = await GoogleService.getSheetData(session.accessToken, sheetId, 'ung_dung!A:Z');
    if (!dataApps || dataApps.length < 1) throw new Error('Không có dữ liệu ứng dụng');

    const hApp = dataApps[0];
    const apps = dataApps.slice(1).map(row => {
      const obj: any = {};
      hApp.forEach((h: string, i: number) => obj[h] = row[i] || '');
      return obj;
    });

    const app = apps.find((a: any) => a.ma_id === template.ma_ung_dung);

    if (!app) {
      return NextResponse.json({ error: 'Không tìm thấy cấu hình ứng dụng AppSheet' }, { status: 404 });
    }

    // 3. Lấy dữ liệu từ AppSheet
    const rawData = await AppSheetService.getRowData({
      appId: app.app_id_appsheet,
      tableName: app.ten_bang_appsheet,
      apiKey: app.api_key_appsheet,
      rowId: rowId
    });

    if (!rawData) {
      return NextResponse.json({ error: 'Không tìm thấy dữ liệu trong AppSheet' }, { status: 404 });
    }

    // 4. Lấy quy tắc ánh xạ (mapping)
    const dataMappings = await GoogleService.getSheetData(session.accessToken, sheetId, 'anh_xa_bien!A:Z');
    const hMap = dataMappings?.[0] || [];
    const allMappings = (dataMappings?.slice(1) || []).map(row => {
      const obj: any = {};
      hMap.forEach((h: string, i: number) => obj[h] = row[i] || '');
      return obj;
    });
    
    const mappings = allMappings.filter((m: any) => m.ma_mau === templateId);

    // 5. Trộn dữ liệu theo mapping
    const mappedData: Record<string, any> = {};
    
    // Mặc định lấy toàn bộ dữ liệu gốc từ AppSheet
    Object.keys(rawData).forEach(key => {
      mappedData[key] = rawData[key];
    });

    // Ưu tiên các biến được mapping thủ công
    mappings.forEach((m: any) => {
      // Tên cột AppSheet thường nằm trong ngoặc vuông [Column]
      const columnName = m.ten_cot_du_lieu.replace(/[\[\]]/g, '');
      if (rawData[columnName] !== undefined) {
        mappedData[m.ten_bien] = rawData[columnName];
      }
    });

    return NextResponse.json({
      template,
      data: mappedData,
      rawData: rawData
    });

  } catch (error: any) {
    console.error('Report Data API Error:', error);
    return NextResponse.json({ error: error.message || 'Lỗi hệ thống khi lấy dữ liệu' }, { status: 500 });
  }
}
