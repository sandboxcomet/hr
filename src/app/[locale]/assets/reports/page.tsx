'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ArrowLeft, Package, DollarSign, Wrench, AlertTriangle, BarChart3, PieChart, TrendingUp, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { KpiCards } from '@/components/KpiCards';
import { mockData } from '@/lib/mock-data';
import { Asset, MaintenanceLog, AssetDashboardKPI } from '@/types';

export default function AssetReportsPage() {
  const t = useTranslations('assets');
  
  const assets = mockData.assets as Asset[];
  const maintenanceLogs = mockData.maintenanceLogs as MaintenanceLog[];

  // Calculate comprehensive KPIs and reports data
  const reportsData = useMemo(() => {
    const totalAssets = assets.length;
    const assignedAssets = assets.filter(asset => asset.status === 'Assigned').length;
    const availableAssets = assets.filter(asset => asset.status === 'Available').length;
    const underMaintenance = assets.filter(asset => asset.status === 'Under Maintenance').length;
    const disposedAssets = assets.filter(asset => asset.status === 'Disposed').length;
    const totalValue = assets.reduce((sum, asset) => sum + asset.current_value, 0);
    const originalValue = assets.reduce((sum, asset) => sum + asset.purchase_price, 0);

    // Calculate upcoming maintenance (next 30 days)
    const today = new Date();
    const nextMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    const upcomingMaintenance = assets.filter(asset => {
      if (!asset.next_maintenance) return false;
      const maintenanceDate = new Date(asset.next_maintenance);
      return maintenanceDate >= today && maintenanceDate <= nextMonth;
    }).length;

    // Calculate overdue maintenance
    const overdueMaintenance = assets.filter(asset => {
      if (!asset.next_maintenance) return false;
      const maintenanceDate = new Date(asset.next_maintenance);
      return maintenanceDate < today;
    }).length;

    // Group by category
    const byCategory = assets.reduce((acc, asset) => {
      const existing = acc.find(item => item.category === asset.category);
      if (existing) {
        existing.count += 1;
        existing.value += asset.current_value;
      } else {
        acc.push({
          category: asset.category,
          count: 1,
          value: asset.current_value
        });
      }
      return acc;
    }, [] as { category: string; count: number; value: number; }[]);

    // Group by status
    const byStatus = [
      { status: 'Available', count: availableAssets, percentage: (availableAssets / totalAssets) * 100 },
      { status: 'Assigned', count: assignedAssets, percentage: (assignedAssets / totalAssets) * 100 },
      { status: 'Under Maintenance', count: underMaintenance, percentage: (underMaintenance / totalAssets) * 100 },
      { status: 'Disposed', count: disposedAssets, percentage: (disposedAssets / totalAssets) * 100 }
    ];

    // Group by condition
    const conditionCounts = assets.reduce((acc, asset) => {
      acc[asset.condition] = (acc[asset.condition] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byCondition = Object.entries(conditionCounts).map(([condition, count]) => ({
      condition,
      count,
      percentage: (count / totalAssets) * 100
    }));

    // Maintenance cost analysis
    const totalMaintenanceCost = maintenanceLogs
      .filter(log => log.status === 'Completed')
      .reduce((sum, log) => sum + log.cost, 0);

    const avgMaintenanceCost = totalMaintenanceCost / maintenanceLogs.filter(log => log.status === 'Completed').length || 0;

    // Depreciation analysis
    const totalDepreciation = originalValue - totalValue;
    const depreciationRate = (totalDepreciation / originalValue) * 100;

    return {
      totalAssets,
      assignedAssets,
      availableAssets,
      underMaintenance,
      disposedAssets,
      totalValue,
      originalValue,
      upcomingMaintenance,
      overdueMaintenance,
      byCategory: byCategory.sort((a, b) => b.count - a.count),
      byStatus,
      byCondition: byCondition.sort((a, b) => b.count - a.count),
      totalMaintenanceCost,
      avgMaintenanceCost,
      totalDepreciation,
      depreciationRate
    };
  }, [assets, maintenanceLogs]);

  // KPI Cards data
  const kpiData = [
    {
      title: t('totalAssets'),
      value: reportsData.totalAssets.toString(),
      description: 'Active assets in system',
      icon: Package,
      trend: { value: 0, label: 'No change' }
    },
    {
      title: t('totalValue'),
      value: `$${reportsData.totalValue.toLocaleString()}`,
      description: `${reportsData.depreciationRate.toFixed(1)}% depreciated`,
      icon: DollarSign,
      trend: { value: -reportsData.depreciationRate, label: 'Depreciation' }
    },
    {
      title: t('upcomingMaintenance'),
      value: reportsData.upcomingMaintenance.toString(),
      description: 'Next 30 days',
      icon: reportsData.upcomingMaintenance > 0 ? AlertTriangle : Wrench,
      trend: { value: 0, label: 'Scheduled' }
    },
    {
      title: 'Maintenance Cost',
      value: `$${reportsData.totalMaintenanceCost.toLocaleString()}`,
      description: `Avg: $${reportsData.avgMaintenanceCost.toFixed(0)} per service`,
      icon: Wrench,
      trend: { value: 0, label: 'Total spent' }
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-green-500';
      case 'Assigned': return 'bg-blue-500';
      case 'Under Maintenance': return 'bg-orange-500';
      case 'Disposed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'Excellent': return 'bg-green-500';
      case 'Good': return 'bg-blue-500';
      case 'Fair': return 'bg-yellow-500';
      case 'Poor': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryIcon = (category: string) => {
    // You could expand this with more specific icons
    return Package;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/assets">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Assets
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('quickReports')}</h1>
            <p className="text-gray-600 mt-1">Asset analytics and insights</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <BarChart3 className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <KpiCards data={kpiData} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Asset Distribution by Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="w-5 h-5" />
              <span>{t('assetDistribution')} - {t('byStatus')}</span>
            </CardTitle>
            <CardDescription>
              Current status breakdown of all assets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportsData.byStatus.map((item) => (
                <div key={item.status} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(item.status)}`} />
                      <span className="text-sm font-medium">{item.status}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {item.count} ({item.percentage.toFixed(1)}%)
                    </div>
                  </div>
                  <Progress value={item.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Asset Distribution by Condition */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="w-5 h-5" />
              <span>{t('assetDistribution')} - {t('byCondition')}</span>
            </CardTitle>
            <CardDescription>
              Physical condition breakdown of all assets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportsData.byCondition.map((item) => (
                <div key={item.condition} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${getConditionColor(item.condition)}`} />
                      <span className="text-sm font-medium">{item.condition}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {item.count} ({item.percentage.toFixed(1)}%)
                    </div>
                  </div>
                  <Progress value={item.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Asset Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>{t('assetDistribution')} - {t('byCategory')}</span>
            </CardTitle>
            <CardDescription>
              Assets grouped by category with values
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportsData.byCategory.map((item) => {
                const Icon = getCategoryIcon(item.category);
                return (
                  <div key={item.category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{item.category}</p>
                        <p className="text-sm text-gray-600">{item.count} assets</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${item.value.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Total value</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Financial Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5" />
              <span>Financial Overview</span>
            </CardTitle>
            <CardDescription>
              Asset values and depreciation analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-600 font-medium">Original Value</p>
                  <p className="text-xl font-bold text-blue-900">${reportsData.originalValue.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-600 font-medium">Current Value</p>
                  <p className="text-xl font-bold text-green-900">${reportsData.totalValue.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="p-3 bg-red-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-red-600 font-medium">Total Depreciation</p>
                    <p className="text-xl font-bold text-red-900">${reportsData.totalDepreciation.toLocaleString()}</p>
                  </div>
                  <Badge variant="destructive">
                    {reportsData.depreciationRate.toFixed(1)}%
                  </Badge>
                </div>
              </div>

              <div className="p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-orange-600 font-medium">Maintenance Spent</p>
                    <p className="text-xl font-bold text-orange-900">${reportsData.totalMaintenanceCost.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-orange-600">Avg per service</p>
                    <p className="font-semibold text-orange-900">${reportsData.avgMaintenanceCost.toFixed(0)}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Maintenance Schedule */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>{t('maintenanceSchedule')}</span>
            </CardTitle>
            <CardDescription>
              Upcoming and overdue maintenance activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">Upcoming Maintenance</h4>
                  <Badge variant="secondary">{reportsData.upcomingMaintenance} items</Badge>
                </div>
                <div className="space-y-2">
                  {assets
                    .filter(asset => {
                      if (!asset.next_maintenance) return false;
                      const maintenanceDate = new Date(asset.next_maintenance);
                      const today = new Date();
                      const nextMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
                      return maintenanceDate >= today && maintenanceDate <= nextMonth;
                    })
                    .slice(0, 5)
                    .map(asset => (
                      <div key={asset.id} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                        <div>
                          <p className="text-sm font-medium">{asset.name}</p>
                          <p className="text-xs text-gray-600">{asset.asset_code}</p>
                        </div>
                        <p className="text-xs text-blue-600">
                          {asset.next_maintenance && new Date(asset.next_maintenance).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  {reportsData.upcomingMaintenance === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">No upcoming maintenance</p>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">Overdue Maintenance</h4>
                  <Badge variant="destructive">{reportsData.overdueMaintenance} items</Badge>
                </div>
                <div className="space-y-2">
                  {assets
                    .filter(asset => {
                      if (!asset.next_maintenance) return false;
                      const maintenanceDate = new Date(asset.next_maintenance);
                      return maintenanceDate < new Date();
                    })
                    .slice(0, 5)
                    .map(asset => (
                      <div key={asset.id} className="flex items-center justify-between p-2 bg-red-50 rounded">
                        <div>
                          <p className="text-sm font-medium">{asset.name}</p>
                          <p className="text-xs text-gray-600">{asset.asset_code}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-red-600">
                            {asset.next_maintenance && new Date(asset.next_maintenance).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-red-500">Overdue</p>
                        </div>
                      </div>
                    ))}
                  {reportsData.overdueMaintenance === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">No overdue maintenance</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
