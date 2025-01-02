"use client";

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { 
  X, 
  ChevronDown, 
  User, 
  Mail, 
  MapPin, 
  Building2, 
  GraduationCap, 
  Asterisk,
  UserPlus,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Department {
  id: number;
  code: DepartmentCode;
  name: string;
}

interface Level {
  id: number;
  code: string;
  name: string;
}

type DepartmentCode = '2AP' | 'BDAI' | 'GC' | 'GI' | 'GM' | 'GSTR' | 'GCSE' | 'SCM';

const DEPARTMENTS: Department[] = [
  { id: 1, code: '2AP', name: 'Classes Préparatoires' },
  { id: 2, code: 'BDAI', name: 'Big Data et Intelligence Artificielle' },
  { id: 3, code: 'GC', name: 'Génie Civil' },
  { id: 4, code: 'GI', name: 'Génie Informatique' },
  { id: 5, code: 'GM', name: 'Génie Mécanique' },
  { id: 6, code: 'GSTR', name: 'Génie des Systèmes de Télécommunications Réseaux' },
  { id: 7, code: 'GCSE', name: 'Génie Cyber Sécurité et Systèmes Embarqués' },
  { id: 8, code: 'SCM', name: 'Supply Chain Management' }
];

const LEVELS_BY_DEPARTMENT: Record<DepartmentCode, Level[]> = {
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

interface AddStudentFormProps {
  onSuccess: () => void;
}

const FormInput = ({ 
  label, 
  id, 
  type = "text", 
  required = false, 
  icon: Icon,
  ...props 
}: { 
  label: string; 
  id: string; 
  type?: string; 
  required?: boolean; 
  icon: any;
  [key: string]: any;
}) => (
  <div className="space-y-2">
    <label htmlFor={id} className="flex items-center gap-1 text-sm font-medium text-gray-700">
      {label}
      {required && <span className="text-red-500 text-lg leading-none">*</span>}
    </label>
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="h-5 w-5 text-blue-600 group-hover:text-blue-700 transition-colors duration-200" style={{ filter: 'none' }} />
      </div>
      <input
        type={type}
        id={id}
        name={id}
        required={required}
        className="pl-10 w-full px-4 py-3 bg-white/50 backdrop-blur-none border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200 hover:border-blue-300 placeholder:text-gray-400"
        {...props}
      />
    </div>
  </div>
);

const FormSelect = ({ 
  label, 
  id, 
  icon: Icon, 
  required = false,
  ...props 
}: { 
  label: string; 
  id: string; 
  icon: any;
  required?: boolean;
  [key: string]: any;
}) => (
  <div className="space-y-2">
    <label htmlFor={id} className="flex items-center gap-1 text-sm font-medium text-gray-700">
      {label}
      {required && <span className="text-red-500 text-lg leading-none">*</span>}
    </label>
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="h-5 w-5 text-blue-600 group-hover:text-blue-700 transition-colors duration-200" style={{ filter: 'none' }} />
      </div>
      <select
        id={id}
        className="pl-10 w-full px-4 py-3 bg-white/50 backdrop-blur-none border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200 hover:border-blue-300 appearance-none"
        {...props}
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <ChevronDown className="h-5 w-5 text-blue-600" style={{ filter: 'none' }} />
      </div>
    </div>
  </div>
);

export default function AddStudentForm({ onSuccess }: AddStudentFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentCode>('BDAI');
  const [selectedLevel, setSelectedLevel] = useState('BDAI1');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setLoading(true);

    const promise = new Promise(async (resolve, reject) => {
      try {
        const formData = new FormData(form);
        const studentData = {
          firstName: formData.get('firstName') as string,
          lastName: formData.get('lastName') as string,
          email: formData.get('email') as string || null,
          address: formData.get('address') as string || null,
          departmentCode: selectedDepartment,
          levelCode: selectedLevel,
        };

        const response = await fetch('/api/students', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(studentData),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Erreur lors de l\'ajout de l\'étudiant');
        }

        form.reset();
        setIsOpen(false);
        onSuccess();
        resolve('Étudiant ajouté avec succès');
      } catch (error) {
        console.error('Error adding student:', error);
        reject(error instanceof Error ? error.message : 'Erreur lors de l\'ajout de l\'étudiant');
      } finally {
        setLoading(false);
      }
    });

    toast.promise(promise, {
      loading: 'Ajout de l\'étudiant en cours...',
      success: 'Étudiant ajouté avec succès',
      error: (err) => `${err}`,
    });
  };

  const handleDepartmentChange = (departmentCode: DepartmentCode) => {
    setSelectedDepartment(departmentCode);
    const defaultLevel = `${departmentCode}1`;
    setSelectedLevel(defaultLevel);
  };

  if (!isOpen) {
    return (
      <motion.button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <UserPlus className="w-5 h-5" style={{ filter: 'none' }} />
        Ajouter un étudiant
      </motion.button>
    );
  }

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      >
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white/90 backdrop-blur-none rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-xl shadow-sm">
                  <UserPlus className="w-7 h-7 text-blue-600" style={{ filter: 'none' }} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Ajouter un étudiant</h2>
                  <p className="text-sm text-gray-500">Remplissez les informations de l'étudiant</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100 transition-all duration-200"
              >
                <X className="w-6 h-6" style={{ filter: 'none' }} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="Prénom"
                  id="firstName"
                  required
                  icon={User}
                  placeholder="John"
                />
                <FormInput
                  label="Nom"
                  id="lastName"
                  required
                  icon={User}
                  placeholder="Doe"
                />
              </div>

              <FormInput
                label="E-mail institutionnel"
                id="email"
                type="email"
                icon={Mail}
                placeholder="john.doe@etu.uae.ac.ma"
              />

              <FormInput
                label="Adresse"
                id="address"
                icon={MapPin}
                placeholder="123 Rue Example, Ville"
              />

              <div className="grid grid-cols-2 gap-4">
                <FormSelect
                  label="Département"
                  id="department"
                  icon={Building2}
                  required
                  value={selectedDepartment}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                    handleDepartmentChange(e.target.value as DepartmentCode)
                  }
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept.code} value={dept.code}>
                      {dept.code}
                    </option>
                  ))}
                </FormSelect>

                <FormSelect
                  label="Niveau"
                  id="level"
                  icon={GraduationCap}
                  required
                  value={selectedLevel}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                    setSelectedLevel(e.target.value)
                  }
                >
                  {LEVELS_BY_DEPARTMENT[selectedDepartment].map((level) => (
                    <option key={level.code} value={level.code}>
                      {level.code}
                    </option>
                  ))}
                </FormSelect>
              </div>

              <div className="flex justify-end items-center gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-200"
                >
                  <X className="w-4 h-4" style={{ filter: 'none' }} />
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" style={{ filter: 'none' }} />
                      <span>Ajout en cours...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" style={{ filter: 'none' }} />
                      <span>Ajouter l'étudiant</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 