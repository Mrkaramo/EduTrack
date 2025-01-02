import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Supprimer toutes les données existantes
    await prisma.attendance.deleteMany();
    await prisma.student.deleteMany();
    await prisma.level.deleteMany();
    await prisma.department.deleteMany();

    // Réinitialiser les séquences
    await prisma.$executeRaw`ALTER SEQUENCE "Department_id_seq" RESTART WITH 1`;
    await prisma.$executeRaw`ALTER SEQUENCE "Level_id_seq" RESTART WITH 1`;
    await prisma.$executeRaw`ALTER SEQUENCE "Student_id_seq" RESTART WITH 1`;
    await prisma.$executeRaw`ALTER SEQUENCE "Attendance_id_seq" RESTART WITH 1`;

    console.log('Création des départements...');
    const departments = [
      { code: '2AP', name: 'Classes Préparatoires' },
      { code: 'BDAI', name: 'Big Data et Intelligence Artificielle' },
      { code: 'GC', name: 'Génie Civil' },
      { code: 'GI', name: 'Génie Informatique' },
      { code: 'GM', name: 'Génie Mécanique' },
      { code: 'GSTR', name: 'Génie des Systèmes de Télécommunications Réseaux' },
      { code: 'GCSE', name: 'Génie Cyber Sécurité et Systèmes Embarqués' },
      { code: 'SCM', name: 'Supply Chain Management' }
    ];

    for (const dept of departments) {
      await prisma.department.create({
        data: dept
      });
    }

    console.log('Création des niveaux...');
    const levels = [
      // 2AP
      { code: '2AP1', name: 'Première Année Préparatoire', departmentId: 1 },
      { code: '2AP2', name: 'Deuxième Année Préparatoire', departmentId: 1 },
      // BDAI
      { code: 'BDAI1', name: 'Première Année BDAI', departmentId: 2 },
      { code: 'BDAI2', name: 'Deuxième Année BDAI', departmentId: 2 },
      { code: 'BDAI3', name: 'Troisième Année BDAI', departmentId: 2 },
      // GC
      { code: 'GC1', name: 'Première Année GC', departmentId: 3 },
      { code: 'GC2', name: 'Deuxième Année GC', departmentId: 3 },
      { code: 'GC3', name: 'Troisième Année GC', departmentId: 3 },
      // GI
      { code: 'GI1', name: 'Première Année GI', departmentId: 4 },
      { code: 'GI2', name: 'Deuxième Année GI', departmentId: 4 },
      { code: 'GI3', name: 'Troisième Année GI', departmentId: 4 },
      // GM
      { code: 'GM1', name: 'Première Année GM', departmentId: 5 },
      { code: 'GM2', name: 'Deuxième Année GM', departmentId: 5 },
      { code: 'GM3', name: 'Troisième Année GM', departmentId: 5 },
      // GSTR
      { code: 'GSTR1', name: 'Première Année GSTR', departmentId: 6 },
      { code: 'GSTR2', name: 'Deuxième Année GSTR', departmentId: 6 },
      { code: 'GSTR3', name: 'Troisième Année GSTR', departmentId: 6 },
      // GCSE
      { code: 'GCSE1', name: 'Première Année GCSE', departmentId: 7 },
      { code: 'GCSE2', name: 'Deuxième Année GCSE', departmentId: 7 },
      { code: 'GCSE3', name: 'Troisième Année GCSE', departmentId: 7 },
      // SCM
      { code: 'SCM1', name: 'Première Année SCM', departmentId: 8 },
      { code: 'SCM2', name: 'Deuxième Année SCM', departmentId: 8 },
      { code: 'SCM3', name: 'Troisième Année SCM', departmentId: 8 }
    ];

    for (const level of levels) {
      await prisma.level.create({
        data: level
      });
    }

    console.log('Base de données initialisée avec succès !');
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la base de données:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 