export interface LanguageStat {
  name: string;
  color: string;
  size: number;
  percentage: number;
}

export interface DayContribution {
  date: string;
  count: number;
  color: string;
}

export interface AnalyticsResult {
  username: string;
  generatedAt: string;
  commits: {
    total: number;
    public: number;
    private: number;
  };
  repositories: {
    total: number;
    public: number;
    private: number;
  };
  stars: number;
  forks: number;
  pullRequests: number;
  issues: number;
  streak: {
    current: number;
    longest: number;
  };
  contributions: {
    total: number;
    byMonth: { month: string; count: number }[];
    byWeekday: { day: string; count: number }[];
    byHour: { hour: number; count: number }[];
    calendar: DayContribution[];
  };
  languages: LanguageStat[];
  productive: {
    mostActiveWeekday: string;
    mostActiveHour: number | null;
  };
}
