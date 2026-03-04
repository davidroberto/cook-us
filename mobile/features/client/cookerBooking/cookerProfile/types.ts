export type CookerProfileImage = {
  id: number;
  url: string;
  description: string | null;
};

export type CookerProfile = {
  id: string;
  userId: number;
  firstName: string;
  lastName: string;
  photoUrl: string | null;
  description: string | null;
  speciality: string;
  hourlyRate: number | null;
  images: CookerProfileImage[];
};

export type CookerProfileState =
  | { status: "loading" }
  | { status: "not_found" }
  | { status: "error" }
  | { status: "success"; cook: CookerProfile };
