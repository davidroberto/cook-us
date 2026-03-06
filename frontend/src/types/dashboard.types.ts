export type DashboardEvolutionPoint = {
  date: string;
  count: number;
};

export type DashboardRevenuePoint = {
  date: string;
  amount: number;
};

export type DashboardStats = {
  period: number;
  users: {
    total: number;
    byRole: { clients: number; cooks: number; admins: number };
    newInPeriod: number;
    evolution: DashboardEvolutionPoint[];
  };
  bookings: {
    total: number;
    inPeriod: number;
    byStatus: Record<string, number>;
    byMealType: Record<string, number>;
    evolution: DashboardEvolutionPoint[];
  };
  revenue: {
    totalEstimated: number;
    inPeriodEstimated: number;
    commissionRate: number;
    evolution: DashboardRevenuePoint[];
  };
  cooks: {
    bySpeciality: Record<string, number>;
    byValidationStatus: Record<string, number>;
  };
};
