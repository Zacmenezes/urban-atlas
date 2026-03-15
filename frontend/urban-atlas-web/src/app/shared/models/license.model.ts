export interface License {
  id: number;
  licenseNumber: string;
  projectName: string;
  district: string;
  status: 'pending' | 'approved' | 'rejected';
  issuedAt: string;
  latitude: number;
  longitude: number;
}

