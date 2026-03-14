import { NB_NEIGHBORHOODS } from "./benefits";

export interface NeighborhoodData {
  name: string;
  population: number;
  estimatedEligible: number;
  enrolled: number;
  gap: number;
  gapDollars: number;
  primaryLanguage: string;
  topUnclaimedProgram: string;
}

export const NEIGHBORHOOD_DATA: NeighborhoodData[] = [
  { name: "North End", population: 8200, estimatedEligible: 2870, enrolled: 1430, gap: 1440, gapDollars: 864000, primaryLanguage: "Portuguese", topUnclaimedProgram: "SNAP" },
  { name: "South End", population: 7800, estimatedEligible: 2650, enrolled: 1580, gap: 1070, gapDollars: 642000, primaryLanguage: "English", topUnclaimedProgram: "MassHealth" },
  { name: "West End", population: 6500, estimatedEligible: 1950, enrolled: 1170, gap: 780, gapDollars: 468000, primaryLanguage: "Spanish", topUnclaimedProgram: "SNAP" },
  { name: "Acushnet Heights", population: 5400, estimatedEligible: 1620, enrolled: 810, gap: 810, gapDollars: 486000, primaryLanguage: "Cape Verdean Creole", topUnclaimedProgram: "LIHEAP" },
  { name: "Brooklawn", population: 4800, estimatedEligible: 1200, enrolled: 780, gap: 420, gapDollars: 252000, primaryLanguage: "English", topUnclaimedProgram: "WIC" },
  { name: "Buttonwood", population: 4200, estimatedEligible: 1050, enrolled: 630, gap: 420, gapDollars: 252000, primaryLanguage: "Portuguese", topUnclaimedProgram: "SNAP" },
  { name: "Downtown", population: 6800, estimatedEligible: 2720, enrolled: 1630, gap: 1090, gapDollars: 654000, primaryLanguage: "English", topUnclaimedProgram: "Housing" },
  { name: "Clark's Point", population: 3200, estimatedEligible: 640, enrolled: 450, gap: 190, gapDollars: 114000, primaryLanguage: "English", topUnclaimedProgram: "MassHealth" },
  { name: "Near North", population: 5600, estimatedEligible: 1960, enrolled: 980, gap: 980, gapDollars: 588000, primaryLanguage: "Portuguese", topUnclaimedProgram: "SNAP" },
  { name: "Far North", population: 4900, estimatedEligible: 1470, enrolled: 880, gap: 590, gapDollars: 354000, primaryLanguage: "Cape Verdean Creole", topUnclaimedProgram: "LIHEAP" },
  { name: "Cove Street", population: 3800, estimatedEligible: 1520, enrolled: 760, gap: 760, gapDollars: 456000, primaryLanguage: "Spanish", topUnclaimedProgram: "SNAP" },
  { name: "Sassaquin", population: 4100, estimatedEligible: 820, enrolled: 570, gap: 250, gapDollars: 150000, primaryLanguage: "English", topUnclaimedProgram: "Workforce" },
  { name: "Howland Green", population: 3500, estimatedEligible: 1050, enrolled: 520, gap: 530, gapDollars: 318000, primaryLanguage: "Portuguese", topUnclaimedProgram: "SNAP" },
  { name: "Nashawena", population: 3600, estimatedEligible: 720, enrolled: 500, gap: 220, gapDollars: 132000, primaryLanguage: "English", topUnclaimedProgram: "MassHealth" },
  { name: "Fort Taber", population: 2800, estimatedEligible: 420, enrolled: 310, gap: 110, gapDollars: 66000, primaryLanguage: "English", topUnclaimedProgram: "LIHEAP" },
  { name: "Bullard Street", population: 4300, estimatedEligible: 1290, enrolled: 640, gap: 650, gapDollars: 390000, primaryLanguage: "Cape Verdean Creole", topUnclaimedProgram: "SNAP" },
  { name: "Fairhaven Bridge", population: 3100, estimatedEligible: 620, enrolled: 430, gap: 190, gapDollars: 114000, primaryLanguage: "English", topUnclaimedProgram: "MassHealth" },
];

