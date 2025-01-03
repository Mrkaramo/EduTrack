"use client";

import React, { useState, useRef, useEffect } from 'react';
import { 
  Shield, 
  User, 
  Camera,
  Save,
  Check,
  Lock
} from 'lucide-react';
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';

interface SettingSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
}

const settingSections: SettingSection[] = [
  {
    id: 'profile',
    title: 'Profil',
    icon: <User className="w-5 h-5" />,
    description: 'Gérez vos informations personnelles'
  },
  {
    id: 'security',
    title: 'Sécurité',
    icon: <Shield className="w-5 h-5" />,
    description: 'Paramètres de sécurité et mot de passe'
  }
];

export default function SettingsPage() {
  const { user } = useKindeBrowserClient();
  const [activeSection, setActiveSection] = useState('profile');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileImage, setProfileImage] = useState<string | null>(user?.picture || null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Mettre à jour les données du formulaire quand l'utilisateur est chargé
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.given_name || '',
        lastName: user.family_name || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // Simuler une sauvegarde
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Paramètres sauvegardés avec succès', {
        duration: 3000,
        position: 'top-right',
        icon: <Check className="w-5 h-5 text-green-500" />
      });
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde des paramètres');
    } finally {
      setIsSaving(false);
    }
  };

  const handleProfilePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
        toast.success('Photo de profil mise à jour avec succès', {
          icon: <Check className="w-5 h-5 text-green-500" />
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Photo de profil</label>
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-medium overflow-hidden shadow-lg">
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      formData.firstName?.charAt(0) || formData.email?.charAt(0)
                    )}
                  </div>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                  >
                    <Camera className="w-6 h-6 text-white" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfilePhotoChange}
                  />
                </div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm hover:shadow flex items-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  Changer la photo
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Prénom</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  readOnly
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">Information provenant de votre compte</p>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Nom</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  readOnly
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">Information provenant de votre compte</p>
              </div>
              <div className="space-y-1.5 col-span-2">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  readOnly
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">Information provenant de votre compte</p>
              </div>
            </div>
          </motion.div>
        );

      case 'security':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Lock className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Modification du mot de passe</h3>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Mot de passe actuel</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Nouveau mot de passe</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Confirmer le nouveau mot de passe</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      <Toaster />

      {/* Effets de fond */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[500px] w-[500px] rounded-full bg-gradient-to-br from-blue-400 to-indigo-400 opacity-10 blur-[100px] animate-pulse-slow"></div>
      </div>

      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="col-span-3">
            <nav className="space-y-2">
              {settingSections.map((section) => (
                <motion.button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    activeSection === section.id
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {section.icon}
                  <div className="text-left">
                    <div className="text-sm font-medium">{section.title}</div>
                    <div className={`text-xs ${
                      activeSection === section.id ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {section.description}
                    </div>
                  </div>
                </motion.button>
              ))}
            </nav>
          </div>

          {/* Contenu principal */}
          <div className="col-span-9">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm p-8">
              {renderSectionContent()}

              {/* Bouton de sauvegarde */}
              {activeSection === 'security' && (
                <motion.div 
                  className="mt-8 pt-6 border-t border-gray-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex justify-end">
                    <motion.button
                      onClick={handleSaveSettings}
                      disabled={isSaving}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`
                        flex items-center gap-2 px-6 py-2.5 
                        ${isSaving ? 'bg-gray-400' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'} 
                        text-white rounded-lg transition-all duration-200 shadow-lg shadow-blue-500/25
                      `}
                    >
                      {isSaving ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Sauvegarde en cours...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          Sauvegarder les modifications
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 