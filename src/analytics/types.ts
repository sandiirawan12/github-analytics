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

export interface TopRepository {
  name: string;
  nameWithOwner: string;
  isPrivate: boolean;
  stars: number;
  forks: number;
  language: string | null;
  languageColor: string | null;
}

export interface AnalyticsResult {
  username: string;
  generatedAt: string;
  followers: number;
  following: number;
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
  activeDays: number;
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
  topRepositories: TopRepository[];
  productive: {
    mostActiveWeekday: string;
    mostActiveHour: number | null;
  };
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
}
