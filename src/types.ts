export interface Subject {
  id: string;
  name: string;
  code: string;
  credits: number;
}

export interface SemesterConfig {
  semesterNumber: number;
  subjects: Subject[]; // Exactly 6 subjects for each semester
}

export interface BranchConfig {
  id: string;
  name: string;
  semesters: Record<number, Subject[]>; // Map semester number to 6 subjects
}

export interface GradeScale {
  grade: string;
  points: number;
  description: string;
}

export interface CalculationResult {
  sgpa: number;
  totalCredits: number;
  earnedPoints: number;
  overallCgpa: number;
}
