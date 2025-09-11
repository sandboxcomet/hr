'use client';

import { useEffect, useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ColumnDef } from '@tanstack/react-table';
import { Employee } from '@/types';
import { Plus, MoreHorizontal, Eye, Edit, Trash } from 'lucide-react';
import Link from 'next/link';

const columns: ColumnDef<Employee>[] = [
  {
    accessorKey: 'emp_code',
    header: 'Employee ID',
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue('emp_code')}</div>
    ),
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      const employee = row.original;
      return (
        <div className="flex items-center space-x-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={employee.avatar} />
            <AvatarFallback>
              {employee.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{employee.name}</div>
            <div className="text-sm text-gray-500">{employee.email}</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'department',
    header: 'Department',
    cell: ({ row }) => (
      <Badge variant="secondary">{row.getValue('department')}</Badge>
    ),
  },
  {
    accessorKey: 'position',
    header: 'Position',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <Badge
          variant={status === 'Active' ? 'default' : 'destructive'}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'hire_date',
    header: 'Hire Date',
    cell: ({ row }) => {
      return new Date(row.getValue('hire_date')).toLocaleDateString();
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const employee = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/employees/${employee.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Edit Employee
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              <Trash className="mr-2 h-4 w-4" />
              Delete Employee
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load mock data directly for demo
    const loadEmployees = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Use mock data directly
        const mockEmployees: Employee[] = [
          {
            id: 1,
            emp_code: "EMP001",
            name: "John Smith",
            email: "john.smith@company.com",
            department: "Engineering",
            position: "Senior Software Engineer",
            status: "Active",
            hire_date: "2022-01-15",
            phone: "+1-555-0123",
            address: "123 Main St, New York, NY 10001",
            manager_id: 4,
            salary: 95000,
            avatar: "/api/placeholder/32/32"
          },
          {
            id: 2,
            emp_code: "EMP002",
            name: "Sarah Johnson",
            email: "sarah.johnson@company.com",
            department: "Marketing",
            position: "Marketing Manager",
            status: "Active",
            hire_date: "2021-06-10",
            phone: "+1-555-0124",
            address: "456 Oak Ave, Los Angeles, CA 90210",
            manager_id: 5,
            salary: 75000,
            avatar: "/api/placeholder/32/32"
          },
          {
            id: 3,
            emp_code: "EMP003",
            name: "Michael Davis",
            email: "michael.davis@company.com",
            department: "Sales",
            position: "Sales Representative",
            status: "Active",
            hire_date: "2023-03-20",
            phone: "+1-555-0125",
            address: "789 Pine St, Chicago, IL 60601",
            manager_id: 6,
            salary: 55000,
            avatar: "/api/placeholder/32/32"
          },
          {
            id: 4,
            emp_code: "EMP004",
            name: "Emily Chen",
            email: "emily.chen@company.com",
            department: "Engineering",
            position: "Engineering Manager",
            status: "Active",
            hire_date: "2020-08-05",
            phone: "+1-555-0126",
            address: "321 Elm St, San Francisco, CA 94102",
            manager_id: null,
            salary: 130000,
            avatar: "/api/placeholder/32/32"
          }
        ];
        
        setEmployees(mockEmployees);
      } catch (error) {
        console.error('Error loading employees:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEmployees();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Employees</h1>
            <p className="text-gray-600 mt-1">Manage your organization's employees</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading employees...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Employees</h1>
          <p className="text-gray-600 mt-1">Manage your organization's employees</p>
        </div>
        <Button className="rounded-2xl">
          <Plus className="w-4 h-4 mr-2" />
          Add Employee
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-200">
          <div className="text-sm text-gray-600">Total Employees</div>
          <div className="text-2xl font-bold text-gray-900">{employees.length}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200">
          <div className="text-sm text-gray-600">Active</div>
          <div className="text-2xl font-bold text-green-600">
            {employees.filter(emp => emp.status === 'Active').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200">
          <div className="text-sm text-gray-600">Departments</div>
          <div className="text-2xl font-bold text-blue-600">
            {new Set(employees.map(emp => emp.department)).size}
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200">
          <div className="text-sm text-gray-600">Avg Tenure</div>
          <div className="text-2xl font-bold text-purple-600">2.3 years</div>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={employees}
        searchKey="name"
        searchPlaceholder="Search employees..."
      />
    </div>
  );
}
