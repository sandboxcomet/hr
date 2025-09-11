import { getDashboardKPIs, getEmployees, getLeaves, getTrainings } from '@/lib/data';
import { KpiCards } from '@/components/KpiCards';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarDays, Clock, Users, BookOpen } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export default async function Dashboard() {
  const t = await getTranslations('dashboard');
  
  const [kpis, employees, leaves, trainings] = await Promise.all([
    getDashboardKPIs(),
    getEmployees(),
    getLeaves(),
    getTrainings(),
  ]);

  // Get recent activities
  const recentEmployees = employees.slice(-3).reverse();
  const pendingLeaves = leaves.filter(leave => leave.status === 'Pending').slice(0, 3);
  const upcomingTrainings = trainings
    .filter(training => training.status === 'Scheduled')
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
        <p className="text-gray-600 mt-1">{t('subtitle')}</p>
      </div>

      {/* KPI Cards */}
      <KpiCards kpis={kpis} />

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Employees */}
        <Card className="rounded-2xl border-gray-200 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">{t('recentHires')}</CardTitle>
              <div className="p-2 bg-blue-100 rounded-xl">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentEmployees.map((employee) => (
              <div key={employee.id} className="flex items-center space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={employee.avatar} />
                  <AvatarFallback>
                    {employee.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {employee.name}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {employee.position}
                  </p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {employee.department}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Pending Leaves */}
        <Card className="rounded-2xl border-gray-200 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">{t('pendingLeaves')}</CardTitle>
              <div className="p-2 bg-orange-100 rounded-xl">
                <CalendarDays className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingLeaves.length > 0 ? (
              pendingLeaves.map((leave) => (
                <div key={leave.id} className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {leave.employee_name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {leave.type} • {leave.days} days
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {new Date(leave.start_date).toLocaleDateString()}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                No pending leave requests
              </p>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Trainings */}
        <Card className="rounded-2xl border-gray-200 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">{t('upcomingTrainings')}</CardTitle>
              <div className="p-2 bg-green-100 rounded-xl">
                <BookOpen className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingTrainings.length > 0 ? (
              upcomingTrainings.map((training) => (
                <div key={training.id} className="space-y-1">
                  <p className="text-sm font-medium text-gray-900">
                    {training.title}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                      {training.participants.length} participants
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {new Date(training.start_date).toLocaleDateString()}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                No upcoming trainings
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}