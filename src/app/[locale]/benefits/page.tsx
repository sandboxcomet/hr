'use client';

import { useEffect, useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ColumnDef } from '@tanstack/react-table';
import { Benefits } from '@/types';
import { Gift, DollarSign, Users, TrendingUp } from 'lucide-react';

const columns: ColumnDef<Benefits>[] = [
  {
    accessorKey: 'employee_name',
    header: 'Employee',
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue('employee_name')}</div>
    ),
  },
  {
    accessorKey: 'benefits',
    header: 'Benefits Count',
    cell: ({ row }) => {
      const benefits = row.original.benefits;
      const active = benefits.filter(b => b.status === 'Active').length;
      return (
        <div className="text-center">
          <div className="font-medium">{active}/{benefits.length}</div>
          <div className="text-xs text-gray-500">active</div>
        </div>
      );
    },
  },
  {
    accessorKey: 'total_monthly_cost',
    header: 'Total Cost',
    cell: ({ row }) => {
      const cost = row.getValue('total_monthly_cost') as number;
      return <div className="font-medium">${cost.toFixed(0)}/month</div>;
    },
  },
  {
    accessorKey: 'company_total_contribution',
    header: 'Company Contribution',
    cell: ({ row }) => {
      const contribution = row.getValue('company_total_contribution') as number;
      return <div className="font-medium text-green-600">${contribution.toFixed(0)}</div>;
    },
  },
  {
    accessorKey: 'employee_total_contribution',
    header: 'Employee Contribution',
    cell: ({ row }) => {
      const contribution = row.getValue('employee_total_contribution') as number;
      return <div className="font-medium text-blue-600">${contribution.toFixed(0)}</div>;
    },
  },
  {
    id: 'top_benefits',
    header: 'Top Benefits',
    cell: ({ row }) => {
      const benefits = row.original.benefits
        .filter(b => b.status === 'Active')
        .slice(0, 2);
      return (
        <div className="flex flex-wrap gap-1">
          {benefits.map((benefit, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {benefit.type}
            </Badge>
          ))}
        </div>
      );
    },
  },
];

export default function BenefitsPage() {
  const [benefits, setBenefits] = useState<Benefits[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBenefits = async () => {
      try {
        const response = await fetch('/api/benefits');
        if (response.ok) {
          const data = await response.json();
          setBenefits(data);
        } else {
          const { mockData } = await import('@/lib/mock-data');
          setBenefits(mockData.benefits as Benefits[]);
        }
      } catch (error) {
        console.error('Error fetching benefits:', error);
        try {
          const { mockData } = await import('@/lib/mock-data');
          setBenefits(mockData.benefits as Benefits[]);
        } catch (mockError) {
          console.error('Error loading mock data:', mockError);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBenefits();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Compensation & Benefits</h1>
          <p className="text-gray-600 mt-1">Manage employee benefits and compensation packages</p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading benefits data...</div>
        </div>
      </div>
    );
  }

  const totalEmployees = benefits.length;
  const totalMonthlyCost = benefits.reduce((sum, b) => sum + b.total_monthly_cost, 0);
  const totalCompanyContribution = benefits.reduce((sum, b) => sum + b.company_total_contribution, 0);
  const avgCostPerEmployee = totalMonthlyCost / totalEmployees;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Compensation & Benefits</h1>
        <p className="text-gray-600 mt-1">Manage employee benefits and compensation packages</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="rounded-2xl border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Enrolled Employees</CardTitle>
            <div className="p-2 bg-blue-100 rounded-xl">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{totalEmployees}</div>
            <p className="text-xs text-gray-500 mt-1">With benefits</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Monthly Cost</CardTitle>
            <div className="p-2 bg-red-100 rounded-xl">
              <DollarSign className="h-5 w-5 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">${totalMonthlyCost.toFixed(0)}</div>
            <p className="text-xs text-gray-500 mt-1">All benefits combined</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Company Contribution</CardTitle>
            <div className="p-2 bg-green-100 rounded-xl">
              <Gift className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalCompanyContribution.toFixed(0)}</div>
            <p className="text-xs text-gray-500 mt-1">{Math.round((totalCompanyContribution/totalMonthlyCost)*100)}% of total cost</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Avg Cost/Employee</CardTitle>
            <div className="p-2 bg-primary/10 rounded-xl">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">${avgCostPerEmployee.toFixed(0)}</div>
            <p className="text-xs text-gray-500 mt-1">Per employee/month</p>
          </CardContent>
        </Card>
      </div>

      <DataTable
        columns={columns}
        data={benefits}
        searchKey="employee_name"
        searchPlaceholder="Search by employee name..."
      />
    </div>
  );
}
