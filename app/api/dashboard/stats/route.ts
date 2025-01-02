import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isWeekend } from 'date-fns';
import { fr } from 'date-fns/locale';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const departmentCode = searchParams.get('department');
    const levelCode = searchParams.get('level');
    const monthParam = searchParams.get('month');

    if (!departmentCode || !levelCode) {
      return NextResponse.json(
        { error: 'Department et Level sont requis' },
        { status: 400 }
      );
    }

    // Récupérer le département et le niveau
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
      return NextResponse.json(
        { error: 'Département ou niveau non trouvé' },
        { status: 404 }
      );
    }

    const selectedMonth = monthParam ? new Date(monthParam) : new Date();
    const start = startOfMonth(selectedMonth);
    const end = endOfMonth(selectedMonth);

    // Récupérer les totaux
    const [totalStudents, totalDepartments, totalLevels] = await Promise.all([
      prisma.student.count(),
      prisma.department.count(),
      prisma.level.count()
    ]);

    // Récupérer les présences pour le département et niveau sélectionnés
    const attendances = await prisma.attendance.findMany({
      where: {
        departmentId: department.id,
        levelId: level.id,
        date: {
          gte: start,
          lte: end,
        },
      },
    });

    const presentAttendances = attendances.filter(a => a.status === 'present');
    const attendanceRate = attendances.length > 0 
      ? Math.round((presentAttendances.length / attendances.length) * 100) 
      : 0;

    // Statistiques quotidiennes
    const days = eachDayOfInterval({ start, end }).filter(date => !isWeekend(date));
    const dailyStats = await Promise.all(
      days.map(async (date) => {
        const dayAttendances = attendances.filter(a => 
          format(new Date(a.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
        );
        const dayPresent = dayAttendances.filter(a => a.status === 'present').length;

        return {
          date: format(date, 'dd/MM', { locale: fr }),
          présents: dayPresent,
          absents: dayAttendances.length - dayPresent,
        };
      })
    );

    // Statistiques mensuelles
    const monthlyStats = dailyStats.map(day => ({
      date: day.date,
      taux_présence: day.présents + day.absents > 0
        ? Math.round((day.présents / (day.présents + day.absents)) * 100)
        : 0,
    }));

    return NextResponse.json({
      totalStudents,
      totalDepartments,
      totalLevels,
      attendanceRate,
      dailyStats,
      monthlyStats,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 