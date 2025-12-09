import React from 'react';
import { CoachRecord } from '../types';

interface CoachListProps {
  data: CoachRecord[];
}

export const CoachList: React.FC<CoachListProps> = ({ data }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-slate-600">
        <thead className="text-xs text-slate-700 uppercase bg-slate-100 border-b border-slate-200">
          <tr>
            <th className="px-6 py-3 font-semibold">Coach</th>
            <th className="px-6 py-3 font-semibold">Team</th>
            <th className="px-6 py-3 font-semibold">Title</th>
            <th className="px-6 py-3 font-semibold">Role</th>
            <th className="px-6 py-3 font-semibold">Start</th>
            <th className="px-6 py-3 font-semibold">End</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, idx) => (
              <tr 
                key={`${row.coach}-${row.team_id}-${idx}`} 
                className="bg-white border-b border-slate-100 hover:bg-slate-50 transition-colors"
              >
                <td className="px-6 py-4 font-medium text-slate-900">{row.coach}</td>
                <td className="px-6 py-4">{row.college_clean}</td>
                <td className="px-6 py-4 truncate max-w-xs" title={row.title}>{row.title}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold
                    ${row.position_title_standardized === 'Head Coach' ? 'bg-indigo-100 text-indigo-700' : 
                      row.position_title_standardized === 'Associate Head Coach' ? 'bg-purple-100 text-purple-700' :
                      row.position_title_standardized === 'Assistant Coach' ? 'bg-blue-100 text-blue-700' :
                      'bg-slate-100 text-slate-600'}`}>
                    {row.position_title_standardized}
                  </span>
                </td>
                <td className="px-6 py-4">{row.start_year}</td>
                <td className="px-6 py-4">{row.end_year}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                No records found matching your criteria.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
