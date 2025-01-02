import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/server";
import { ArrowRight, Calendar, CheckCircle, Shield, Clock, FileText } from "lucide-react";
import Image from 'next/image';
import Head from 'next/head';

const features = [
  {
    title: "Suivi des présences en temps réel",
    description: "Enregistrez et suivez la présence des étudiants instantanément. Notifications automatiques pour une gestion proactive des absences.",
    icon: Calendar,
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    title: "Espace professeur sécurisé",
    description: "Interface intuitive et sécurisée permettant aux enseignants de gérer facilement les présences de leurs modules.",
    icon: Shield,
    color: "bg-indigo-500/10 text-indigo-500",
  },
  {
    title: "Gestion intelligente",
    description: "Automatisation complète du processus de suivi, éliminant les erreurs et simplifiant le travail des enseignants.",
    icon: Clock,
    color: "bg-violet-500/10 text-violet-500",
  },
  {
    title: "Analyses détaillées",
    description: "Génération automatique de rapports statistiques permettant un suivi précis et une prise de décision éclairée.",
    icon: FileText,
    color: "bg-pink-500/10 text-pink-500",
  },
];

const stats = [
  { label: "Temps économisé", value: "70%", description: "pour les professeurs" },
  { label: "Précision", value: "99.9%", description: "dans le suivi des présences" },
  { label: "Rapports", value: "100%", description: "automatisés" },
  { label: "Satisfaction", value: "95%", description: "des utilisateurs" },
];

const benefits = [
  "Simplification du processus de prise de présence",
  "Suivi en temps réel des absences",
  "Protection des données confidentielles",
  "Interface intuitive pour les enseignants",
];

// Ajout d'un composant Logo réutilisable pour une meilleure cohérence
const Logo = ({ size = 40, className = "" }) => (
  <div className={`group relative cursor-pointer transition-transform duration-300 ${className}`}>
    <Image
      src="/ENSA-LOGO-4.jpg"
      alt="ENSA Tétouan"
      width={size}
      height={size}
      className="rounded-xl shadow-md transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl"
      quality={100}
    />
    <div className="absolute inset-0 rounded-xl ring-2 ring-blue-500/20 transition-all duration-300 group-hover:ring-4 group-hover:ring-blue-500/40"></div>
  </div>
);

