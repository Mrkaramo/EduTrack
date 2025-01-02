import { NextResponse } from 'next/server';
import { deleteStudent } from '@/lib/db/queries';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log('DELETE /api/students/[id] with id:', params.id);
    const studentId = parseInt(params.id, 10);

    if (isNaN(studentId)) {
      return NextResponse.json(
        { error: 'ID étudiant invalide' },
        { status: 400 }
      );
    }

    const student = await deleteStudent(studentId);
    
    console.log('Student deleted:', student);
    return NextResponse.json(student);
  } catch (error) {
    console.error('Error in DELETE /api/students/[id]:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de l\'étudiant' },
      { status: 500 }
    );
  }
} 