import React, { useState, useEffect, useMemo } from 'react';
import { getParsedData, calculateAnalytics } from './services/csvService';
import { CoachRecord, AnalyticsData } from './types';
import { Card } from './components/ui/Card';
import { StatsChart } from './components/StatsChart';
import { CoachList } from './components/CoachList';

const App: React.FC = () => {
  const [rawData, setRawData] = useState<CoachRecord[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  
  // Filter States
  const [selectedTeam, setSelectedTeam] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Initial Data Load
  useEffect(() => {
    const data = getParsedData();
    setRawData(data);
    setAnalytics(calculateAnalytics(data));
  }, []);

  // Derived Data: Unique Teams for Dropdown
  const uniqueTeams = useMemo(() => {
    const teams = new Set(rawData.map(r => r.college_clean));
    return Array.from(teams).sort();
  }, [rawData]);

  // Derived Data: Filtered List
  const filteredData = useMemo(() => {
    return rawData.filter(record => {
      const matchesTeam = selectedTeam === 'All' || record.college_clean === selectedTeam;
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        record.coach.toLowerCase().includes(searchLower) || 
        record.college_clean.toLowerCase().includes(searchLower);
      
      return matchesTeam && matchesSearch;
    });
  }, [rawData, selectedTeam, searchQuery]);

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="bg-brand-900 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Hoops Analytics</h1>
            <p className="text-brand-100 text-sm">Coaching Carousel & Career Insights</p>
          </div>
          
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Team Dropdown */}
            <div className="relative">
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="w-full sm:w-48 bg-brand-700 text-white border border-brand-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-500 focus:outline-none appearance-none cursor-pointer hover:bg-brand-600 transition-colors text-sm"
              >
                <option value="All">All Teams</option>
                {uniqueTeams.map(team => (
                  <option key={team} value={team}>{team}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-brand-100">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search coach or team..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 bg-white text-slate-900 rounded-lg px-4 py-2 pl-10 focus:ring-2 focus:ring-brand-500 focus:outline-none shadow-sm text-sm"
              />
              <div className="absolute inset-y-0 left-0 flex items-center px-3 pointer-events-none">
                 <svg className="h-4 w-4 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                 </svg>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        
        {/* Analytics Section */}
        {analytics && (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card title="1. Common Position Changes">
               <StatsChart data={analytics.commonPositionChanges} color="#8884d8" />
               <p className="mt-4 text-xs text-slate-500 text-center">Most frequent career moves by title.</p>
            </Card>

            <Card title="2. Common Team Paths">
               <StatsChart data={analytics.commonPaths} color="#82ca9d" />
               <p className="mt-4 text-xs text-slate-500 text-center">Most frequent moves between specific colleges.</p>
            </Card>

            <Card title="3. Top Head Coach Producers">
               <StatsChart data={analytics.headCoachProducers} color="#ffc658" />
               <p className="mt-4 text-xs text-slate-500 text-center">Schools where coaches worked immediately before their first Head Coach role.</p>
            </Card>
          </section>
        )}

        {/* Data List Section */}
        <Card title={`Coaching Roster (${filteredData.length} records)`} className="overflow-hidden">
          <CoachList data={filteredData} />
        </Card>

      </main>
    </div>
  );
};

export default App;