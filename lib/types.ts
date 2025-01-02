// Types pour les départements et niveaux
export type DepartmentCode = '2AP' | 'GI' | 'GC' | 'BDAI' | 'GM' | 'GSTR' | 'SCM';

export interface Department {
  code: DepartmentCode;
  name: string;
}

export interface Level {
  id: number;
  code: string;
  departmentId: number;
}

// Types pour les étudiants
export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string | null;
  address: string | null;
  levelId: number;
  departmentId: number;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: Date;
  updatedAt: Date;
}

export interface StudentWithDetails extends Student {
  level: Level;
  department: Department;
}

export interface NewStudent {
  firstName: string;
  lastName: string;
  email?: string;
  address?: string;
  levelId: number;
  departmentId: number;
  status: 'ACTIVE' | 'INACTIVE';
}

// Types pour l'assiduité
export type AttendanceStatus = 'present' | 'absent';

export interface AttendanceRecord {
  id: number;
  studentId: number;
  date: Date;
  status: AttendanceStatus;
  levelId: number;
  departmentId: number;
}

// Types pour les statistiques
export interface DailyStats {
  level_code: string;
  total_students: number;
  present_count: number;
  absent_count: number;
  presence_percentage: number;
}

export interface MonthlyStats {
  department_code: string;
  total_students: number;
  average_presence: number;
  total_absences: number;
}

export interface WeeklyStats {
  level_code: string;
  week_start: Date;
  week_end: Date;
  average_presence: number;
  total_absences: number;
}

export interface Department {
  id: number;
  code: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Level {
  id: number;
  code: string;
  name: string;
  departmentId: number;
  createdAt: Date;
  updatedAt: Date;
} 