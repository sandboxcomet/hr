import { getEmployee, getLeaves, getPerformance, getBenefits } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  User,
  Building,
  Edit,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';

interface EmployeeDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function EmployeeDetailPage({ params }: EmployeeDetailPageProps) {
  const { id } = await params;
  const employeeId = parseInt(id);
  
  if (isNaN(employeeId)) {
    notFound();
  }

  const [employee, leaves, performance, benefits] = await Promise.all([
    getEmployee(employeeId),
    getLeaves(),
    getPerformance(),
    getBenefits(),
  ]);

  if (!employee) {
    notFound();
  }

  const employeeLeaves = leaves.filter(leave => leave.employee_id === employeeId);
  const employeePerformance = performance.find(p => p.employee_id === employeeId);
  const employeeBenefits = benefits.find(b => b.employee_id === employeeId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/employees">
            <Button variant="outline" size="sm" className="rounded-2xl">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Employees
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{employee.name}</h1>
            <p className="text-gray-600 mt-1">{employee.position} • {employee.department}</p>
          </div>
        </div>
        <Button className="rounded-2xl">
          <Edit className="w-4 h-4 mr-2" />
          Edit Employee
        </Button>
      </div>

      {/* Employee Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="rounded-2xl border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <Avatar className="w-24 h-24">
                <AvatarImage src={employee.avatar} />
                <AvatarFallback className="text-2xl">
                  {employee.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{employee.name}</h3>
                <p className="text-gray-600">{employee.position}</p>
                <Badge
                  variant={employee.status === 'Active' ? 'default' : 'destructive'}
                  className="mt-2"
                >
                  {employee.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="rounded-2xl border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-600">Email</div>
                <div className="font-medium">{employee.email}</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-600">Phone</div>
                <div className="font-medium">{employee.phone}</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-600">Address</div>
                <div className="font-medium">{employee.address}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Employment Details */}
        <Card className="rounded-2xl border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Employment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-600">Employee ID</div>
                <div className="font-medium">{employee.emp_code}</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Building className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-600">Department</div>
                <div className="font-medium">{employee.department}</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-600">Hire Date</div>
                <div className="font-medium">
                  {new Date(employee.hire_date).toLocaleDateString()}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <DollarSign className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-600">Annual Salary</div>
                <div className="font-medium">${employee.salary.toLocaleString()}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information Tabs */}
      <Tabs defaultValue="leaves" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="leaves">Leave History</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="benefits">Benefits</TabsTrigger>
        </TabsList>

        <TabsContent value="leaves" className="space-y-4">
          <Card className="rounded-2xl border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle>Leave History</CardTitle>
            </CardHeader>
            <CardContent>
              {employeeLeaves.length > 0 ? (
                <div className="space-y-4">
                  {employeeLeaves.map((leave) => (
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

        <TabsContent value="performance" className="space-y-4">
          <Card className="rounded-2xl border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle>Performance Review</CardTitle>
            </CardHeader>
            <CardContent>
              {employeePerformance ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{employeePerformance.overall_rating}</div>
                      <div className="text-sm text-gray-600">Overall Rating</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{employeePerformance.technical_skills}</div>
                      <div className="text-sm text-gray-600">Technical Skills</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{employeePerformance.communication}</div>
                      <div className="text-sm text-gray-600">Communication</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{employeePerformance.teamwork}</div>
                      <div className="text-sm text-gray-600">Teamwork</div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Goals</h4>
                      <div className="space-y-2">
                        {employeePerformance.goals.map((goal, index) => (
                          <div key={index} className="p-3 border border-gray-100 rounded-xl">
                            <div className="flex items-center justify-between">
                              <div className="font-medium">{goal.title}</div>
                              <Badge variant={goal.status === 'Completed' ? 'default' : 'secondary'}>
                                Score: {goal.score}/5
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-600 mt-1">{goal.description}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Manager Feedback</h4>
                      <p className="text-gray-700 bg-gray-50 p-4 rounded-xl">{employeePerformance.manager_feedback}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No performance review found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="benefits" className="space-y-4">
          <Card className="rounded-2xl border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle>Benefits Package</CardTitle>
            </CardHeader>
            <CardContent>
              {employeeBenefits ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-xl">
                      <div className="text-2xl font-bold text-blue-600">
                        ${employeeBenefits.total_monthly_cost.toFixed(0)}
                      </div>
                      <div className="text-sm text-gray-600">Total Monthly Cost</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-xl">
                      <div className="text-2xl font-bold text-green-600">
                        ${employeeBenefits.company_total_contribution.toFixed(0)}
                      </div>
                      <div className="text-sm text-gray-600">Company Contribution</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-xl">
                      <div className="text-2xl font-bold text-orange-600">
                        ${employeeBenefits.employee_total_contribution.toFixed(0)}
                      </div>
                      <div className="text-sm text-gray-600">Employee Contribution</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {employeeBenefits.benefits.map((benefit, index) => (
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
