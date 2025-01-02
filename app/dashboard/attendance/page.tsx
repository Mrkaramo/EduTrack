"use client";

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  ChevronDown, 
  Calendar,
  Search, 
  Check, 
  X, 
  Loader2,
  Users,
  Building2,
  GraduationCap,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type DepartmentCode = '2AP' | 'BDAI' | 'GC' | 'GI' | 'GM' | 'GSTR' | 'GCSE' | 'SCM';

const DEPARTMENTS = [
  { id: 1, code: '2AP', name: 'Classes Préparatoires' },
  { id: 2, code: 'BDAI', name: 'Big Data et Intelligence Artificielle' },
  { id: 3, code: 'GC', name: 'Génie Civil' },
  { id: 4, code: 'GI', name: 'Génie Informatique' },
  { id: 5, code: 'GM', name: 'Génie Mécanique' },
  { id: 6, code: 'GSTR', name: 'Génie des Systèmes de Télécommunications Réseaux' },
  { id: 7, code: 'GCSE', name: 'Génie Cyber Sécurité et Systèmes Embarqués' },
  { id: 8, code: 'SCM', name: 'Supply Chain Management' }
];

const LEVELS_BY_DEPARTMENT: Record<DepartmentCode, Array<{ id: number; code: string; name: string }>> = {
  '2AP': [
    { id: 1, code: '2AP1', name: 'Première Année Préparatoire' },
    { id: 2, code: '2AP2', name: 'Deuxième Année Préparatoire' }
  ],
  'BDAI': [
    { id: 3, code: 'BDAI1', name: 'Première Année BDAI' },
    { id: 4, code: 'BDAI2', name: 'Deuxième Année BDAI' },
    { id: 5, code: 'BDAI3', name: 'Troisième Année BDAI' }
  ],
  'GC': [
    { id: 6, code: 'GC1', name: 'Première Année GC' },
    { id: 7, code: 'GC2', name: 'Deuxième Année GC' },
    { id: 8, code: 'GC3', name: 'Troisième Année GC' }
  ],
  'GI': [
    { id: 9, code: 'GI1', name: 'Première Année GI' },
    { id: 10, code: 'GI2', name: 'Deuxième Année GI' },
    { id: 11, code: 'GI3', name: 'Troisième Année GI' }
  ],
  'GM': [
    { id: 12, code: 'GM1', name: 'Première Année GM' },
    { id: 13, code: 'GM2', name: 'Deuxième Année GM' },
    { id: 14, code: 'GM3', name: 'Troisième Année GM' }
  ],
  'GSTR': [
    { id: 15, code: 'GSTR1', name: 'Première Année GSTR' },
    { id: 16, code: 'GSTR2', name: 'Deuxième Année GSTR' },
    { id: 17, code: 'GSTR3', name: 'Troisième Année GSTR' }
  ],
  'GCSE': [
    { id: 18, code: 'GCSE1', name: 'Première Année GCSE' },
    { id: 19, code: 'GCSE2', name: 'Deuxième Année GCSE' },
    { id: 20, code: 'GCSE3', name: 'Troisième Année GCSE' }
  ],
  'SCM': [
    { id: 21, code: 'SCM1', name: 'Première Année SCM' },
    { id: 22, code: 'SCM2', name: 'Deuxième Année SCM' },
    { id: 23, code: 'SCM3', name: 'Troisième Année SCM' }
  ]
};

interface Student {
  id: number;
  firstName: string;
  lastName: string;
  attendances: Array<{
    id: number;
    isPresent: boolean;
    date: string;
  }>;
}

interface Level {
  id: number;
  code: string;
  name: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function AttendancePage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentCode>('2AP');
  const [selectedLevel, setSelectedLevel] = useState<string>('2AP1');
  const [selectedLevelId, setSelectedLevelId] = useState<number>(1);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [showStats, setShowStats] = useState(false);
  const [savingAttendance, setSavingAttendance] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Effet pour mettre à jour le niveau sélectionné quand le département change
  useEffect(() => {
    const level = LEVELS_BY_DEPARTMENT[selectedDepartment][0];
    setSelectedLevel(level.code);
    setSelectedLevelId(level.id);
  }, [selectedDepartment]);

