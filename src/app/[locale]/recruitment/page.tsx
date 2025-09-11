'use client';

import { useEffect, useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ColumnDef } from '@tanstack/react-table';
import { Candidate } from '@/types';
import { UserPlus, Users, Clock, CheckCircle, Eye } from 'lucide-react';

const columns: ColumnDef<Candidate>[] = [
  {
    accessorKey: 'name',
    header: 'Candidate Name',
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.getValue('name')}</div>
        <div className="text-sm text-gray-500">{row.original.email}</div>
      </div>
    ),
  },
  {
    accessorKey: 'position_applied',
    header: 'Position',
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.getValue('position_applied')}</div>
        <div className="text-sm text-gray-500">{row.original.department}</div>
      </div>
    ),
  },
  {
    accessorKey: 'experience_years',
    header: 'Experience',
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue('experience_years')} years</div>
    ),
  },
  {
    accessorKey: 'expected_salary',
    header: 'Expected Salary',
    cell: ({ row }) => {
      const salary = row.getValue('expected_salary') as number;
      return <div className="font-medium">${salary.toLocaleString()}</div>;
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const variant = 
        status === 'Hired' ? 'default' :
        status === 'Rejected' ? 'destructive' :
        status === 'Interview Scheduled' || status === 'Final Interview' ? 'secondary' :
        'outline';
      return (
        <Badge variant={variant}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'applied_date',
    header: 'Applied Date',
    cell: ({ row }) => {
      return new Date(row.getValue('applied_date')).toLocaleDateString();
    },
  },
  {
    accessorKey: 'skills',
    header: 'Skills',
    cell: ({ row }) => {
      const skills = row.original.skills.slice(0, 2);
      const remaining = row.original.skills.length - 2;
      return (
        <div className="flex flex-wrap gap-1">
          {skills.map((skill, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {skill}
            </Badge>
          ))}
          {remaining > 0 && (
            <Badge variant="outline" className="text-xs">
              +{remaining} more
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: () => {
      return (
        <Button variant="outline" size="sm" className="rounded-xl">
          <Eye className="w-4 h-4 mr-1" />
          View Details
        </Button>
      );
    },
  },
];

export default function RecruitmentPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await fetch('/api/candidates');
        if (response.ok) {
          const data = await response.json();
          setCandidates(data);
        } else {
          const { mockData } = await import('@/lib/mock-data');
          setCandidates(mockData.candidates as Candidate[]);
        }
      } catch (error) {
        console.error('Error fetching candidates:', error);
        try {
          const { mockData } = await import('@/lib/mock-data');
          setCandidates(mockData.candidates as Candidate[]);
        } catch (mockError) {
          console.error('Error loading mock data:', mockError);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Recruitment</h1>
            <p className="text-gray-600 mt-1">Manage job applications and candidate pipeline</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading candidates...</div>
        </div>
      </div>
    );
  }

  const totalCandidates = candidates.length;
  const screeningCount = candidates.filter(c => c.status === 'Screening').length;
  const interviewCount = candidates.filter(c => c.status.includes('Interview')).length;
  const hiredCount = candidates.filter(c => c.status === 'Hired').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Recruitment</h1>
          <p className="text-gray-600 mt-1">Manage job applications and candidate pipeline</p>
        </div>
        <Button className="rounded-2xl">
          <UserPlus className="w-4 h-4 mr-2" />
          Post New Job
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="rounded-2xl border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Candidates</CardTitle>
            <div className="p-2 bg-blue-100 rounded-xl">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{totalCandidates}</div>
            <p className="text-xs text-gray-500 mt-1">All applications</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Screening</CardTitle>
            <div className="p-2 bg-orange-100 rounded-xl">
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{screeningCount}</div>
            <p className="text-xs text-gray-500 mt-1">Under review</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Interviews</CardTitle>
            <div className="p-2 bg-purple-100 rounded-xl">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{interviewCount}</div>
            <p className="text-xs text-gray-500 mt-1">In interview process</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Hired</CardTitle>
            <div className="p-2 bg-green-100 rounded-xl">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{hiredCount}</div>
            <p className="text-xs text-gray-500 mt-1">Successfully hired</p>
          </CardContent>
        </Card>
      </div>

      <DataTable
        columns={columns}
        data={candidates}
        searchKey="name"
        searchPlaceholder="Search candidates..."
      />
    </div>
  );
}
