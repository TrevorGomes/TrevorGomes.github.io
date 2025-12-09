export interface CoachRecord {
  coach: string;
  college: string;
  title: string;
  team_id: string;
  start_year: string;
  end_year: string;
  position_title_standardized: string;
  college_clean: string;
  category: string;
  team_state: string;
  conference: string;
  division: string;
  gender: string;
}

export interface StatItem {
  label: string;
  value: number;
}

export interface AnalyticsData {
  commonPaths: StatItem[];
  commonPositionChanges: StatItem[];
  headCoachProducers: StatItem[];
}
