'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Employee, Leave, Payroll, Benefits } from '@/types';
import {
  User,
  Calendar,
  DollarSign,
  Gift,
  Settings,
  FileText,
  Clock,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';

export default function SelfServicePage() {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [benefits, setBenefits] = useState<Benefits | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock current user ID
  const currentUserId = 1;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch employee data
        const { mockData } = await import('@/lib/mock-data');
        const currentEmployee = (mockData.employees as Employee[]).find(emp => emp.id === currentUserId);
        setEmployee(currentEmployee || null);

        // Fetch leaves
        const userLeaves = (mockData.leaves as Leave[]).filter(leave => leave.employee_id === currentUserId);
        setLeaves(userLeaves);

        // Fetch payrolls
        const userPayrolls = (mockData.payroll as Payroll[]).filter(payroll => payroll.employee_id === currentUserId);
        setPayrolls(userPayrolls);

        // Fetch benefits
        const userBenefits = (mockData.benefits as Benefits[]).find(benefit => benefit.employee_id === currentUserId);
        setBenefits(userBenefits || null);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Employee Self Service</h1>
          <p className="text-gray-600 mt-1">Access your personal HR information and services</p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading your data...</div>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Employee Self Service</h1>
          <p className="text-gray-600 mt-1">Access your personal HR information and services</p>
        </div>
        <div className="text-center text-gray-500 py-12">
          Employee data not found. Please contact HR.
        </div>
      </div>
    );
  }

  const latestPayroll = payrolls[0];
  const pendingLeaves = leaves.filter(leave => leave.status === 'Pending');
  const approvedLeaves = leaves.filter(leave => leave.status === 'Approved');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Employee Self Service</h1>
        <p className="text-gray-600 mt-1">Welcome back, {employee.name}!</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="rounded-2xl border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pending Leaves</CardTitle>
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
            <CardTitle className="text-sm font-medium text-gray-600">Approved Leaves</CardTitle>
            <div className="p-2 bg-green-100 rounded-xl">
              <Calendar className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{approvedLeaves.length}</div>
            <p className="text-xs text-gray-500 mt-1">This year</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Last Salary</CardTitle>
            <div className="p-2 bg-primary/10 rounded-xl">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              ${latestPayroll ? latestPayroll.net_pay.toLocaleString() : '0'}
            </div>
            <p className="text-xs text-gray-500 mt-1">{latestPayroll?.month || 'N/A'}</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Benefits Cost</CardTitle>
            <div className="p-2 bg-blue-100 rounded-xl">
              <Gift className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              ${benefits ? benefits.employee_total_contribution.toFixed(0) : '0'}
            </div>
            <p className="text-xs text-gray-500 mt-1">Your monthly contribution</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information */}
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">My Profile</TabsTrigger>
          <TabsTrigger value="leaves">My Leaves</TabsTrigger>
          <TabsTrigger value="payroll">My Payroll</TabsTrigger>
          <TabsTrigger value="benefits">My Benefits</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Profile Card */}
            <Card className="rounded-2xl border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={employee.avatar} />
                    <AvatarFallback className="text-lg">
                      {employee.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold">{employee.name}</h3>
                    <p className="text-gray-600">{employee.position}</p>
                    <Badge variant="default" className="mt-1">{employee.status}</Badge>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600">Email</div>
                      <div className="font-medium">{employee.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600">Phone</div>
                      <div className="font-medium">{employee.phone}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600">Address</div>
                      <div className="font-medium">{employee.address}</div>
                    </div>
                  </div>
                </div>

                <Button className="w-full rounded-xl">
                  <Settings className="w-4 h-4 mr-2" />
                  Update Profile
                </Button>
              </CardContent>
            </Card>

            {/* Employment Details */}
            <Card className="rounded-2xl border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Employment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Employee ID</div>
                    <div className="font-medium">{employee.emp_code}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Department</div>
                    <div className="font-medium">{employee.department}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Position</div>
                    <div className="font-medium">{employee.position}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Hire Date</div>
                    <div className="font-medium">
                      {new Date(employee.hire_date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="leaves">
          <Card className="rounded-2xl border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle>Leave History</CardTitle>
            </CardHeader>
            <CardContent>
              {leaves.length > 0 ? (
                <div className="space-y-4">
                  {leaves.map((leave) => (
                    <div key={leave.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                      <div>
                        <div className="font-medium">{leave.type}</div>
                        <div className="text-sm text-gray-600">
                          {new Date(leave.start_date).toLocaleDateString()} - {new Date(leave.end_date).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-600">{leave.days} days • {leave.reason}</div>
                      </div>
                      <Badge
                        variant={
                          leave.status === 'Approved' ? 'default' :
                          leave.status === 'Rejected' ? 'destructive' : 'secondary'
                        }
                      >
                        {leave.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No leave records found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payroll">
          <Card className="rounded-2xl border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle>Recent Payroll</CardTitle>
            </CardHeader>
            <CardContent>
              {latestPayroll ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-xl">
                      <div className="text-2xl font-bold text-green-600">
                        ${latestPayroll.gross_pay.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Gross Pay</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-xl">
                      <div className="text-2xl font-bold text-red-600">
                        ${latestPayroll.total_deductions.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Deductions</div>
                    </div>
                    <div className="text-center p-4 bg-primary/10 rounded-xl">
                      <div className="text-2xl font-bold text-primary">
                        ${latestPayroll.net_pay.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Net Pay</div>
                    </div>
                  </div>
                  <Button className="w-full rounded-xl">
                    <FileText className="w-4 h-4 mr-2" />
                    Download Payslip
                  </Button>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No payroll data found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="benefits">
          <Card className="rounded-2xl border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle>My Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              {benefits ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-xl">
                      <div className="text-2xl font-bold text-blue-600">
                        ${benefits.total_monthly_cost.toFixed(0)}
                      </div>
                      <div className="text-sm text-gray-600">Total Monthly Cost</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-xl">
                      <div className="text-2xl font-bold text-green-600">
                        ${benefits.company_total_contribution.toFixed(0)}
                      </div>
                      <div className="text-sm text-gray-600">Company Pays</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-xl">
                      <div className="text-2xl font-bold text-orange-600">
                        ${benefits.employee_total_contribution.toFixed(0)}
                      </div>
                      <div className="text-sm text-gray-600">You Pay</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {benefits.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                        <div>
                          <div className="font-medium">{benefit.type}</div>
                          <div className="text-sm text-gray-600">
                            {benefit.provider} • {benefit.coverage}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">${benefit.monthly_premium}/month</div>
                          <Badge variant={benefit.status === 'Active' ? 'default' : 'secondary'}>
                            {benefit.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No benefits information found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
