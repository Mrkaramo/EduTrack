import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getStudents(departmentCode?: string, levelCode?: string) {
  console.log('Début getStudents avec params:', { departmentCode, levelCode });
  
  try {
    // Construire la requête de base
    const where: any = {};

    // Ajouter les filtres si présents
    if (departmentCode) {
      where.department = {
        code: departmentCode
      };
    }

    if (levelCode) {
      where.level = {
        code: levelCode
      };
    }

    // Exécuter la requête avec les filtres
    const students = await prisma.student.findMany({
      where,
      include: {
        department: {
          select: {
            id: true,
            code: true,
            name: true
          }
        },
        level: {
          select: {
            id: true,
            code: true,
            name: true
          }
        }
      },
      orderBy: {
        lastName: 'asc'
      }
    });

    console.log(`Trouvé ${students.length} étudiants`);
    if (students.length > 0) {
      console.log('Premier étudiant (exemple):', students[0]);
    }
    
    return students;
  } catch (error) {
    console.error('Erreur détaillée dans getStudents:', error);
    throw error;
  }
}

export async function addStudent(data: {
  firstName: string;
  lastName: string;
  email: string | null;
  address: string | null;
  departmentCode: string;
  levelCode: string;
}) {
  console.log('Début addStudent avec données:', JSON.stringify(data, null, 2));
  
  try {
    // Réinitialiser la séquence d'ID
    const maxId = await prisma.$queryRaw`SELECT MAX(id) FROM "Student"`;
    await prisma.$executeRaw`SELECT setval('"Student_id_seq"', (SELECT MAX(id) FROM "Student"))`;
    console.log('Séquence d\'ID réinitialisée après:', maxId);

    // Vérifier si le département existe
    const department = await prisma.department.findUnique({
      where: { code: data.departmentCode }
    });

    console.log('Département trouvé:', department);

    if (!department) {
      throw new Error(`Département non trouvé: ${data.departmentCode}`);
    }

    // Vérifier si le niveau existe
    const level = await prisma.level.findFirst({
      where: {
        code: data.levelCode,
        departmentId: department.id
      }
    });

    console.log('Niveau trouvé:', level);

    if (!level) {
      throw new Error(`Niveau non trouvé: ${data.levelCode} pour le département ${data.departmentCode}`);
    }

    // Créer l'étudiant
    console.log('Tentative de création de l\'étudiant avec:', {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      departmentId: department.id,
      levelId: level.id
    });

    const student = await prisma.student.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email?.trim() || null,
        address: data.address?.trim() || null,
        departmentId: department.id,
        levelId: level.id
      },
      include: {
        department: true,
        level: true
      }
    });

    console.log('Étudiant créé avec succès:', student);
    return student;
  } catch (error) {
    console.error('Erreur détaillée dans addStudent:', error);
    console.error('Type d\'erreur:', error instanceof Error ? error.constructor.name : typeof error);
    if (error instanceof Error) {
      console.error('Message d\'erreur:', error.message);
    }
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export async function deleteStudent(id: number) {
  console.log('Début deleteStudent avec id:', id);
  
  try {
    const student = await prisma.student.delete({
      where: { id },
      include: {
        department: true,
        level: true
      }
    });
    
    console.log('Étudiant supprimé avec succès:', student);
    return student;
  } catch (error) {
    console.error('Erreur détaillée dans deleteStudent:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export async function getAttendance(departmentCode: string, levelCode: string, date: Date) {
  console.log('Fetching attendance with:', { departmentCode, levelCode, date });
  
  try {
    const attendance = await prisma.attendance.findMany({
      where: {
        department: {
          code: departmentCode
        },
        level: {
          code: levelCode
        },
        date: date
      },
      include: {
        student: true,
        department: true,
        level: true
      }
    });

    console.log(`Found ${attendance.length} attendance records`);
    return attendance;
  } catch (error) {
    console.error('Error fetching attendance:', error);
    throw error;
  }
}

export async function markAttendance(
  studentId: number,
  departmentCode: string,
  levelCode: string,
  date: Date,
  status: 'present' | 'absent'
) {
  console.log('Marking attendance:', { studentId, departmentCode, levelCode, date, status });
  
  try {
    // Récupérer les IDs du département et du niveau
    const department = await prisma.department.findUnique({
      where: { code: departmentCode }
    });

    const level = await prisma.level.findFirst({
      where: {
        code: levelCode,
        departmentId: department?.id
      }
    });

    if (!department || !level) {
      throw new Error('Department or level not found');
    }

    // Créer ou mettre à jour la présence
    const attendance = await prisma.attendance.upsert({
      where: {
        studentId_date: {
          studentId,
          date
        }
      },
      update: {
        status
      },
      create: {
        studentId,
        departmentId: department.id,
        levelId: level.id,
        date,
        status
      }
    });

    console.log('Attendance marked:', attendance);
    return attendance;
  } catch (error) {
    console.error('Error marking attendance:', error);
    throw error;
  }
} 