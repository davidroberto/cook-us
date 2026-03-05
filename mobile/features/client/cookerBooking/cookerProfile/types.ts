export type CookerProfileImage = {
  id: number;
  url: string;
  description: string | null;
};

export type CookerProfileReview = {
  id: number;
  rating: number;
  comment: string | null;
  createdAt: string;
  clientFirstName: string;
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
  reviews: CookerProfileReview[];
  averageRating: number | null;
};

export type CookerProfileState =
  | { status: "loading" }
  | { status: "not_found" }
  | { status: "error" }
  | { status: "success"; cook: CookerProfile };
