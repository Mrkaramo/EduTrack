"use client";

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Building2, 
  GraduationCap,
  Loader2
} from 'lucide-react';
import type { DepartmentCode } from '@/lib/types';

interface AttendanceStats {
  global: {
    total: number;
    present: number;
    absent: number;
    presenceRate: number;
  };
  departments: Record<string, {
    total: number;
    present: number;
    absent: number;
    presenceRate: number;
  }>;
  levels: Record<string, {
    total: number;
    present: number;
    absent: number;
    presenceRate: number;
  }>;
}

const defaultStats: AttendanceStats = {
  global: {
    total: 0,
    present: 0,
    absent: 0,
    presenceRate: 0
  },
  departments: {},
  levels: {}
};

interface AttendanceStatsProps {
  date: Date;
  departmentCode: DepartmentCode;
  levelCode: string;
}

export default function AttendanceStats({ date, departmentCode, levelCode }: AttendanceStatsProps) {
  const [stats, setStats] = useState<AttendanceStats>(defaultStats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/dashboard/attendance-report?date=${date.toISOString()}&departmentCode=${departmentCode}&levelCode=${levelCode}`
        );
        
        if (!response.ok) {
          console.warn('Impossible de récupérer les statistiques');
          return;
        }

        const data = await response.json();
        setStats(data.stats || defaultStats);
      } catch (error) {
        console.warn('Erreur lors de la récupération des statistiques:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [date, departmentCode, levelCode]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">
          Statistiques de présence
        </h2>
        <div className="text-sm text-gray-500">
          {format(date, 'EEEE d MMMM yyyy', { locale: fr })}
        </div>
      </div>

      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Total Étudiants</div>
              <div className="text-2xl font-bold text-gray-900">{stats.global.total}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Présents</div>
              <div className="text-2xl font-bold text-green-600">{stats.global.present}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-50 rounded-lg">
              <UserX className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Absents</div>
              <div className="text-2xl font-bold text-red-600">{stats.global.absent}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 rounded-lg">
              <UserCheck className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Taux de présence</div>
              <div className="text-2xl font-bold text-indigo-600">{stats.global.presenceRate}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques par département */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <Building2 className="w-5 h-5 text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900">Par département</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(stats.departments).map(([code, deptStats]) => (
            <div key={code} className="p-4 bg-gray-50 rounded-lg">
              <div className="font-medium text-gray-900 mb-2">{code}</div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-500">Total:</div>
                <div className="text-gray-900 font-medium">{deptStats.total}</div>
                <div className="text-gray-500">Présents:</div>
                <div className="text-green-600 font-medium">{deptStats.present}</div>
                <div className="text-gray-500">Absents:</div>
                <div className="text-red-600 font-medium">{deptStats.absent}</div>
                <div className="text-gray-500">Taux:</div>
                <div className="text-indigo-600 font-medium">{deptStats.presenceRate}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Statistiques par niveau */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <GraduationCap className="w-5 h-5 text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900">Par niveau</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(stats.levels).map(([code, levelStats]) => (
            <div key={code} className="p-4 bg-gray-50 rounded-lg">
              <div className="font-medium text-gray-900 mb-2">{code}</div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-500">Total:</div>
                <div className="text-gray-900 font-medium">{levelStats.total}</div>
                <div className="text-gray-500">Présents:</div>
                <div className="text-green-600 font-medium">{levelStats.present}</div>
                <div className="text-gray-500">Absents:</div>
                <div className="text-red-600 font-medium">{levelStats.absent}</div>
                <div className="text-gray-500">Taux:</div>
                <div className="text-indigo-600 font-medium">{levelStats.presenceRate}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 