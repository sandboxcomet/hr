'use client';

import { useEffect, useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ColumnDef } from '@tanstack/react-table';
import { TimeLog } from '@/types';
import { Clock, AlertCircle, CheckCircle } from 'lucide-react';

const columns: ColumnDef<TimeLog>[] = [
  {
    accessorKey: 'employee_name',
    header: 'Employee',
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue('employee_name')}</div>
    ),
  },
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => {
      return new Date(row.getValue('date')).toLocaleDateString();
    },
  },
  {
    accessorKey: 'check_in',
    header: 'Check In',
    cell: ({ row }) => {
      const checkIn = row.getValue('check_in') as string | null;
      return checkIn ? (
        <span className="font-mono">{checkIn}</span>
      ) : (
        <span className="text-gray-400">-</span>
      );
    },
  },
  {
    accessorKey: 'check_out',
    header: 'Check Out',
    cell: ({ row }) => {
      const checkOut = row.getValue('check_out') as string | null;
      return checkOut ? (
        <span className="font-mono">{checkOut}</span>
      ) : (
        <span className="text-gray-400">-</span>
      );
    },
  },
  {
    accessorKey: 'total_hours',
    header: 'Total Hours',
    cell: ({ row }) => {
      const hours = row.getValue('total_hours') as number;
      return (
        <span className="font-medium">{hours.toFixed(1)}h</span>
      );
    },
  },
  {
    accessorKey: 'overtime_hours',
    header: 'Overtime',
    cell: ({ row }) => {
      const overtime = row.getValue('overtime_hours') as number;
      return overtime > 0 ? (
        <span className="font-medium text-orange-600">+{overtime.toFixed(1)}h</span>
      ) : (
        <span className="text-gray-400">-</span>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const variant = status === 'Present' ? 'default' : 
                     status === 'Late' ? 'destructive' : 'secondary';
      return (
        <Badge variant={variant}>
          {status}
        </Badge>
      );
    },
  },
];

export default function AttendancePage() {
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimeLogs = async () => {
      try {
        const response = await fetch('/api/time-logs');
        if (response.ok) {
          const data = await response.json();
          setTimeLogs(data);
        } else {
          // Fallback to mock data
          const { mockData } = await import('@/lib/mock-data');
          setTimeLogs(mockData.timeLogs as TimeLog[]);
        }
      } catch (error) {
        console.error('Error fetching time logs:', error);
        try {
          const { mockData } = await import('@/lib/mock-data');
          setTimeLogs(mockData.timeLogs as TimeLog[]);
        } catch (mockError) {
          console.error('Error loading mock data:', mockError);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTimeLogs();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Attendance & Time Tracking</h1>
            <p className="text-gray-600 mt-1">Monitor employee attendance and working hours</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading attendance data...</div>
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalEntries = timeLogs.length;
  const presentCount = timeLogs.filter(log => log.status === 'Present').length;
  const lateCount = timeLogs.filter(log => log.status === 'Late').length;
  const absentCount = timeLogs.filter(log => log.status === 'Absent').length;
  const totalOvertimeHours = timeLogs.reduce((sum, log) => sum + log.overtime_hours, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Attendance & Time Tracking</h1>
        <p className="text-gray-600 mt-1">Monitor employee attendance and working hours</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="rounded-2xl border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Entries</CardTitle>
            <div className="p-2 bg-blue-100 rounded-xl">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{totalEntries}</div>
            <p className="text-xs text-gray-500 mt-1">Time log entries</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Present</CardTitle>
            <div className="p-2 bg-green-100 rounded-xl">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{presentCount}</div>
            <p className="text-xs text-gray-500 mt-1">
              {totalEntries > 0 ? Math.round((presentCount / totalEntries) * 100) : 0}% attendance rate
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Late/Absent</CardTitle>
            <div className="p-2 bg-red-100 rounded-xl">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{lateCount + absentCount}</div>
            <p className="text-xs text-gray-500 mt-1">Late: {lateCount}, Absent: {absentCount}</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Overtime Hours</CardTitle>
            <div className="p-2 bg-orange-100 rounded-xl">
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{totalOvertimeHours.toFixed(1)}h</div>
            <p className="text-xs text-gray-500 mt-1">Total overtime this period</p>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={timeLogs}
        searchKey="employee_name"
        searchPlaceholder="Search by employee name..."
      />
    </div>
  );
}
