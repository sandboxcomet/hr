'use client';

import { useEffect, useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ColumnDef } from '@tanstack/react-table';
import { Training } from '@/types';
import { BookOpen, Users, Calendar, DollarSign, Plus } from 'lucide-react';

const columns: ColumnDef<Training>[] = [
  {
    accessorKey: 'title',
    header: 'Training Title',
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.getValue('title')}</div>
        <div className="text-sm text-gray-500">{row.original.category}</div>
      </div>
    ),
  },
  {
    accessorKey: 'instructor',
    header: 'Instructor',
    cell: ({ row }) => (
      <div className="text-sm">{row.getValue('instructor')}</div>
    ),
  },
  {
    accessorKey: 'start_date',
    header: 'Start Date',
    cell: ({ row }) => {
      return new Date(row.getValue('start_date')).toLocaleDateString();
    },
  },
  {
    accessorKey: 'duration_hours',
    header: 'Duration',
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue('duration_hours')}h</div>
    ),
  },
  {
    accessorKey: 'participants',
    header: 'Participants',
    cell: ({ row }) => {
      const participants = row.original.participants;
      return (
        <div className="text-center">
          <div className="font-medium">{participants.length}/{row.original.max_participants}</div>
          <div className="text-xs text-gray-500">enrolled</div>
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const variant = 
        status === 'Completed' ? 'default' :
        status === 'In Progress' ? 'secondary' :
        status === 'Cancelled' ? 'destructive' :
        'outline';
      return (
        <Badge variant={variant}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'location',
    header: 'Location',
    cell: ({ row }) => (
      <div className="text-sm">{row.getValue('location')}</div>
    ),
  },
  {
    accessorKey: 'total_cost',
    header: 'Cost',
    cell: ({ row }) => {
      const cost = row.getValue('total_cost') as number;
      return cost > 0 ? (
        <div className="font-medium">${cost.toLocaleString()}</div>
      ) : (
        <div className="text-gray-500">Free</div>
      );
    },
  },
];

export default function TrainingPage() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        const response = await fetch('/api/trainings');
        if (response.ok) {
          const data = await response.json();
          setTrainings(data);
        } else {
          const { mockData } = await import('@/lib/mock-data');
          setTrainings(mockData.trainings as Training[]);
        }
      } catch (error) {
        console.error('Error fetching trainings:', error);
        try {
          const { mockData } = await import('@/lib/mock-data');
          setTrainings(mockData.trainings as Training[]);
        } catch (mockError) {
          console.error('Error loading mock data:', mockError);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTrainings();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Training & Development</h1>
            <p className="text-gray-600 mt-1">Manage employee training programs and sessions</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading training data...</div>
        </div>
      </div>
    );
  }

  const totalTrainings = trainings.length;
  const activeTrainings = trainings.filter(t => t.status === 'Scheduled' || t.status === 'In Progress').length;
  const totalParticipants = trainings.reduce((sum, t) => sum + t.participants.length, 0);
  const totalCost = trainings.reduce((sum, t) => sum + t.total_cost, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Training & Development</h1>
          <p className="text-gray-600 mt-1">Manage employee training programs and sessions</p>
        </div>
        <Button className="rounded-2xl">
          <Plus className="w-4 h-4 mr-2" />
          Schedule Training
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="rounded-2xl border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Programs</CardTitle>
            <div className="p-2 bg-blue-100 rounded-xl">
              <BookOpen className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{totalTrainings}</div>
            <p className="text-xs text-gray-500 mt-1">Training programs</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Sessions</CardTitle>
            <div className="p-2 bg-green-100 rounded-xl">
              <Calendar className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeTrainings}</div>
            <p className="text-xs text-gray-500 mt-1">Ongoing & scheduled</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Participants</CardTitle>
            <div className="p-2 bg-purple-100 rounded-xl">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{totalParticipants}</div>
            <p className="text-xs text-gray-500 mt-1">Enrolled employees</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Training Budget</CardTitle>
            <div className="p-2 bg-primary/10 rounded-xl">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">${totalCost.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">Total investment</p>
          </CardContent>
        </Card>
      </div>

      <DataTable
        columns={columns}
        data={trainings}
        searchKey="title"
        searchPlaceholder="Search training programs..."
      />
    </div>
  );
}