export const PROGRAM_ENROLLMENT_DATA = [
  { program: "SNAP", eligible: 17200, enrolled: 10100, gap: 7100, avgBenefit: 5400, color: "#4f46e5" },
  { program: "MassHealth", eligible: 22000, enrolled: 16500, gap: 5500, avgBenefit: 8000, color: "#0891b2" },
  { program: "LIHEAP", eligible: 14800, enrolled: 8200, gap: 6600, avgBenefit: 1200, color: "#ea580c" },
  { program: "WIC", eligible: 4200, enrolled: 2800, gap: 1400, avgBenefit: 900, color: "#16a34a" },
  { program: "Housing", eligible: 8500, enrolled: 3200, gap: 5300, avgBenefit: 5500, color: "#9333ea" },
  { program: "Workforce", eligible: 6200, enrolled: 1800, gap: 4400, avgBenefit: 10000, color: "#e11d48" },
];

export const LANGUAGE_DATA = [
  { language: "English", percentage: 62, households: 24800, color: "#4f46e5" },
  { language: "Portuguese", percentage: 20, households: 8000, color: "#16a34a" },
  { language: "Spanish", percentage: 11, households: 4400, color: "#ea580c" },
  { language: "Cape Verdean Creole", percentage: 5, households: 2000, color: "#0891b2" },
  { language: "Other", percentage: 2, households: 800, color: "#9ca3af" },
];

export const CHANNEL_EFFECTIVENESS = [
  { channel: "WhatsApp", responseRate: 61, enrollmentRate: 38, costPerEnrollment: 12 },
  { channel: "SMS", responseRate: 34, enrollmentRate: 22, costPerEnrollment: 18 },
  { channel: "Phone Call", responseRate: 28, enrollmentRate: 31, costPerEnrollment: 35 },
  { channel: "Community Kiosk", responseRate: 85, enrollmentRate: 52, costPerEnrollment: 8 },
  { channel: "CHW Home Visit", responseRate: 92, enrollmentRate: 68, costPerEnrollment: 45 },
];

export const MONTHLY_ENROLLMENTS = [
  { month: "Apr", enrollments: 0, value: 0 },
  { month: "May", enrollments: 48, value: 192000 },
  { month: "Jun", enrollments: 127, value: 508000 },
  { month: "Jul", enrollments: 203, value: 812000 },
  { month: "Aug", enrollments: 289, value: 1156000 },
  { month: "Sep", enrollments: 341, value: 1364000 },
  { month: "Oct", enrollments: 412, value: 1648000 },
  { month: "Nov", enrollments: 478, value: 1912000 },
  { month: "Dec", enrollments: 534, value: 2136000 },
  { month: "Jan", enrollments: 601, value: 2404000 },
  { month: "Feb", enrollments: 658, value: 2632000 },
  { month: "Mar", enrollments: 720, value: 2880000 },
];

export const UPCOMING_OUTREACH = [
  { date: "Apr 1", campaign: "SNAP Spring Re-enrollment", target: "3,200 households", channels: "SMS, WhatsApp", language: "PT, ES, EN" },
  { date: "Apr 15", campaign: "HIP Farmers Market Season Opening", target: "SNAP recipients", channels: "SMS", language: "All" },
  { date: "May 1", campaign: "MassHealth Open Enrollment Reminder", target: "5,500 uninsured", channels: "WhatsApp, Phone", language: "PT, CV, ES" },
  { date: "Jun 1", campaign: "Summer Youth Jobs — MassHire", target: "16-24 year olds", channels: "SMS, Kiosk", language: "EN, PT, ES" },
  { date: "Nov 1", campaign: "LIHEAP Heating Assistance Opens", target: "6,600 eligible", channels: "All channels", language: "All" },
];