  // Effet pour mettre à jour l'ID du niveau quand le niveau change
  useEffect(() => {
    const department = LEVELS_BY_DEPARTMENT[selectedDepartment];
    const level = department.find(l => l.code === selectedLevel);
    if (level) {
      setSelectedLevelId(level.id);
    }
  }, [selectedLevel, selectedDepartment]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Chargement des étudiants...', {
        levelId: selectedLevelId,
        date: selectedDate.toISOString()
      });

      const response = await fetch(
        `/api/attendance?levelId=${selectedLevelId}&date=${selectedDate.toISOString()}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors du chargement des données');
      }

      const data = await response.json();
      console.log('Étudiants chargés:', {
        count: data.length,
        sample: data[0]
      });
      setStudents(data);
    } catch (error) {
      console.error('Erreur:', error);
      setError(error instanceof Error ? error.message : 'Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  // Effet pour charger les étudiants quand le niveau ou la date change
  useEffect(() => {
    if (selectedLevelId) {
      loadStudents();
    }
  }, [selectedLevelId, selectedDate]);

  const markAttendance = async (studentId: number, currentStatus: boolean | undefined) => {
    try {
      setError(null);
      setSavingAttendance(studentId);

      const normalizedDate = new Date(selectedDate);
      normalizedDate.setUTCHours(0, 0, 0, 0);

      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId,
          isPresent: !currentStatus,
          date: normalizedDate.toISOString(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de l\'enregistrement de la présence');
      }

      const updatedStudent = await response.json();

      // Mettre à jour uniquement l'étudiant modifié dans la liste
      setStudents(currentStudents => 
        currentStudents.map(student => 
          student.id === updatedStudent.id ? updatedStudent : student
        )
      );
    } catch (error) {
      console.error('Erreur:', error);
      setError(error instanceof Error ? error.message : 'Erreur lors de l\'enregistrement de la présence');
    } finally {
      setSavingAttendance(null);
    }
  };

  const isToday = (date: Date) => {
    const today = new Date();
    const compareDate = new Date(date);
    
    // Normaliser les dates pour comparer uniquement la partie date
    const normalizedToday = new Date(today.toISOString().split('T')[0]);
    const normalizedCompareDate = new Date(compareDate.toISOString().split('T')[0]);
    
    return normalizedToday.getTime() === normalizedCompareDate.getTime();
  };

  const getAttendanceStatus = (student: Student) => {
    const attendance = student.attendances?.find(a => {
      const attendanceDate = new Date(a.date);
      const compareDate = new Date(selectedDate);
      
      // Normaliser les deux dates pour la comparaison
      attendanceDate.setUTCHours(0, 0, 0, 0);
      compareDate.setUTCHours(0, 0, 0, 0);
      
      return attendanceDate.getTime() === compareDate.getTime();
    });
    
    return attendance?.isPresent;
  };

  const filteredStudents = students.filter(student => 
    `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const getAttendanceStats = () => {
    const total = filteredStudents.length;
    const present = filteredStudents.filter(student => 
      student.attendances?.find(a => 
        new Date(a.date).toDateString() === selectedDate.toDateString() && a.isPresent === true
      )
    ).length;
    const absent = total - present;
    
    return { total, present, absent };
  };

  // Fonction pour marquer automatiquement les absences à la fin de la journée
  const markAbsentForUnmarkedStudents = async () => {
    try {
      setError(null);
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);

      // Ne procéder que si c'est pour la date d'aujourd'hui
      if (!isToday(selectedDate)) {
        return;
      }

      // Trouver les étudiants sans présence marquée
      const unmarkedStudents = filteredStudents.filter(student => {
        const status = getAttendanceStatus(student);
        return status === undefined;
      });

      // Marquer chaque étudiant non marqué comme absent
      for (const student of unmarkedStudents) {
        await markAttendance(student.id, true); // On passe true car la fonction inverse le statut
      }

      // Recharger les étudiants pour mettre à jour l'interface
      await loadStudents();
    } catch (error) {
      console.error('Erreur lors du marquage automatique des absences:', error);
      setError('Erreur lors du marquage automatique des absences');
    }
  };

  // Ajouter un useEffect pour vérifier la fin de journée
  useEffect(() => {
    const now = new Date();
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 0, 0);

    const timeUntilEndOfDay = endOfDay.getTime() - now.getTime();
    
    if (timeUntilEndOfDay > 0) {
      const timer = setTimeout(markAbsentForUnmarkedStudents, timeUntilEndOfDay);
      return () => clearTimeout(timer);
    }
  }, [selectedDate]);

  return (
    <div className="p-6 space-y-8">
      {/* Message d'erreur en haut */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 bg-red-50 border border-red-200 rounded-xl p-4 shadow-lg max-w-md"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <X className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-red-600">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="p-1 hover:bg-red-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-red-500" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* En-tête amélioré */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600 bg-opacity-10 rounded-2xl backdrop-blur-sm">
            <Users className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion des présences</h1>
            <p className="text-sm text-gray-600 mt-1">
              {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
            </p>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowStats(!showStats)}
          className="px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          {showStats ? 'Masquer les statistiques' : 'Voir les statistiques'}
        </motion.button>
      </div>

      {/* Statistiques */}
      <AnimatePresence>
        {showStats && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-blue-900">Total Étudiants</h3>
              <p className="text-3xl font-bold text-blue-600">{getAttendanceStats().total}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-green-900">Présents</h3>
              <p className="text-3xl font-bold text-green-600">{getAttendanceStats().present}</p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-red-900">Absents</h3>
              <p className="text-3xl font-bold text-red-600">{getAttendanceStats().absent}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filtres et sélecteurs améliorés */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
      >
        {/* Sélecteur de département */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Département</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
          <select
              value={selectedDepartment}
            onChange={(e) => {
                const newDepartment = e.target.value as DepartmentCode;
                setSelectedDepartment(newDepartment);
                setSelectedLevel(`${newDepartment}1`);
              }}
              className="pl-10 w-full px-4 py-2 bg-white border border-gray-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept.code} value={dept.code}>
                  {dept.code}
              </option>
            ))}
          </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Sélecteur de niveau */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Niveau</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <GraduationCap className="h-5 w-5 text-blue-600" />
            </div>
          <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="pl-10 w-full px-4 py-2 bg-white border border-gray-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              {LEVELS_BY_DEPARTMENT[selectedDepartment].map((level) => (
                <option key={level.code} value={level.code}>
                  {level.code}
              </option>
            ))}
          </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Sélecteur de date avec navigation */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Date</label>
          <div className="flex items-center gap-2">
          <button
              onClick={handlePreviousDay}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <input
                type="date"
                value={format(selectedDate, 'yyyy-MM-dd')}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className="pl-10 w-full px-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <button
              onClick={handleNextDay}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Barre de recherche */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Rechercher</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-blue-600" />
            </div>
          <input
            type="text"
            placeholder="Rechercher un étudiant..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full px-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
        </div>
      </motion.div>

      {/* Liste des étudiants en tableau */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl border border-gray-100 shadow-sm"
          >
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="mt-4 text-sm text-gray-500">Chargement des étudiants...</p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden"
          >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
                  <tr className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 border-b border-gray-200">
                    <th className="py-5 px-8 text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-700">N°</span>
                      </div>
                    </th>
                    <th className="py-5 px-8 text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-700">Nom</span>
                      </div>
                </th>
                    <th className="py-5 px-8 text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-700">Prénom</span>
                      </div>
                  </th>
                    <th className="py-5 px-8 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-sm font-semibold text-gray-700">
                          Présence {!isToday(selectedDate) && '(Lecture seule)'}
                        </span>
                      </div>
                </th>
              </tr>
            </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredStudents.map((student, index) => {
                    const status = getAttendanceStatus(student);
                    const isEditable = isToday(selectedDate);

                return (
                      <motion.tr
                        key={student.id}
                        variants={itemVariants}
                        className={`group transition-colors hover:bg-blue-50/30 ${
                          index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                        } ${!isEditable ? 'cursor-not-allowed' : ''}`}
                      >
                        <td className="py-4 px-8">
                      <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-600 group-hover:text-blue-600 transition-colors">
                              {index + 1}
                            </span>
                      </div>
                    </td>
                        <td className="py-4 px-8">
                          <span className="text-sm font-medium text-gray-900 group-hover:text-blue-700 transition-colors">
                            {student.lastName}
                          </span>
                        </td>
                        <td className="py-4 px-8">
                          <span className="text-sm font-medium text-gray-900 group-hover:text-blue-700 transition-colors">
                            {student.firstName}
                          </span>
                        </td>
                        <td className="py-4 px-8">
                          <div className="flex justify-center">
                            <motion.button
                              onClick={() => {
                                if (isEditable && !savingAttendance) {
                                  // Mettre à jour l'état localement d'abord
                                  setStudents(currentStudents =>
                                    currentStudents.map(s =>
                                      s.id === student.id
                                        ? {
                                            ...s,
                                            attendances: [{
                                              ...s.attendances[0],
                                              isPresent: !status
                                            }]
                                          }
                                        : s
                                    )
                                  );
                                  // Puis envoyer la mise à jour au serveur
                                  markAttendance(student.id, status);
                                }
                              }}
                              disabled={!isEditable || savingAttendance === student.id}
                              className={`
                                relative w-6 h-6 rounded-md transition-all duration-200 ease-in-out
                                ${status ? 'bg-green-500 hover:bg-green-600' : 'bg-white hover:bg-gray-50'}
                                ${isEditable ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}
                                border-2 ${status ? 'border-green-600' : 'border-gray-300'}
                                ${isEditable && !savingAttendance ? 'hover:border-blue-500 hover:scale-105' : ''}
                                transform-gpu
                              `}
                              whileHover={isEditable && !savingAttendance ? { scale: 1.05 } : {}}
                              whileTap={isEditable && !savingAttendance ? { scale: 0.95 } : {}}
                              animate={{
                                backgroundColor: status ? '#22c55e' : '#ffffff',
                                borderColor: status ? '#16a34a' : '#d1d5db'
                              }}
                              transition={{ duration: 0.2 }}
                            >
                              <motion.div
                                initial={false}
                                animate={{
                                  scale: status ? 1 : 0,
                                  opacity: status ? 1 : 0
                                }}
                                transition={{ duration: 0.2 }}
                              >
                                <Check className="w-4 h-4 text-white mx-auto" />
                              </motion.div>
                              {savingAttendance === student.id && (
                                <motion.div
                                  className="absolute inset-0 flex items-center justify-center"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                >
                                  <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                                </motion.div>
                              )}
                            </motion.button>
                      </div>
                    </td>
                      </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message si aucun étudiant trouvé */}
      {!loading && filteredStudents.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl border border-gray-100 shadow-sm"
        >
          <div className="p-4 bg-gray-50 rounded-2xl">
            <Users className="w-12 h-12 text-gray-400" />
          </div>
          <p className="mt-4 text-gray-500 font-medium">Aucun étudiant trouvé</p>
          <p className="mt-2 text-sm text-gray-400">Modifiez vos critères de recherche</p>
        </motion.div>
        )}
    </div>
  );
} 