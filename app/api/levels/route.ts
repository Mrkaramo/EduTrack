import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(request: NextRequest) {
  try {
    // Récupérer tous les niveaux
    const levels = await prisma.level.findMany({
      orderBy: {
        id: 'asc',
      },
    });

    return NextResponse.json(levels);
  } catch (error) {
    console.error('Erreur lors de la récupération des niveaux:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des niveaux' },
      { status: 500 }
    );
  }
} 