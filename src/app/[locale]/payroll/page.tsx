'use client';

import { useEffect, useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { PayrollCard } from '@/components/PayrollCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ColumnDef } from '@tanstack/react-table';
import { Payroll } from '@/types';
import { DollarSign, Users, TrendingUp, Eye } from 'lucide-react';
import { toast } from 'sonner';

const columns: ColumnDef<Payroll>[] = [
  {
    accessorKey: 'emp_code',
    header: 'Employee ID',
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue('emp_code')}</div>
    ),
  },
  {
    accessorKey: 'employee_name',
    header: 'Employee Name',
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue('employee_name')}</div>
    ),
  },
  {
    accessorKey: 'month',
    header: 'Period',
    cell: ({ row }) => (
      <Badge variant="outline">{row.getValue('month')}</Badge>
    ),
  },
  {
    accessorKey: 'gross_pay',
    header: 'Gross Pay',
    cell: ({ row }) => {
      const amount = row.getValue('gross_pay') as number;
      return <div className="font-medium">${amount.toLocaleString()}</div>;
    },
  },
  {
    accessorKey: 'total_deductions',
    header: 'Deductions',
    cell: ({ row }) => {
      const amount = row.getValue('total_deductions') as number;
      return <div className="text-red-600">${amount.toLocaleString()}</div>;
    },
  },
  {
    accessorKey: 'net_pay',
    header: 'Net Pay',
    cell: ({ row }) => {
      const amount = row.getValue('net_pay') as number;
      return <div className="font-bold text-green-600">${amount.toLocaleString()}</div>;
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const payroll = row.original;
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="rounded-xl">
              <Eye className="w-4 h-4 mr-1" />
              View Slip
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Salary Slip - {payroll.employee_name}</DialogTitle>
            </DialogHeader>
            <PayrollCard
              payroll={payroll}
              onPrint={() => {
                window.print();
              }}
              onDownload={() => {
                toast.success('PDF download would start here');
              }}
            />
          </DialogContent>
        </Dialog>
      );
    },
  },
];

export default function PayrollPage() {
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayrolls = async () => {
      try {
        const response = await fetch('/api/payroll');
        if (response.ok) {
          const data = await response.json();
          setPayrolls(data);
        } else {
          const { mockData } = await import('@/lib/mock-data');
          setPayrolls(mockData.payroll as Payroll[]);
        }
      } catch (error) {
        console.error('Error fetching payroll:', error);
        try {
          const { mockData } = await import('@/lib/mock-data');
          setPayrolls(mockData.payroll as Payroll[]);
        } catch (mockError) {
          console.error('Error loading mock data:', mockError);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPayrolls();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payroll Management</h1>
          <p className="text-gray-600 mt-1">Manage employee salaries and compensation</p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading payroll data...</div>
        </div>
      </div>
    );
  }

  const totalGrossPay = payrolls.reduce((sum, p) => sum + p.gross_pay, 0);
  const totalNetPay = payrolls.reduce((sum, p) => sum + p.net_pay, 0);
  const totalDeductions = payrolls.reduce((sum, p) => sum + p.total_deductions, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Payroll Management</h1>
        <p className="text-gray-600 mt-1">Manage employee salaries and compensation</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="rounded-2xl border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Employees Paid</CardTitle>
            <div className="p-2 bg-blue-100 rounded-xl">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{payrolls.length}</div>
            <p className="text-xs text-gray-500 mt-1">This period</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Gross Pay</CardTitle>
            <div className="p-2 bg-green-100 rounded-xl">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalGrossPay.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">Before deductions</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Deductions</CardTitle>
            <div className="p-2 bg-red-100 rounded-xl">
              <TrendingUp className="h-5 w-5 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">${totalDeductions.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">Taxes & contributions</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Net Pay</CardTitle>
            <div className="p-2 bg-primary/10 rounded-xl">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">${totalNetPay.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">Take home amount</p>
          </CardContent>
        </Card>
      </div>

      <DataTable
        columns={columns}
        data={payrolls}
        searchKey="employee_name"
        searchPlaceholder="Search by employee name..."
      />
    </div>
  );
}
