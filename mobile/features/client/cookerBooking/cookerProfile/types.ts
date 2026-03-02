export type CookerProfile = {
  id: string;
  firstName: string;
  lastName: string;
  photoUrl: string | null;
  description: string | null;
  speciality: string;
  hourlyRate: number | null;
};

export type CookerProfileState =
  | { status: "loading" }
  | { status: "not_found" }
  | { status: "error" }
  | { status: "success"; cook: CookerProfile };
