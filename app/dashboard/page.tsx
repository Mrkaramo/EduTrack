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
  AreaChart,
  Area,
  LabelList
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

  // Charger les statistiques de présence
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        
        // Statistiques hebdomadaires
        const weeklyResponse = await fetch(
          `/api/dashboard/attendance-stats?departmentCode=${selectedDepartment}&levelCode=${selectedLevel}&type=weekly`
        );
        
        if (weeklyResponse.ok) {
          const weeklyData = await weeklyResponse.json();
          setWeeklyStats(weeklyData.stats || [{
            label: 'Statistiques de la semaine',
            tauxPresence: 0,
            tauxAbsence: 0,
            totalPresences: 0,
            totalAbsences: 0,
            totalEtudiants: 0,
            periode: 'Aucune donnée'
          }]);
        } else {
          throw new Error('Erreur lors de la récupération des statistiques hebdomadaires');
        }

        // Statistiques mensuelles
        const monthlyResponse = await fetch(
          `/api/dashboard/attendance-stats?departmentCode=${selectedDepartment}&levelCode=${selectedLevel}&type=monthly`
        );
        
        if (monthlyResponse.ok) {
          const monthlyData = await monthlyResponse.json();
          setMonthlyStats(monthlyData.stats || [{
            label: 'Statistiques du mois',
            tauxPresence: 0,
            tauxAbsence: 0,
            totalPresences: 0,
            totalAbsences: 0,
            totalEtudiants: 0,
            periode: 'Aucune donnée'
          }]);
        } else {
          throw new Error('Erreur lors de la récupération des statistiques mensuelles');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des statistiques:', error);
        // Réinitialiser les stats en cas d'erreur
        setWeeklyStats([{
          label: 'Statistiques de la semaine',
          tauxPresence: 0,
          tauxAbsence: 0,
          totalPresences: 0,
          totalAbsences: 0,
          totalEtudiants: 0,
          periode: 'Erreur de chargement'
        }]);
        setMonthlyStats([{
          label: 'Statistiques du mois',
          tauxPresence: 0,
          tauxAbsence: 0,
          totalPresences: 0,
          totalAbsences: 0,
          totalEtudiants: 0,
          periode: 'Erreur de chargement'
        }]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [selectedDepartment, selectedLevel]);

  // Log des stats avant le rendu
  console.log('Stats avant rendu:', { weeklyStats });

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
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300">
          <div className="flex flex-col space-y-2 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Statistiques de présence hebdomadaire
                </h3>
                <p className="text-sm text-gray-500">
                  {selectedDepartment} - {selectedLevel}
                </p>
              </div>
              <div className="px-3 py-1 bg-blue-50 rounded-full">
                <p className="text-xs font-medium text-blue-600">
                  01/01 - 07/01/2025
                </p>
              </div>
            </div>
          </div>

          {/* Graphique hebdomadaire */}
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={weeklyStats} 
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                barGap={30}
              >
                <defs>
                  <linearGradient id="colorPresence" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.6}/>
                  </linearGradient>
                  <linearGradient id="colorAbsence" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0.6}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis 
                  dataKey="label" 
                  tick={false}
                  axisLine={false}
                />
                <YAxis 
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                />
                <Tooltip 
                  formatter={(value: number) => [`${value}%`]}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '0.75rem',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
                  }}
                  cursor={{ fill: 'transparent' }}
                />
                <Legend 
                  wrapperStyle={{
                    paddingTop: '20px'
                  }}
                />
                <Bar 
                  dataKey="tauxPresence" 
                  name="Taux de présence" 
                  fill="url(#colorPresence)"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={100}
                >
                  <LabelList
                    dataKey="tauxPresence"
                    position="top"
                    formatter={(value: number) => `${value}%`}
                    style={{ fill: '#4F46E5', fontSize: '13px', fontWeight: 'bold' }}
                  />
                </Bar>
                <Bar 
                  dataKey="tauxAbsence" 
                  name="Taux d'absence" 
                  fill="url(#colorAbsence)"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={100}
                >
                  <LabelList
                    dataKey="tauxAbsence"
                    position="top"
                    formatter={(value: number) => `${value}%`}
                    style={{ fill: '#EF4444', fontSize: '13px', fontWeight: 'bold' }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Évolution mensuelle */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300">
          <div className="flex flex-col space-y-2 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Évolution mensuelle des présences
                </h3>
                <p className="text-sm text-gray-500">
                  {selectedDepartment} - {selectedLevel}
                </p>
              </div>
              <div className="px-3 py-1 bg-blue-50 rounded-full">
                <p className="text-xs font-medium text-blue-600">
                  Janvier 2025
                </p>
              </div>
            </div>
          </div>

          {/* Graphique mensuel */}
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={monthlyStats} 
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                barGap={30}
              >
                <defs>
                  <linearGradient id="colorPresenceMonthly" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.6}/>
                  </linearGradient>
                  <linearGradient id="colorAbsenceMonthly" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0.6}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis 
                  dataKey="label" 
                  tick={false}
                  axisLine={false}
                />
                <YAxis 
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                />
                <Tooltip 
                  formatter={(value: number) => [`${value}%`]}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '0.75rem',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
                  }}
                  cursor={{ fill: 'transparent' }}
                />
                <Legend 
                  wrapperStyle={{
                    paddingTop: '20px'
                  }}
                />
                <Bar 
                  dataKey="tauxPresence" 
                  name="Taux de présence" 
                  fill="url(#colorPresenceMonthly)"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={100}
                >
                  <LabelList
                    dataKey="tauxPresence"
                    position="top"
                    formatter={(value: number) => `${value}%`}
                    style={{ fill: '#4F46E5', fontSize: '13px', fontWeight: 'bold' }}
                  />
                </Bar>
                <Bar 
                  dataKey="tauxAbsence" 
                  name="Taux d'absence" 
                  fill="url(#colorAbsenceMonthly)"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={100}
                >
                  <LabelList
                    dataKey="tauxAbsence"
                    position="top"
                    formatter={(value: number) => `${value}%`}
                    style={{ fill: '#EF4444', fontSize: '13px', fontWeight: 'bold' }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
} 