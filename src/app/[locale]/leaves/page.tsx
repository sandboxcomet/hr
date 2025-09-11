'use client';

import { useEffect, useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { LeaveForm } from '@/components/LeaveForm';
import { ApprovalActions } from '@/components/ApprovalActions';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ColumnDef } from '@tanstack/react-table';
import { Leave, Employee } from '@/types';
import { Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';

const allLeavesColumns: ColumnDef<Leave>[] = [
  {
    accessorKey: 'employee_name',
    header: 'Employee',
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue('employee_name')}</div>
    ),
  },
  {
    accessorKey: 'type',
    header: 'Leave Type',
    cell: ({ row }) => (
      <Badge variant="outline">{row.getValue('type')}</Badge>
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
    accessorKey: 'end_date',
    header: 'End Date',
    cell: ({ row }) => {
      return new Date(row.getValue('end_date')).toLocaleDateString();
    },
  },
  {
    accessorKey: 'days',
    header: 'Days',
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue('days')}</span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const variant = status === 'Approved' ? 'default' : 
                     status === 'Rejected' ? 'destructive' : 'secondary';
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
];

const pendingLeavesColumns = (onApproval: (leaveId: number, status: 'Approved' | 'Rejected', reason?: string) => void): ColumnDef<Leave>[] => [
  ...allLeavesColumns.slice(0, -1), // Remove applied_date column
  {
    accessorKey: 'reason',
    header: 'Reason',
    cell: ({ row }) => (
      <div className="max-w-xs truncate" title={row.getValue('reason')}>
        {row.getValue('reason')}
      </div>
    ),
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const leave = row.original;
      return leave.status === 'Pending' ? (
        <ApprovalActions
          leaveId={leave.id}
          employeeName={leave.employee_name}
          onApproval={onApproval}
        />
      ) : (
        <Badge variant="outline">
          {leave.status}
        </Badge>
      );
    },
  },
];

export default function LeavesPage() {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch leaves
        let leavesData: Leave[] = [];
        try {
          const leavesResponse = await fetch('/api/leaves');
          if (leavesResponse.ok) {
            leavesData = await leavesResponse.json();
          } else {
            const mockLeaves = await import('/mock/leaves.json');
            leavesData = mockLeaves.default;
          }
        } catch {
          const mockLeaves = await import('/mock/leaves.json');
          leavesData = mockLeaves.default;
        }

        // Fetch employees
        let employeesData: Employee[] = [];
        try {
          const employeesResponse = await fetch('/api/employees');
          if (employeesResponse.ok) {
            employeesData = await employeesResponse.json();
          } else {
            const mockEmployees = await import('/mock/employees.json');
            employeesData = mockEmployees.default;
          }
        } catch {
          const mockEmployees = await import('/mock/employees.json');
          employeesData = mockEmployees.default;
        }

        setLeaves(leavesData);
        setEmployees(employeesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLeaveSubmit = (data: any) => {
    const employee = employees.find(emp => emp.id === parseInt(data.employee_id));
    const startDate = new Date(data.start_date);
    const endDate = new Date(data.end_date);
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const newLeave: Leave = {
      id: Math.max(...leaves.map(l => l.id)) + 1,
      employee_id: parseInt(data.employee_id),
      employee_name: employee?.name || 'Unknown',
      type: data.type,
      start_date: data.start_date,
      end_date: data.end_date,
      days,
      reason: data.reason,
      status: 'Pending',
      applied_date: new Date().toISOString().split('T')[0],
      approved_by: null,
      approved_date: null,
    };

    setLeaves(prev => [newLeave, ...prev]);
  };

  const handleApproval = (leaveId: number, status: 'Approved' | 'Rejected', reason?: string) => {
    setLeaves(prev => prev.map(leave => 
      leave.id === leaveId 
        ? { 
            ...leave, 
            status, 
            approved_date: new Date().toISOString().split('T')[0],
            approved_by: 1, // Mock current user ID
            rejection_reason: reason 
          }
        : leave
    ));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Leave Management</h1>
            <p className="text-gray-600 mt-1">Manage employee leave requests and approvals</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading leave data...</div>
        </div>
      </div>
    );
  }

  const pendingLeaves = leaves.filter(leave => leave.status === 'Pending');
  const approvedLeaves = leaves.filter(leave => leave.status === 'Approved');
  const rejectedLeaves = leaves.filter(leave => leave.status === 'Rejected');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leave Management</h1>
          <p className="text-gray-600 mt-1">Manage employee leave requests and approvals</p>
        </div>
        <LeaveForm 
          employees={employees.map(emp => ({ id: emp.id, name: emp.name }))}
          onSubmit={handleLeaveSubmit}
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="rounded-2xl border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Requests</CardTitle>
            <div className="p-2 bg-blue-100 rounded-xl">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{leaves.length}</div>
            <p className="text-xs text-gray-500 mt-1">All time leave requests</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
            <div className="p-2 bg-orange-100 rounded-xl">
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingLeaves.length}</div>
            <p className="text-xs text-gray-500 mt-1">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Approved</CardTitle>
            <div className="p-2 bg-green-100 rounded-xl">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{approvedLeaves.length}</div>
            <p className="text-xs text-gray-500 mt-1">Approved requests</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Rejected</CardTitle>
            <div className="p-2 bg-red-100 rounded-xl">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{rejectedLeaves.length}</div>
            <p className="text-xs text-gray-500 mt-1">Rejected requests</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pending">Pending Approvals</TabsTrigger>
          <TabsTrigger value="all">All Leaves</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <DataTable
            columns={pendingLeavesColumns(handleApproval)}
            data={pendingLeaves}
            searchKey="employee_name"
            searchPlaceholder="Search by employee name..."
          />
        </TabsContent>

        <TabsContent value="all">
          <DataTable
            columns={allLeavesColumns}
            data={leaves}
            searchKey="employee_name"
            searchPlaceholder="Search by employee name..."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
