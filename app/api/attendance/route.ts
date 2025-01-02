import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const levelId = searchParams.get('levelId');
    const dateStr = searchParams.get('date');

    console.log('🔍 [API GET] Début de la requête');
    console.log('📝 [API GET] Paramètres bruts reçus:', { 
      levelId, 
      dateStr,
      url: request.url 
    });

    if (!levelId || !dateStr) {
      console.log('❌ [API GET] Paramètres manquants:', { levelId, dateStr });
      return NextResponse.json(
        { error: 'Le niveau et la date sont requis' },
        { status: 400 }
      );
    }

    const parsedLevelId = parseInt(levelId);
    const parsedDate = new Date(dateStr);
    parsedDate.setUTCHours(0, 0, 0, 0);

    console.log('🔄 [API GET] Paramètres parsés:', { 
      parsedLevelId, 
      parsedDate: parsedDate.toISOString(),
      originalDate: dateStr
    });

    // Vérifier si le niveau existe
    console.log('🔍 [API GET] Recherche du niveau:', parsedLevelId);
    const level = await prisma.level.findUnique({
      where: { id: parsedLevelId },
      include: { department: true }
    });

    if (!level) {
      console.log('❌ [API GET] Niveau non trouvé:', parsedLevelId);
      return NextResponse.json(
        { error: `Niveau ${parsedLevelId} non trouvé` },
        { status: 404 }
      );
    }

    console.log('✅ [API GET] Niveau trouvé:', {
      id: level.id,
      code: level.code,
      name: level.name,
      departmentId: level.departmentId,
      departmentCode: level.department.code
    });

    // Récupérer les étudiants avec leurs présences
    console.log('🔍 [API GET] Recherche des étudiants pour:', {
      levelId: parsedLevelId,
      date: parsedDate.toISOString()
    });

    const students = await prisma.student.findMany({
      where: {
        levelId: parsedLevelId,
      },
      include: {
        attendances: {
          where: {
            date: parsedDate
          }
        },
        department: true,
        level: true,
      },
      orderBy: [
        { lastName: 'asc' },
        { firstName: 'asc' }
      ],
    });

    // Transformer les données pour le frontend
    const transformedStudents = students.map(student => ({
      ...student,
      attendances: student.attendances.map(attendance => ({
        ...attendance,
        isPresent: attendance.status === 'PRESENT'
      }))
    }));

    console.log('✅ [API GET] Résultats de la recherche:', {
      totalStudents: transformedStudents.length,
      date: parsedDate.toISOString(),
      levelId: parsedLevelId,
      levelCode: level.code,
      studentsWithAttendance: transformedStudents.filter(s => s.attendances.length > 0).length,
      sampleStudent: transformedStudents[0] ? {
        id: transformedStudents[0].id,
        name: `${transformedStudents[0].firstName} ${transformedStudents[0].lastName}`,
        levelCode: transformedStudents[0].level.code,
        departmentCode: transformedStudents[0].department.code,
        hasAttendance: transformedStudents[0].attendances.length > 0,
        attendanceDetails: transformedStudents[0].attendances[0] || 'Aucune présence'
      } : 'Aucun étudiant'
    });

    return NextResponse.json(transformedStudents);
  } catch (error) {
    console.error('❌ [API GET] Erreur:', error);
    console.error('❌ [API GET] Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des étudiants' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 [API POST] Début de la requête');
    const body = await request.json();
    const { studentId, isPresent, date } = body;

    console.log('📝 [API POST] Données reçues:', { 
      studentId, 
      isPresent, 
      date,
      bodyType: typeof body,
      rawBody: JSON.stringify(body)
    });

    if (!studentId || isPresent === undefined || !date) {
      console.log('❌ [API POST] Données invalides:', { studentId, isPresent, date });
      return NextResponse.json(
        { error: 'Données invalides' },
        { status: 400 }
      );
    }

    // Normaliser la date
    const normalizedDate = new Date(date);
    normalizedDate.setUTCHours(0, 0, 0, 0);

    console.log('🔄 [API POST] Date normalisée:', {
      original: date,
      normalized: normalizedDate.toISOString(),
      utcString: normalizedDate.toUTCString()
    });

    // Vérifier si l'étudiant existe
    console.log('🔍 [API POST] Recherche de l\'étudiant:', studentId);
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: { level: true, department: true }
    });

    if (!student) {
      console.log('❌ [API POST] Étudiant non trouvé:', studentId);
      return NextResponse.json(
        { error: 'Étudiant non trouvé' },
        { status: 404 }
      );
    }

    console.log('✅ [API POST] Étudiant trouvé:', {
      id: student.id,
      name: `${student.firstName} ${student.lastName}`,
      levelCode: student.level.code,
      departmentCode: student.department.code
    });

    // Créer ou mettre à jour la présence
    console.log('🔄 [API POST] Tentative de création/mise à jour de la présence');

    const attendance = await prisma.attendance.upsert({
      where: {
        studentId_date: {
          studentId,
          date: normalizedDate
        }
      },
      create: {
        studentId,
        date: normalizedDate,
        status: isPresent ? 'PRESENT' : 'ABSENT'
      },
      update: {
        status: isPresent ? 'PRESENT' : 'ABSENT'
      }
    });

    console.log('✅ [API POST] Présence enregistrée:', {
      id: attendance.id,
      studentId: attendance.studentId,
      date: attendance.date,
      status: attendance.status
    });

    // Récupérer l'étudiant mis à jour avec ses présences
    const updatedStudent = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        attendances: {
          where: {
            date: normalizedDate
          }
        },
        department: true,
        level: true,
      }
    });

    if (!updatedStudent) {
      throw new Error('Impossible de récupérer l\'étudiant mis à jour');
    }

    // Transformer les données pour le frontend
    const transformedStudent = {
      ...updatedStudent,
      attendances: updatedStudent.attendances.map(attendance => ({
        ...attendance,
        isPresent: attendance.status === 'PRESENT'
      }))
    };

    console.log('✅ [API POST] Étudiant mis à jour:', {
      id: transformedStudent.id,
      name: `${transformedStudent.firstName} ${transformedStudent.lastName}`,
      attendances: transformedStudent.attendances.length,
      latestAttendance: transformedStudent.attendances[0]
    });

    return NextResponse.json(transformedStudent);
  } catch (error) {
    console.error('❌ [API POST] Erreur:', error);
    console.error('❌ [API POST] Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { error: 'Erreur lors de l\'enregistrement de la présence dans la base de données' },
      { status: 500 }
    );
  }
}
