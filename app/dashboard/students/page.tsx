"use client";

import { useState, useEffect } from 'react';
import { 
  Search, 
  UserX, 
  Trash2, 
  Mail, 
  MapPin,
  Building2,
  GraduationCap,
  Users,
  Loader2,
  ChevronDown
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import AddStudentForm from './_components/AddStudentForm';
import { DEPARTMENTS, LEVELS_BY_DEPARTMENT, type DepartmentCode } from '@/lib/constants';

interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string | null;
  address: string | null;
  department: {
    id: number;
    code: string;
    name: string;
  };
  level: {
    id: number;
    code: string;
    name: string;
  };
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentCode>('BDAI');
  const [selectedLevel, setSelectedLevel] = useState<string>('BDAI1');
  const [searchTerm, setSearchTerm] = useState('');

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading students with:', { selectedDepartment, selectedLevel });

      const response = await fetch(
        `/api/students?department=${selectedDepartment}&level=${selectedLevel}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors du chargement des étudiants');
      }

      const data = await response.json();
      console.log('Received students:', data);
      setStudents(data);
    } catch (error) {
      console.error('Error loading students:', error);
      setError(error instanceof Error ? error.message : 'Erreur lors du chargement des étudiants');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, [selectedDepartment, selectedLevel]);

  const handleDepartmentChange = (departmentCode: DepartmentCode) => {
    setSelectedDepartment(departmentCode);
    // Réinitialiser le niveau lors du changement de département
    const defaultLevel = `${departmentCode}1`;
    setSelectedLevel(defaultLevel);
  };

  const handleDelete = async (studentId: number, studentName: string) => {
    const shouldDelete = window.confirm(
      `Êtes-vous sûr de vouloir supprimer l'étudiant ${studentName} ?`
    );

    if (!shouldDelete) return;

    try {
      const response = await fetch(`/api/students/${studentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la suppression');
      }

      toast.success(`L'étudiant ${studentName} a été supprimé avec succès`);
      loadStudents(); // Recharger la liste des étudiants
    } catch (error) {
      console.error('Error deleting student:', error);
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la suppression');
    }
  };

  const filteredStudents = students.filter(student => {
    const searchLower = searchTerm.toLowerCase();
    return (
      student.firstName.toLowerCase().includes(searchLower) ||
      student.lastName.toLowerCase().includes(searchLower) ||
      (student.email?.toLowerCase() || '').includes(searchLower)
    );
  });

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
          {error}
        </div>
        <button
          onClick={loadStudents}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* En-tête avec animation et icône plus visible */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-xl shadow-sm">
              <Users className="w-7 h-7 text-blue-600" style={{ filter: 'none' }} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestion des Étudiants</h1>
              <p className="mt-1 text-sm text-gray-500">
                Gérez et suivez tous les étudiants inscrits
              </p>
            </div>
          </div>
        </div>
        <AddStudentForm onSuccess={loadStudents} />
      </motion.div>

      {/* Filtres avec menus déroulants plus visibles */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-none p-6 rounded-2xl shadow-sm border border-gray-100/50 space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sélection du département avec style amélioré */}
          <div className="relative group">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Département
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Building2 className="h-5 w-5 text-blue-600" style={{ filter: 'none' }} />
              </div>
              <select
                value={selectedDepartment}
                onChange={(e) => handleDepartmentChange(e.target.value as DepartmentCode)}
                className="pl-10 w-full px-4 py-3 bg-blue-50 border-2 border-blue-200 rounded-xl text-blue-700 font-medium shadow-sm hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 appearance-none cursor-pointer"
              >
                {DEPARTMENTS.map((dept) => (
                  <option 
                    key={dept.code} 
                    value={dept.code}
                    className="bg-white text-gray-900 py-2"
                  >
                    {dept.code}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronDown className="h-5 w-5 text-blue-600" style={{ filter: 'none' }} />
              </div>
            </div>
          </div>

          {/* Sélection du niveau avec style assorti */}
          <div className="relative group">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Niveau
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <GraduationCap className="h-5 w-5 text-blue-600" style={{ filter: 'none' }} />
              </div>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="pl-10 w-full px-4 py-3 bg-blue-50 border-2 border-blue-200 rounded-xl text-blue-700 font-medium shadow-sm hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 appearance-none cursor-pointer"
              >
                {LEVELS_BY_DEPARTMENT[selectedDepartment].map((level) => (
                  <option 
                    key={level.code} 
                    value={level.code}
                    className="bg-white text-gray-900 py-2"
                  >
                    {level.code}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronDown className="h-5 w-5 text-blue-600" style={{ filter: 'none' }} />
              </div>
            </div>
          </div>

          {/* Barre de recherche */}
          <div className="relative group">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rechercher
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-blue-600" style={{ filter: 'none' }} />
              </div>
              <input
                type="text"
                placeholder="Rechercher un étudiant..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-700 placeholder:text-gray-400 shadow-sm hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Liste des étudiants avec toutes les informations */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center h-64 space-y-4"
          >
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" style={{ filter: 'none' }} />
            <p className="text-sm text-gray-500">Chargement des étudiants...</p>
          </motion.div>
        ) : filteredStudents.length === 0 ? (
          <motion.div 
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center justify-center py-12 space-y-4"
          >
            <div className="p-4 bg-blue-100 rounded-full shadow-sm">
              <UserX className="w-10 h-10 text-blue-600" style={{ filter: 'none' }} />
            </div>
            <div className="text-center">
              <h3 className="text-sm font-medium text-gray-900">Aucun étudiant trouvé</h3>
              <p className="mt-1 text-sm text-gray-500">
                Commencez par ajouter un nouvel étudiant ou modifiez vos filtres de recherche.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="table"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-white/80 backdrop-blur-none rounded-2xl shadow-sm overflow-hidden border border-gray-100/50"
          >
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Étudiant
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    E-mail institutionnel
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Adresse
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white/50 divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <motion.tr
                    key={student.id}
                    variants={itemVariants}
                    className="hover:bg-gray-50/50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-11 w-11 bg-blue-100 rounded-xl flex items-center justify-center shadow-sm">
                          <Users className="h-6 w-6 text-blue-600" style={{ filter: 'none' }} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {student.firstName} {student.lastName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Mail className="h-4 w-4 mr-2 text-blue-600" style={{ filter: 'none' }} />
                        {student.email || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-2 text-blue-600" style={{ filter: 'none' }} />
                        {student.address || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleDelete(student.id, `${student.firstName} ${student.lastName}`)}
                        className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      >
                        <Trash2 className="h-5 w-5" style={{ filter: 'none' }} />
                        Supprimer
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 