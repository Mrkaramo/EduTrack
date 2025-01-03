"use client";

import React, { useState, useRef, useEffect } from 'react';
import { LogOut } from 'lucide-react';
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";

export default function Header() {
  const { user } = useKindeBrowserClient();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Fermer le menu lors d'un clic à l'extérieur
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fonction pour obtenir les initiales
  const getInitials = () => {
    if (!user?.given_name && !user?.family_name) {
      return user?.email?.charAt(0).toUpperCase() || 'U';
    }
    return `${user?.given_name?.charAt(0) || ''}${user?.family_name?.charAt(0) || ''}`;
  };

  return (
    <header className="bg-white border-b border-gray-200/80 sticky top-0 z-30">
      <div className="px-8 py-4">
        <div className="flex items-center justify-end">
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
              <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-xl border border-gray-200/80 py-2 z-50">
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
    </header>
  );
} 