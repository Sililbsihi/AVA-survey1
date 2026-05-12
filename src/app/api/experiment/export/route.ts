import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import * as XLSX from 'xlsx';

export async function GET(request: NextRequest) {
  try {
    if (request.headers.get('authorization') !== 'Bearer admin123') {
      return NextResponse.json({ error: '未授权' }, { status: 401 });
    }
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('experiment_sessions')
      .select('*')
      .order('created_at', { ascending: true });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
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
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
