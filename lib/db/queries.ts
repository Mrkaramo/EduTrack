import { prisma } from './prisma';
import type { DepartmentCode } from '../types';

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

export async function getAttendanceReport(date: Date) {
  try {
    // Normaliser la date pour ne garder que la partie date (sans l'heure)
    const normalizedDate = new Date(date);
    normalizedDate.setUTCHours(0, 0, 0, 0);

    // 1. Récupérer tous les étudiants avec leurs informations
    const allStudents = await prisma.student.findMany({
      include: {
        department: true,
        level: true,
        attendances: {
          where: {
            date: normalizedDate
          }
        }
      },
      orderBy: [
        { lastName: 'asc' },
        { firstName: 'asc' }
      ]
    });

    // 2. Transformer les données pour le rapport
    const attendanceReport = {
      date: normalizedDate,
      totalStudents: allStudents.length,
      presentCount: 0,
      absentCount: 0,
      departmentStats: new Map<string, { total: number; present: number; absent: number }>(),
      levelStats: new Map<string, { total: number; present: number; absent: number }>(),
      students: allStudents.map(student => {
        const isPresent = student.attendances.some(a => a.status === 'PRESENT');
        
        // Mettre à jour les compteurs globaux
        if (isPresent) {
          attendanceReport.presentCount++;
        } else {
          attendanceReport.absentCount++;
        }

        // Mettre à jour les statistiques par département
        const deptStats = attendanceReport.departmentStats.get(student.department.code) || { 
          total: 0, 
          present: 0, 
          absent: 0 
        };
        deptStats.total++;
        if (isPresent) deptStats.present++; else deptStats.absent++;
        attendanceReport.departmentStats.set(student.department.code, deptStats);

        // Mettre à jour les statistiques par niveau
        const levelStats = attendanceReport.levelStats.get(student.level.code) || { 
          total: 0, 
          present: 0, 
          absent: 0 
        };
        levelStats.total++;
        if (isPresent) levelStats.present++; else levelStats.absent++;
        attendanceReport.levelStats.set(student.level.code, levelStats);

        return {
          id: student.id,
          firstName: student.firstName,
          lastName: student.lastName,
          email: student.email,
          departmentCode: student.department.code,
          departmentName: student.department.name,
          levelCode: student.level.code,
          levelName: student.level.name,
          status: isPresent ? 'PRESENT' : 'ABSENT',
          attendance: student.attendances[0] || null
        };
      })
    };

    // 3. Calculer les statistiques supplémentaires
    const stats = {
      global: {
        total: attendanceReport.totalStudents,
        present: attendanceReport.presentCount,
        absent: attendanceReport.absentCount,
        presenceRate: Math.round((attendanceReport.presentCount / attendanceReport.totalStudents) * 100) || 0
      },
      departments: Object.fromEntries(
        Array.from(attendanceReport.departmentStats.entries()).map(([code, stats]) => [
          code,
          {
            ...stats,
            presenceRate: Math.round((stats.present / stats.total) * 100) || 0
          }
        ])
      ),
      levels: Object.fromEntries(
        Array.from(attendanceReport.levelStats.entries()).map(([code, stats]) => [
          code,
          {
            ...stats,
            presenceRate: Math.round((stats.present / stats.total) * 100) || 0
          }
        ])
      )
    };

    return {
      date: normalizedDate,
      students: attendanceReport.students,
      stats
    };
  } catch (error) {
    console.error('Erreur lors de la génération du rapport de présence:', error);
    throw error;
  }
}

export async function getStudentCount(departmentCode: DepartmentCode, levelCode: string) {
  try {
    const count = await prisma.student.count({
      where: {
        department: {
          code: departmentCode
        },
        level: {
          code: levelCode
        }
      },
    });
    
    return count;
  } catch (error) {
    console.error('Erreur lors du comptage des étudiants:', error);
    return 0;
  }
} 