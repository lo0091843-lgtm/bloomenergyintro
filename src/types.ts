export type PageId = 
  | 'home' 
  | 'technology' 
  | 'solutions' 
  | 'sustainability' 
  | 'whitepapers' 
  | 'company';

export interface Whitepaper {
  id: string;
  title: string;
  subtitle: string;
  category: 'sofc' | 'soec' | 'datacenter' | 'esg' | 'policy';
  year: number;
  pages: number;
  fileSize: string;
  badge?: string;
  abstract: string;
  keyFindings: string[];
  tableOfContents: string[];
  pdfFilename: string;
}

export interface IndustrySolution {
  id: string;
  name: string;
  englishName: string;
  tagline: string;
  description: string;
  keyBenefits: string[];
  statNumber: string;
  statLabel: string;
  clientExample: string;
  recommendedCapacity: string;
  fuelType: string;
}

export interface ConfiguratorState {
  industry: string;
  powerCapacityMW: number;
  fuelOption: 'natural_gas' | 'blend_20' | 'pure_h2' | 'biogas';
  gridReliability: 'standard' | 'mission_critical' | 'island_mode';
  enableHeatRecovery: boolean;
}
