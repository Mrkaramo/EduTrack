import { NextRequest, NextResponse } from 'next/server';
import { getWeeklyAttendanceStats, getMonthlyAttendanceStats } from '@/lib/db/queries';
import type { DepartmentCode } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const departmentCode = searchParams.get('departmentCode') as DepartmentCode;
    const levelCode = searchParams.get('levelCode');
    const type = searchParams.get('type');

    if (!departmentCode || !levelCode || !type) {
      return NextResponse.json(
        { error: 'Les paramètres departmentCode, levelCode et type sont requis' },
        { status: 400 }
      );
    }

    let stats;
    if (type === 'weekly') {
      stats = await getWeeklyAttendanceStats(departmentCode, levelCode);
    } else if (type === 'monthly') {
      stats = await getMonthlyAttendanceStats(departmentCode, levelCode);
    } else {
      return NextResponse.json(
        { error: 'Le type doit être "weekly" ou "monthly"' },
        { status: 400 }
      );
    }

    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    );
  }
} 