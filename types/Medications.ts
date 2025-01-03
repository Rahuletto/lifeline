export interface Medications {
  id?: string;
  name: string;
  dosage: string;
  frequency: Frequency;
  notes: string;
  reminders: number[];
}

export interface Frequency {
  morning: boolean;
  afternoon: boolean;
  evening: boolean;
  night: boolean;
}
