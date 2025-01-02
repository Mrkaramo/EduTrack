"use client";

import React, { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Calendar as CalendarIcon, ChevronDown, LogOut } from 'lucide-react';
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Calendar from './Calendar';

export default function Header() {
  const pathname = usePathname();
  const { user } = useKindeBrowserClient();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const profileRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  // Fonction pour obtenir le titre de la page en fonction du chemin
  const getPageTitle = () => {
    const path = pathname.split('/').filter(Boolean);
    const currentPage = path[path.length - 1];

    switch (currentPage) {
      case 'dashboard':
        return 'Dashboard';
      case 'attendance':
        return 'Attendance';
      case 'students':
        return 'Students';
      default:
        return 'Dashboard';
    }
  };

  // Fonction pour obtenir les initiales
  const getInitials = () => {
    if (!user?.given_name && !user?.family_name) {
      return user?.email?.charAt(0).toUpperCase() || 'U';
    }
    return `${user?.given_name?.charAt(0) || ''}${user?.family_name?.charAt(0) || ''}`;
  };

  // Fermer les menus lors d'un clic à l'extérieur
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white border-b border-gray-200/80 sticky top-0 z-30">
      <div className="px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Titre de la page */}
          <h1 className="text-2xl font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            {getPageTitle()}
          </h1>

          {/* Date et profil */}
          <div className="flex items-center gap-6">
            {/* Sélecteur de date */}
            <div className="relative" ref={calendarRef}>
              <button
                onClick={() => setShowCalendar(!showCalendar)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200/80 rounded-lg hover:border-gray-300 transition-colors shadow-sm group"
              >
                <CalendarIcon className="w-5 h-5 text-gray-400 group-hover:text-gray-500" />
                <span className="text-gray-700 font-medium group-hover:text-gray-900">
                  {format(selectedDate, 'dd MMMM yyyy', { locale: fr })}
                </span>
              </button>

              {showCalendar && (
                <Calendar
                  selectedDate={selectedDate}
                  onDateSelect={(date) => {
                    setSelectedDate(date);
                    setShowCalendar(false);
                  }}
                  onClose={() => setShowCalendar(false)}
                />
              )}
            </div>

            {/* Profil utilisateur */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 group"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-medium shadow-md group-hover:shadow-lg transition-all transform group-hover:scale-105">
                  {getInitials()}
                </div>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-xl border border-gray-200/80 py-2 z-50 transform transition-all">
                  <div className="px-4 py-3 border-b border-gray-200/80">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.given_name} {user?.family_name}
                    </p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {user?.email}
                    </p>
                  </div>
                  <LogoutLink 
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    postLogoutRedirectURL="/"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Se déconnecter</span>
                  </LogoutLink>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 