export interface ConstructionLicense {
  id: number;
  processNumber: string;
  address: string;
  latitude: number;
  longitude: number;
}

export const MOCK_LICENSES: ConstructionLicense[] = [
  {
    id: 1,
    processNumber: 'FORT-2026-0001',
    address: 'Av. Beira Mar, Centro - Fortaleza',
    latitude: -3.7272,
    longitude: -38.5244
  },
  {
    id: 2,
    processNumber: 'FORT-2026-0012',
    address: 'Rua Coronel Estênio Moreira, Aldeota - Fortaleza',
    latitude: -3.7369,
    longitude: -38.4981
  },
  {
    id: 3,
    processNumber: 'FORT-2026-0025',
    address: 'Av. Washington Soares, Sabiaguaba - Fortaleza',
    latitude: -3.8012,
    longitude: -38.5451
  },
  {
    id: 4,
    processNumber: 'FORT-2026-0037',
    address: 'Rua Prof. Dias da Rocha, Meireles - Fortaleza',
    latitude: -3.7312,
    longitude: -38.4822
  },
  {
    id: 5,
    processNumber: 'FORT-2026-0048',
    address: 'Av. 13 de Maio, Fátima - Fortaleza',
    latitude: -3.7545,
    longitude: -38.5189
  }
];

