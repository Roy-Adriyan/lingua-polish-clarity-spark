
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatsCard = ({ title, value, icon, description, trend }: StatsCardProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            
            {trend && (
              <div className="flex items-center mt-1">
                <span className={`text-xs font-medium ${trend.isPositive ? 'text-success' : 'text-error'}`}>
                  {trend.isPositive ? '+' : ''}{trend.value}%
                </span>
                <span className="text-xs text-gray-500 ml-1">vs. last week</span>
              </div>
            )}
            
            {description && (
              <p className="text-xs text-gray-500 mt-1">{description}</p>
            )}
          </div>
          
          <div className="p-2 bg-linguapolish-light rounded-lg">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
