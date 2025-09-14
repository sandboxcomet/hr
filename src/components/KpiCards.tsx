'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  TrendingDown,
  Calendar,
  BookOpen,
  DollarSign,
  UserPlus,
  Star,
  Gift,
  LucideIcon,
} from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  description?: string;
}

function KpiCard({ title, value, change, changeType, icon: Icon, description }: KpiCardProps) {
  return (
    <Card className="rounded-2xl border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <div className="p-2 bg-primary/10 rounded-xl">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
        {change && (
          <div className="flex items-center space-x-2">
            <Badge
              variant={changeType === 'positive' ? 'default' : changeType === 'negative' ? 'destructive' : 'secondary'}
              className="text-xs"
            >
              {change}
            </Badge>
            {description && (
              <span className="text-xs text-gray-500">{description}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface KpiCardsProps {
  kpis?: {
    headcount: number;
    turnover_rate: number;
    pending_leaves: number;
    trainings_this_month: number;
    payroll_processed: number;
    open_positions: number;
    avg_performance_rating: number;
    benefits_cost: number;
  };
  data?: Array<{
    title: string;
    value: string | number;
    description: string;
    icon: LucideIcon;
    trend?: { value: number; label: string };
  }>;
}

export function KpiCards({ kpis, data }: KpiCardsProps) {
  // If data prop is provided (for Asset Management), use it
  if (data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.map((item, index) => (
          <KpiCard 
            key={index} 
            title={item.title}
            value={item.value}
            icon={item.icon}
            description={item.description}
            change={item.trend?.label}
            changeType={item.trend?.value === 0 ? 'neutral' : item.trend?.value && item.trend.value > 0 ? 'positive' : 'negative'}
          />
        ))}
      </div>
    );
  }

  // If kpis prop is provided (for Dashboard), use the original logic
  if (!kpis) return null;

  const cards: KpiCardProps[] = [
    {
      title: 'Total Employees',
      value: kpis.headcount,
      change: '+2.5%',
      changeType: 'positive',
      icon: Users,
      description: 'from last month',
    },
    {
      title: 'Turnover Rate',
      value: `${kpis.turnover_rate}%`,
      change: '-0.8%',
      changeType: 'positive',
      icon: TrendingDown,
      description: 'from last quarter',
    },
    {
      title: 'Pending Leaves',
      value: kpis.pending_leaves,
      change: '+3',
      changeType: 'neutral',
      icon: Calendar,
      description: 'awaiting approval',
    },
    {
      title: 'Active Trainings',
      value: kpis.trainings_this_month,
      change: '+1',
      changeType: 'positive',
      icon: BookOpen,
      description: 'this month',
    },
    {
      title: 'Payroll Processed',
      value: `$${(kpis.payroll_processed / 1000).toFixed(0)}K`,
      change: '+5.2%',
      changeType: 'positive',
      icon: DollarSign,
      description: 'this month',
    },
    {
      title: 'Open Positions',
      value: kpis.open_positions,
      change: '-2',
      changeType: 'positive',
      icon: UserPlus,
      description: 'from last week',
    },
    {
      title: 'Avg Performance',
      value: kpis.avg_performance_rating.toFixed(1),
      change: '+0.2',
      changeType: 'positive',
      icon: Star,
      description: 'rating score',
    },
    {
      title: 'Benefits Cost',
      value: `$${(kpis.benefits_cost / 1000).toFixed(0)}K`,
      change: '+3.1%',
      changeType: 'neutral',
      icon: Gift,
      description: 'monthly total',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <KpiCard key={index} {...card} />
      ))}
    </div>
  );
}
