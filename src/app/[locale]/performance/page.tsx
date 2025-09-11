'use client';

import { useEffect, useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ColumnDef } from '@tanstack/react-table';
import { Performance } from '@/types';
import { Star, TrendingUp, Users, Target } from 'lucide-react';

const columns: ColumnDef<Performance>[] = [
  {
    accessorKey: 'employee_name',
    header: 'Employee',
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue('employee_name')}</div>
    ),
  },
  {
    accessorKey: 'review_period',
    header: 'Period',
    cell: ({ row }) => (
      <Badge variant="outline">{row.getValue('review_period')}</Badge>
    ),
  },
  {
    accessorKey: 'overall_rating',
    header: 'Overall Rating',
    cell: ({ row }) => {
      const rating = row.getValue('overall_rating') as number;
      return (
        <div className="flex items-center space-x-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="font-medium">{rating}/5</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'technical_skills',
    header: 'Technical',
    cell: ({ row }) => {
      const score = row.getValue('technical_skills') as number;
      return (
        <div className="flex items-center space-x-2">
          <Progress value={score * 20} className="w-16" />
          <span className="text-sm font-medium">{score}/5</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'communication',
    header: 'Communication',
    cell: ({ row }) => {
      const score = row.getValue('communication') as number;
      return (
        <div className="flex items-center space-x-2">
          <Progress value={score * 20} className="w-16" />
          <span className="text-sm font-medium">{score}/5</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'goals',
    header: 'Goals Completed',
    cell: ({ row }) => {
      const goals = row.original.goals;
      const completed = goals.filter(g => g.status === 'Completed').length;
      return (
        <div className="text-center">
          <div className="font-medium">{completed}/{goals.length}</div>
          <Progress value={(completed / goals.length) * 100} className="w-16 mt-1" />
        </div>
      );
    },
  },
];

export default function PerformancePage() {
  const [performances, setPerformances] = useState<Performance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerformances = async () => {
      try {
        const response = await fetch('/api/performance');
        if (response.ok) {
          const data = await response.json();
          setPerformances(data);
        } else {
          const mockData = await import('/mock/performance.json');
          setPerformances(mockData.default);
        }
      } catch (error) {
        console.error('Error fetching performance:', error);
        try {
          const mockData = await import('/mock/performance.json');
          setPerformances(mockData.default);
        } catch (mockError) {
          console.error('Error loading mock data:', mockError);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPerformances();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Performance Management</h1>
          <p className="text-gray-600 mt-1">Track and manage employee performance reviews</p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading performance data...</div>
        </div>
      </div>
    );
  }

  const avgRating = performances.reduce((sum, p) => sum + p.overall_rating, 0) / performances.length;
  const totalGoals = performances.reduce((sum, p) => sum + p.goals.length, 0);
  const completedGoals = performances.reduce((sum, p) => sum + p.goals.filter(g => g.status === 'Completed').length, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Performance Management</h1>
        <p className="text-gray-600 mt-1">Track and manage employee performance reviews</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="rounded-2xl border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Reviews Completed</CardTitle>
            <div className="p-2 bg-blue-100 rounded-xl">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{performances.length}</div>
            <p className="text-xs text-gray-500 mt-1">Performance reviews</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Average Rating</CardTitle>
            <div className="p-2 bg-yellow-100 rounded-xl">
              <Star className="h-5 w-5 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{avgRating.toFixed(1)}/5</div>
            <p className="text-xs text-gray-500 mt-1">Overall performance</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Goals Completed</CardTitle>
            <div className="p-2 bg-green-100 rounded-xl">
              <Target className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedGoals}/{totalGoals}</div>
            <p className="text-xs text-gray-500 mt-1">{Math.round((completedGoals/totalGoals)*100)}% completion rate</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Top Performers</CardTitle>
            <div className="p-2 bg-primary/10 rounded-xl">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {performances.filter(p => p.overall_rating >= 4.5).length}
            </div>
            <p className="text-xs text-gray-500 mt-1">Rating ≥ 4.5</p>
          </CardContent>
        </Card>
      </div>

      <DataTable
        columns={columns}
        data={performances}
        searchKey="employee_name"
        searchPlaceholder="Search by employee name..."
      />
    </div>
  );
}
