import { NextResponse } from 'next/server';
import { getDepartments } from '@/lib/db/queries';

export async function GET() {
  try {
    const result = await getDepartments();

    if (result.success) {
      return NextResponse.json(result.data);
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des départements:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la récupération des départements' },
      { status: 500 }
    );
  }
} 