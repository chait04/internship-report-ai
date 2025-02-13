export interface User {
  $id: string;
  name: string;
  email: string;
}

export interface UserProfile {
  $id?: string;
  userId: string;
  fullName: string;
  prnNumber: string;
  department: string;
  studentMentor: string;
  internshipRole: string;
  additionalRole?: string;
}