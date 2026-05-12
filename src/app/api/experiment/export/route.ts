import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== 'Bearer admin123') {
      return NextResponse.json({ error: '未授权' }, { status: 401 });
    }

    const { createClient } = await import('@/storage/database/supabase-client');
    const supabase = createClient();

    const { data, error } = await supabase
      .from('experiment_sessions')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      return NextResponse.json({ error: '查询失败' }, { status: 500 });
    }

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data || []);
    XLSX.utils.book_append_sheet(wb, ws, '实验数据');

    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename=experiment_data.xlsx',
      },
    });
  } catch (err) {
    console.error('Export error:', err);
    return NextResponse.json({ error: '导出失败' }, { status: 500 });
  }
}
