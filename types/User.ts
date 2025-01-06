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
    allergies?: string[];    
    medications?: Medications[];
    emergencyContact?: Contact[];
    chronicConditions?: string[];
    lastCheckup?: string;
  }
  export interface ResponseUser {
    user: UserData;
  }