import { NextRequest, NextResponse } from 'next/server';
import { getAttendanceReport } from '@/lib/db/queries';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateStr = searchParams.get('date');

    if (!dateStr) {
      return NextResponse.json(
        { error: 'La date est requise' },
        { status: 400 }
      );
    }

    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return NextResponse.json(
        { error: 'Format de date invalide' },
        { status: 400 }
      );
    }

    const report = await getAttendanceReport(date);
    
    return NextResponse.json(report);
  } catch (error) {
    console.error('Erreur lors de la récupération du rapport:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du rapport' },
      { status: 500 }
    );
  }
} 