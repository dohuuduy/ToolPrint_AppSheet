import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { GoogleService } from '@/services/google.service';

/**
 * API trung tâm để quản lý cấu hình (CRUD Sheets)
 * Hỗ trợ các bảng: ung_dung, mau_bieu, anh_xa_bien
 */

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions) as any;
  if (!session?.accessToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const table = searchParams.get('table'); 
  const sheetId = process.env.GOOGLE_SHEET_ID;

  if (!table || !sheetId) return NextResponse.json({ error: 'Missing params' }, { status: 400 });

  try {
    const data = await GoogleService.getSheetData(session.accessToken, sheetId, `${table}!A:Z`);
    if (!data || data.length < 1) return NextResponse.json([]);
    
    const headers = data[0];
    const rows = data.slice(1).map(row => {
      const obj: any = {};
      headers.forEach((header: string, index: number) => {
        obj[header] = row[index] || '';
      });
      return obj;
    });

    return NextResponse.json(rows);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions) as any;
  if (!session?.accessToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { table, data } = body;
  const sheetId = process.env.GOOGLE_SHEET_ID;

  if (!table || !data || !sheetId) return NextResponse.json({ error: 'Missing data' }, { status: 400 });

  try {
    // Lấy headers để đảm bảo thứ tự cột
    const sheetData = await GoogleService.getSheetData(session.accessToken, sheetId, `${table}!A1:Z1`);
    const headers = (sheetData?.[0] || []).map((h: string) => h.trim());
    
    if (headers.length === 0) {
      throw new Error(`Bảng ${table} không tồn tại hoặc không có hàng tiêu đề. Hãy tạo hàng tiêu đề trước.`);
    }

    const rowValues = headers.map((h: string) => data[h] !== undefined ? data[h] : '');
    
    await GoogleService.appendRow(session.accessToken, sheetId, table, rowValues);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Config POST Error:', error);
    return NextResponse.json({ error: error.message || 'Lỗi khi lưu dữ liệu vào Google Sheets' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions) as any;
  if (!session?.accessToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { table, id, data } = body;
  const sheetId = process.env.GOOGLE_SHEET_ID;

  if (!table || !id || !data || !sheetId) return NextResponse.json({ error: 'Missing data' }, { status: 400 });

  try {
    const sheetData = await GoogleService.getSheetData(session.accessToken, sheetId, `${table}!A1:Z1`);
    const headers = (sheetData?.[0] || []).map((h: string) => h.trim());
    const rowValues = headers.map((h: string) => data[h] !== undefined ? data[h] : '');

    await GoogleService.updateRow(session.accessToken, sheetId, table, id, rowValues);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Config PUT Error:', error);
    return NextResponse.json({ error: error.message || 'Lỗi khi cập nhật dữ liệu' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions) as any;
  if (!session?.accessToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const table = searchParams.get('table');
  const id = searchParams.get('id');
  const sheetId = process.env.GOOGLE_SHEET_ID;

  if (!table || !id || !sheetId) return NextResponse.json({ error: 'Missing id or table' }, { status: 400 });

  try {
    // Vì Google Sheets API không hỗ trợ xóa dòng bằng ID trực tiếp một cách đơn giản qua values.update
    // Chúng ta sẽ đánh dấu trạng thái hoặc xóa nội dung dòng đó. 
    // Ở đây ta sẽ tìm dòng và xóa trắng hoặc set trạng thái "Xóa"
    const currentData = await GoogleService.getSheetData(session.accessToken, sheetId, `${table}!A:A`);
    const rowIndex = currentData?.findIndex(row => row[0] === id);
    
    if (rowIndex === undefined || rowIndex === -1) throw new Error('Không tìm thấy bản ghi');
    
    // Xóa nội dung dòng (set tất cả cột thành rỗng)
    const actualRowIndex = rowIndex + 1;
    await GoogleService.updateRow(session.accessToken, sheetId, table, id, ['DELETED_' + id]); // Đánh dấu là đã xóa ở cột ID
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
