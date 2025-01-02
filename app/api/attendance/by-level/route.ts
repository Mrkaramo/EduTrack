import { NextResponse } from 'next/server';
import { getStudentsByLevel } from '@/lib/db/queries';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const levelCode = searchParams.get('code');

    if (!levelCode) {
      return NextResponse.json(
        { error: 'Code de niveau requis' },
        { status: 400 }
      );
    }

    const students = await getStudentsByLevel(levelCode);
    
    // Transformer les données pour inclure l'assiduité
    const studentsWithAttendance = students.map(student => ({
      ...student,
      attendance: {} // Pour l'instant vide, à remplir avec les vraies données plus tard
    }));

    return NextResponse.json(studentsWithAttendance);
  } catch (error) {
    console.error('Erreur lors de la récupération des présences:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des présences' },
      { status: 500 }
    );
  }
} 