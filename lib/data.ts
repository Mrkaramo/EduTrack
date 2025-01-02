import { Department } from './types';

export const departments: Department[] = [
  { code: '2AP', name: 'Classes Préparatoires' },
  { code: 'GI', name: 'Génie Informatique' },
  { code: 'GC', name: 'Génie Civil' },
  { code: 'BDAI', name: 'Big Data & Intelligence Artificielle' },
  { code: 'GM', name: 'Génie Mécanique' },
  { code: 'GSTR', name: 'Génie des Systèmes de Télécommunications et Réseaux' },
  { code: 'SCM', name: 'Supply Chain Management' },
];

export const levels: { [key: string]: string[] } = {
  '2AP': ['2AP1', '2AP2'],
  'GI': ['GI1', 'GI2', 'GI3'],
  'GC': ['GC1', 'GC2', 'GC3'],
  'BDAI': ['BDAI1', 'BDAI2', 'BDAI3'],
  'GM': ['GM1', 'GM2', 'GM3'],
  'GSTR': ['GSTR1', 'GSTR2', 'GSTR3'],
  'SCM': ['SCM1', 'SCM2', 'SCM3'],
}; 