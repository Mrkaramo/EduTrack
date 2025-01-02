import { NextResponse } from 'next/server';
import { getStudents, addStudent } from '@/lib/db/queries';
import { Prisma } from '@prisma/client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const departmentCode = searchParams.get('department');
    const levelCode = searchParams.get('level');

    console.log('Début GET /api/students avec params:', { departmentCode, levelCode });

    const students = await getStudents(departmentCode || undefined, levelCode || undefined);
    
    console.log(`Renvoi de ${students.length} étudiants`);
    return NextResponse.json(students);
  } catch (error) {
    console.error('Erreur détaillée dans GET /api/students:', error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Erreurs spécifiques à Prisma
      switch (error.code) {
        case 'P2002':
          return NextResponse.json(
            { error: 'Un étudiant avec cet email existe déjà' },
            { status: 400 }
          );
        case 'P2025':
          return NextResponse.json(
            { error: 'Étudiant non trouvé' },
            { status: 404 }
          );
        default:
          return NextResponse.json(
            { error: 'Erreur lors de la récupération des étudiants' },
            { status: 500 }
          );
      }
    }

    return NextResponse.json(
      { error: 'Erreur lors de la récupération des étudiants' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log('Données reçues dans POST /api/students:', JSON.stringify(data, null, 2));

    // Validation des données requises
    if (!data.firstName?.trim() || !data.lastName?.trim()) {
      console.log('Validation échouée: prénom ou nom manquant');
      return NextResponse.json(
        { error: 'Le prénom et le nom sont requis' },
        { status: 400 }
      );
    }

    if (!data.departmentCode || !data.levelCode) {
      console.log('Validation échouée: département ou niveau manquant');
      return NextResponse.json(
        { error: 'Le département et le niveau sont requis' },
        { status: 400 }
      );
    }

    console.log('Tentative d\'ajout d\'étudiant avec:', {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      departmentCode: data.departmentCode,
      levelCode: data.levelCode
    });

    const student = await addStudent(data);
    
    console.log('Étudiant créé avec succès:', student);
    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    console.error('Erreur complète lors de l\'ajout d\'étudiant:', error);
    console.error('Type d\'erreur:', error.constructor.name);
    console.error('Message d\'erreur:', error.message);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error('Code d\'erreur Prisma:', error.code);
      console.error('Message d\'erreur Prisma:', error.message);
      
      switch (error.code) {
        case 'P2003':
          return NextResponse.json(
            { error: 'Le département ou le niveau spécifié n\'existe pas' },
            { status: 400 }
          );
        default:
          return NextResponse.json(
            { error: `Erreur Prisma: ${error.message}` },
            { status: 500 }
          );
      }
    }

    return NextResponse.json(
      { error: error instanceof Error ? `Erreur: ${error.message}` : 'Erreur lors de l\'ajout de l\'étudiant' },
      { status: 500 }
    );
  }
} 