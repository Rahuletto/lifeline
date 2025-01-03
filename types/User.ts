import { Contact } from "@/types/Contact";
import { Medications } from "@/types/Medications";

export interface UserData {
    id?: string;
    name?: string;
    email?: string;
    dateOfBirth?: string;
    bloodGroup?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
    height?: number; // in cm
    weight?: number; // in kg
    emergency?: Contact[];
    allergies?: string[];
    medications?: Medications[];
    chronicConditions?: string[];
    lastCheckup?: string;
  }