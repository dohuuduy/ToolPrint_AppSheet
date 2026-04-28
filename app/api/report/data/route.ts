import { NextRequest, NextResponse } from 'next/server';
import { AppSheetService } from '@/services/appsheet.service';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const table = searchParams.get('table') || process.env.APPSHEET_TABLE;

  if (!id || !table) {
    return NextResponse.json({ error: 'Thiếu ID hoặc tên bảng' }, { status: 400 });
  }

  try {
    const data = await AppSheetService.getRowData(table, id);
    if (!data) {
      return NextResponse.json({ error: 'Không tìm thấy dữ liệu' }, { status: 404 });
    }
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
