import { NextResponse } from 'next/server';
import { getStudentCount } from '@/lib/db/queries';
import type { DepartmentCode } from '@/lib/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const departmentCode = searchParams.get('departmentCode') as DepartmentCode;
    const levelCode = searchParams.get('levelCode');

    if (!departmentCode || !levelCode) {
      return NextResponse.json(
        { error: 'Les paramètres departmentCode et levelCode sont requis' },
        { status: 400 }
      );
    }

    const count = await getStudentCount(departmentCode, levelCode);
    
    return NextResponse.json({ count });
  } catch (error) {
    console.error('Erreur lors de la récupération du nombre d\'étudiants:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du nombre d\'étudiants' },
      { status: 500 }
    );
  }
} 