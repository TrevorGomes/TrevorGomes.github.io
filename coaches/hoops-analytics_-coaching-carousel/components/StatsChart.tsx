import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { StatItem } from '../types';

interface StatsChartProps {
  data: StatItem[];
  color: string;
  layout?: 'vertical' | 'horizontal';
}

export const StatsChart: React.FC<StatsChartProps> = ({ data, color, layout = 'vertical' }) => {
  if (!data || data.length === 0) return <div className="text-slate-400 italic">No data available</div>;

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout={layout}
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis 
            type={layout === 'vertical' ? 'number' : 'category'} 
            hide={layout === 'vertical'}
          />
          <YAxis 
            type={layout === 'vertical' ? 'category' : 'number'} 
            dataKey="label" 
            width={150} 
            tick={{fontSize: 12}}
            interval={0}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            cursor={{fill: 'transparent'}}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
