export type DepartmentCode = '2AP' | 'BDAI' | 'GC' | 'GI' | 'GSTR' | 'GM' | 'SCM' | 'GSCE';

export const DEPARTMENTS = [
  { id: 1, code: '2AP', name: 'Classes Préparatoires' },
  { id: 2, code: 'BDAI', name: 'Big Data et Intelligence Artificielle' },
  { id: 3, code: 'GC', name: 'Génie Civil' },
  { id: 4, code: 'GI', name: 'Génie Informatique' },
  { id: 5, code: 'GSTR', name: 'Génie des Systèmes Télécommunication et Réseaux' },
  { id: 6, code: 'GM', name: 'Génie Mécanique' },
  { id: 7, code: 'SCM', name: 'Supply Chain Management' },
  { id: 8, code: 'GSCE', name: 'Génie Cybersécurité et Systèmes Embarqués' }
];

export const LEVELS_BY_DEPARTMENT: Record<DepartmentCode, Array<{ id: number; code: string; name: string }>> = {
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
  'GSTR': [
    { id: 12, code: 'GSTR1', name: 'Première Année GSTR' },
    { id: 13, code: 'GSTR2', name: 'Deuxième Année GSTR' },
    { id: 14, code: 'GSTR3', name: 'Troisième Année GSTR' }
  ],
  'GM': [
    { id: 15, code: 'GM1', name: 'Première Année GM' },
    { id: 16, code: 'GM2', name: 'Deuxième Année GM' },
    { id: 17, code: 'GM3', name: 'Troisième Année GM' }
  ],
  'SCM': [
    { id: 18, code: 'SCM1', name: 'Première Année SCM' },
    { id: 19, code: 'SCM2', name: 'Deuxième Année SCM' },
    { id: 20, code: 'SCM3', name: 'Troisième Année SCM' }
  ],
  'GSCE': [
    { id: 21, code: 'GSCE1', name: 'Première Année GSCE' },
    { id: 22, code: 'GSCE2', name: 'Deuxième Année GSCE' },
    { id: 23, code: 'GSCE3', name: 'Troisième Année GSCE' }
  ]
}; 