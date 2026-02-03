export interface Equipment {
  id: string;
  equipmentName: string;
  type: string;
  flowrate: number;
  pressure: number;
  temperature: number;
}

export interface DatasetSummary {
  id: string;
  uploadedAt: Date;
  fileName: string;
  totalCount: number;
  avgFlowrate: number;
  avgPressure: number;
  avgTemperature: number;
  typeDistribution: Record<string, number>;
  data: Equipment[];
}

export interface AnalyticsSummary {
  totalEquipment: number;
  avgFlowrate: number;
  avgPressure: number;
  avgTemperature: number;
  minFlowrate: number;
  maxFlowrate: number;
  minPressure: number;
  maxPressure: number;
  minTemperature: number;
  maxTemperature: number;
  typeDistribution: Record<string, number>;
}

export type Language = 'en' | 'es' | 'fr' | 'de' | 'zh' | 'ja' | 'hi' | 'ar';

export interface Translations {
  [key: string]: {
    [lang in Language]: string;
  };
}
