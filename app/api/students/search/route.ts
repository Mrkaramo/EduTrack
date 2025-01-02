import { NextResponse } from 'next/server';
import { searchStudents } from '@/lib/db/queries';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json(
        { error: 'Le terme de recherche est requis' },
        { status: 400 }
      );
    }

    const students = await searchStudents(query);
    return NextResponse.json(students);
  } catch (error) {
    console.error('Erreur lors de la recherche des étudiants:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recherche des étudiants' },
      { status: 500 }
    );
  }
} 