export default function Home() {
  return (
    <>
      <Head>
        <title>EduTrack ENSA Tétouan</title>
        <link rel="icon" href="/ENSA-LOGO-4.jpg" />
      </Head>
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-blue-50/10 to-indigo-50/20">
        {/* Motif de fond amélioré avec plus de profondeur */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[600px] w-[600px] rounded-full bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-400 opacity-10 blur-[120px] animate-pulse-slow"></div>
          <div className="absolute right-1/4 bottom-0 -z-10 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-blue-300 to-indigo-300 opacity-10 blur-[100px] animate-pulse-slow delay-1000"></div>
        </div>

        {/* Navigation avec effet de verre premium */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-lg border-b border-gray-100/50 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <div className="flex items-center gap-3 group">
                  <Logo />
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent transition-all duration-300 group-hover:bg-gradient-to-l">
                    EduTrack ENSA
                  </span>
                </div>
              </div>
              <LoginLink 
                className="group relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-gradient-to-l"
              >
                <span>Accéder à la plateforme</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </LoginLink>
            </div>
          </div>
        </nav>

        {/* Hero Section avec animations améliorées */}
        <main className="pt-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[1000px] h-[1000px] bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-full blur-3xl"></div>
              
              {/* Logo central avec effet de zoom premium */}
              <div className="flex justify-center mb-12">
                <Logo size={150} className="transform hover:scale-125 transition-transform duration-500 hover:rotate-3" />
              </div>
              
              {/* En-tête principal avec animation fluide */}
              <h1 className="text-6xl font-bold tracking-tight text-gray-900 sm:text-7xl lg:text-8xl">
                <span className="inline-block opacity-0 translate-y-4 animate-[fadeInUp_1s_ease-out_forwards] [text-wrap:balance]">
                  Gestion des présences
                </span>
                <br />
                <span className="inline-block opacity-0 translate-y-4 animate-[fadeInUp_1s_ease-out_0.3s_forwards] bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent hover:bg-gradient-to-l transition-all duration-500">
                  ENSA Tétouan
                </span>
              </h1>

              {/* Sous-titre avec animation douce */}
              <p className="mt-8 text-xl leading-8 text-gray-600 max-w-3xl mx-auto opacity-0 translate-y-4 animate-[fadeInUp_0.8s_ease-out_0.4s_forwards] [text-wrap:balance]">
                Une solution innovante et sur-mesure pour gérer efficacement les présences à l'École Nationale 
                des Sciences Appliquées de Tétouan.
              </p>

              {/* Boutons d'action avec effets premium */}
              <div className="mt-10 flex items-center justify-center gap-x-6 opacity-0 translate-y-4 animate-[fadeInUp_0.8s_ease-out_0.6s_forwards]">
                <RegisterLink 
                  className="group relative overflow-hidden rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-8 py-4 text-[15px] font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:bg-gradient-to-l"
                >
                  <span className="relative z-10">Commencer maintenant</span>
                  <div className="absolute inset-0 z-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                </RegisterLink>
                <a 
                  href="#features" 
                  className="group text-[15px] font-semibold text-gray-900 hover:text-blue-600 transition-all duration-300 flex items-center gap-2 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-blue-600 after:transition-transform hover:after:scale-x-100"
                >
                  Découvrir les fonctionnalités
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-2" />
                </a>
              </div>

              {/* Avantages avec effet de carte premium */}
              <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto opacity-0 translate-y-4 animate-[fadeInUp_0.8s_ease-out_0.8s_forwards]">
                {benefits.map((benefit) => (
                  <div key={benefit} className="group flex items-center gap-3 bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-gray-100/50 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
                    <span className="text-gray-700 text-sm group-hover:text-gray-900 transition-colors duration-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats Section avec animation fluide */}
            <div className="mt-24 grid grid-cols-2 gap-8 md:grid-cols-4 opacity-0 translate-y-4 animate-[fadeInUp_0.8s_ease-out_1s_forwards]">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="group bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-100/50 p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:bg-gradient-to-br hover:from-blue-50/50 hover:to-indigo-50/50"
                >
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300 group-hover:bg-gradient-to-l">
                    {stat.value}
                  </div>
                  <div className="mt-2 text-sm font-medium text-gray-900">{stat.label}</div>
                  <div className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors duration-300">{stat.description}</div>
                </div>
              ))}
            </div>

            {/* Features Grid avec design premium */}
            <div id="features" className="mt-32 mb-16 scroll-mt-20">
              <h2 className="text-4xl font-bold text-center mb-4 opacity-0 translate-y-4 animate-[fadeInUp_0.8s_ease-out_1.2s_forwards] bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent hover:bg-gradient-to-l transition-all duration-500">
                Fonctionnalités principales
              </h2>
              <p className="text-gray-600 text-center mb-16 max-w-2xl mx-auto opacity-0 translate-y-4 animate-[fadeInUp_0.8s_ease-out_1.4s_forwards] [text-wrap:balance]">
                Découvrez comment EduTrack ENSA modernise la gestion des présences avec des outils 
                innovants conçus spécifiquement pour l'ENSA Tétouan.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {features.map((feature, index) => (
                  <div
                    key={feature.title}
                    className="group relative bg-white/60 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl border border-gray-100/50 hover:-translate-y-1 transition-all duration-300 opacity-0 translate-y-4 animate-[fadeInUp_0.8s_ease-out_forwards]"
                    style={{ animationDelay: `${1.6 + index * 0.1}s` }}
                  >
                    <div className={`inline-flex rounded-xl ${feature.color} p-3 transition-transform duration-300 group-hover:scale-110`}>
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-4 text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-gray-600 group-hover:text-gray-900 transition-colors duration-300">
                      {feature.description}
                    </p>
                    <div className="absolute inset-0 rounded-2xl transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-blue-50/50 group-hover:via-indigo-50/50 group-hover:to-purple-50/50"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>

        {/* Footer avec design premium */}
        <footer className="bg-white/70 backdrop-blur-lg border-t border-gray-100/50 mt-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-indigo-50/50 to-purple-50/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 relative">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3 group">
                <Logo />
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent transition-all duration-300 group-hover:bg-gradient-to-l">
                  EduTrack ENSA
                </span>
              </div>
              <p className="text-sm text-gray-500 text-center md:text-right transition-colors duration-300 hover:text-gray-700">
                © {new Date().getFullYear()} ENSA Tétouan. Tous droits réservés.
                <br />
                <span className="text-xs">École Nationale des Sciences Appliquées de Tétouan</span>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
