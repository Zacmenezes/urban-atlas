export interface License {
  id: number;
  processNumber: string;
  licenseNumber: string;
  address: string;
  builder: string;
  areaM2: number | null;
  issueDate: string | null;
  expirationDate: string | null;
  status: 'active' | 'expired' | 'unknown';
}

