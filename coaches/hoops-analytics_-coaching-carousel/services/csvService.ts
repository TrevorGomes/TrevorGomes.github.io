import { CoachRecord, AnalyticsData, StatItem } from '../types';
import { CSV_DATA } from '../constants';

// Basic CSV Parser that handles quoted fields (like "Director of Player Personnel, Development and Influence")
const parseCSV = (text: string): CoachRecord[] => {
  const lines = text.trim().split('\n');
  const headers = lines[0].split(',');

  const result: CoachRecord[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const row: string[] = [];
    let currentField = '';
    let inQuotes = false;

    for (let charIndex = 0; charIndex < line.length; charIndex++) {
      const char = line[charIndex];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        row.push(currentField);
        currentField = '';
      } else {
        currentField += char;
      }
    }
    row.push(currentField); // Add last field

    if (row.length === headers.length) {
      const record: any = {};
      headers.forEach((header, index) => {
        record[header.trim()] = row[index].trim();
      });
      result.push(record as CoachRecord);
    }
  }
  return result;
};

export const getParsedData = (): CoachRecord[] => {
  return parseCSV(CSV_DATA);
};

export const calculateAnalytics = (data: CoachRecord[]): AnalyticsData => {
  // Group by Coach
  const coaches: { [key: string]: CoachRecord[] } = {};
  
  data.forEach(record => {
    if (!coaches[record.coach]) {
      coaches[record.coach] = [];
    }
    coaches[record.coach].push(record);
  });

  // Analytics Containers
  const pathCounts: { [key: string]: number } = {};
  const positionChangeCounts: { [key: string]: number } = {};
  const producerCounts: { [key: string]: number } = {};
  const processedHeadCoaches = new Set<string>();

  Object.values(coaches).forEach(history => {
    // Sort history by year (descending or ascending? Ascending for path logic)
    // Handle "NA" -> Current. We'll treat NA as 9999 for sorting purposes if it's end_year
    history.sort((a, b) => {
      const startA = parseInt(a.start_year) || 0;
      const startB = parseInt(b.start_year) || 0;
      return startA - startB;
    });

    // 1. Position Order & 2. Team Paths
    for (let i = 0; i < history.length - 1; i++) {
      const current = history[i];
      const next = history[i+1];

      // Position Order
      if (current.position_title_standardized !== next.position_title_standardized) {
        const transition = `${current.position_title_standardized} → ${next.position_title_standardized}`;
        positionChangeCounts[transition] = (positionChangeCounts[transition] || 0) + 1;
      }

      // Team Path
      if (current.college_clean !== next.college_clean) {
        const path = `${current.college_clean} → ${next.college_clean}`;
        pathCounts[path] = (pathCounts[path] || 0) + 1;
      }
    }

    // 3. Head Coach Producers
    // Find if this coach ever became a head coach
    const headCoachIndex = history.findIndex(h => h.position_title_standardized === 'Head Coach');
    if (headCoachIndex > 0) {
       // Check the job immediately before the FIRST Head Coach gig
       // We use a Set to ensure we only count a specific coach becoming a HC once per "Producer" logic,
       // or we count every time they get hired as HC? "Schools that have produced the most head coaches"
       // usually implies unique individuals.
       const coachName = history[0].coach;
       if (!processedHeadCoaches.has(coachName)) {
         const preHcJob = history[headCoachIndex - 1];
         // Only count if the previous job was NOT a Head Coach job (promoted from within or hired from outside)
         if (preHcJob.position_title_standardized !== 'Head Coach') {
             producerCounts[preHcJob.college_clean] = (producerCounts[preHcJob.college_clean] || 0) + 1;
             processedHeadCoaches.add(coachName);
         }
       }
    }
  });

  // Helper to sort and slice
  const getTop = (obj: { [key: string]: number }, limit: number = 5): StatItem[] => {
    return Object.entries(obj)
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, limit);
  };

  return {
    commonPaths: getTop(pathCounts, 10),
    commonPositionChanges: getTop(positionChangeCounts, 10),
    headCoachProducers: getTop(producerCounts, 10),
  };
};
