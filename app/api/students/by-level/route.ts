import { NextResponse } from 'next/server';
import { getStudentsByLevel } from '@/lib/db/queries';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const levelCode = searchParams.get('code');

    if (!levelCode) {
      return NextResponse.json(
        { error: 'Le code du niveau est requis' },
        { status: 400 }
      );
    }

    const students = await getStudentsByLevel(levelCode);
    return NextResponse.json(students);
  } catch (error) {
    console.error('Erreur lors de la récupération des étudiants par niveau:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des étudiants' },
      { status: 500 }
    );
  }
} 