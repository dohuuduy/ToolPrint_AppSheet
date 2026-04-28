import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { GoogleService } from '@/services/google.service';

/**
 * API trung tâm để quản lý cấu hình (CRUD Sheets)
 */
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions) as any;
  if (!session?.accessToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const table = searchParams.get('table'); // ung_dung, mau_bieu, anh_xa_bien
  const sheetId = process.env.GOOGLE_SHEET_ID;

  if (!table || !sheetId) return NextResponse.json({ error: 'Missing table or sheet ID' }, { status: 400 });

  try {
    const data = await GoogleService.getSheetData(session.accessToken as string, sheetId, `${table}!A:Z`);
    // Chuyển array thành object array (bỏ header row 0)
    if (!data || data.length < 2) return NextResponse.json([]);
    
    const headers = data[0];
    const rows = data.slice(1).map(row => {
      const obj: any = {};
      headers.forEach((header, index) => {
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
    await GoogleService.appendRow(session.accessToken as string, sheetId, table, Object.values(data));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
