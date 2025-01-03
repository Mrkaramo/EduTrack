"use client";

import { useState, useEffect } from 'react';
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { Building2, ChevronDown, Users } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { departments, levels } from '@/lib/data';
import type { DepartmentCode } from '@/lib/types';

export default function DashboardPage() {
  const currentDate = new Date();
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentCode>('BDAI');
  const [selectedLevel, setSelectedLevel] = useState('BDAI1');
  const [weeklyStats, setWeeklyStats] = useState<any[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<any[]>([]);
  const [studentCount, setStudentCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  // Charger le nombre d'étudiants
  useEffect(() => {
    const fetchStudentCount = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/dashboard/student-count?departmentCode=${selectedDepartment}&levelCode=${selectedLevel}`
        );
        
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération du nombre d\'étudiants');
        }

        const data = await response.json();
        setStudentCount(data.count);
      } catch (error) {
        console.error('Erreur:', error);
        setStudentCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudentCount();
  }, [selectedDepartment, selectedLevel]);

  // Charger les données des graphiques
  useEffect(() => {
    // Données hebdomadaires
    const weekly = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return {
        date: format(date, 'EEE', { locale: fr }),
        présents: Math.floor(Math.random() * 30) + 20,
        absents: Math.floor(Math.random() * 10)
      };
    });
    setWeeklyStats(weekly);

    // Données mensuelles
    const monthly = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return {
        date: format(date, 'dd MMM', { locale: fr }),
        'taux_présence': Math.floor(Math.random() * 40) + 60
      };
    });
    setMonthlyStats(monthly);
  }, [selectedDepartment, selectedLevel]);

  return (
    <div className="p-6 space-y-8">
      {/* En-tête avec filtres */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {format(currentDate, 'EEEE d MMMM yyyy', { locale: fr })}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Suivi des présences
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* Sélecteur de département */}
          <div className="relative min-w-[180px]">
            <select
              value={selectedDepartment}
              onChange={(e) => {
                setSelectedDepartment(e.target.value as DepartmentCode);
                setSelectedLevel(levels[e.target.value as DepartmentCode][0]);
              }}
              className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-medium"
            >
              {departments.map((dept) => (
                <option key={dept.code} value={dept.code}>
                  {dept.code}
                </option>
              ))}
            </select>
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>

          {/* Sélecteur de niveau */}
          <div className="relative min-w-[140px]">
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full px-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-medium"
            >
              {levels[selectedDepartment].map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Nombre d'étudiants */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500">
              Étudiants inscrits en {selectedLevel}
            </div>
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                `${studentCount} étudiant${studentCount > 1 ? 's' : ''}`
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Statistiques hebdomadaires */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Présences de la semaine
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyStats} margin={{ top: 0, right: 0, bottom: 0, left: -15 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                <XAxis dataKey="date" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '0.5rem',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                />
                <Bar dataKey="présents" name="Présents" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="absents" name="Absents" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Évolution mensuelle */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Évolution mensuelle des présences
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyStats} margin={{ top: 0, right: 0, bottom: 0, left: -15 }}>
                <defs>
                  <linearGradient id="colorPresence" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                <XAxis dataKey="date" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '0.5rem',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="taux_présence" 
                  name="Taux de présence"
                  stroke="#4F46E5" 
                  fillOpacity={1}
                  fill="url(#colorPresence)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
} 