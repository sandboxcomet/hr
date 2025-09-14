'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Package, User, Calendar, DollarSign, Wrench, FileText, UserPlus, ArrowRightLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable } from '@/components/DataTable';
import { AssetAssignModal } from '@/components/AssetAssignModal';
import { MaintenanceModal } from '@/components/MaintenanceModal';
import { mockData } from '@/lib/mock-data';
import { Asset, AssetAssignment, MaintenanceLog } from '@/types';

export default function AssetDetailPage() {
  const t = useTranslations('assets');
  const params = useParams();
  const router = useRouter();
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);

  const assetId = parseInt(params.id as string);
  const assets = mockData.assets as Asset[];
  const assignments = mockData.assetAssignments as AssetAssignment[];
  const maintenanceLogs = mockData.maintenanceLogs as MaintenanceLog[];

  const asset = assets.find(a => a.id === assetId);
  
  if (!asset) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Asset Not Found</h2>
          <p className="text-gray-600 mb-4">The asset you're looking for doesn't exist.</p>
          <Link href="/assets">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Assets
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Get assignment history for this asset
  const assetAssignments = assignments.filter(assignment => assignment.asset_id === assetId);
  
  // Get maintenance logs for this asset
  const assetMaintenanceLogs = maintenanceLogs.filter(log => log.asset_id === assetId);

  const getStatusBadge = (status: string) => {
    const variants = {
      'Available': 'default',
      'Assigned': 'secondary',
      'Under Maintenance': 'destructive',
      'Disposed': 'outline'
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants] || 'default'}>{status}</Badge>;
  };

  const getConditionBadge = (condition: string) => {
    const variants = {
      'Excellent': 'default',
      'Good': 'secondary',
      'Fair': 'outline',
      'Poor': 'destructive'
    } as const;
    
    return <Badge variant={variants[condition as keyof typeof variants] || 'default'}>{condition}</Badge>;
  };

  const getMaintenanceStatusBadge = (status: string) => {
    const variants = {
      'Scheduled': 'outline',
      'In Progress': 'secondary',
      'Completed': 'default',
      'Failed': 'destructive',
      'Cancelled': 'outline'
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants] || 'default'}>{status}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      'Low': 'outline',
      'Medium': 'secondary',
      'High': 'destructive',
      'Critical': 'destructive'
    } as const;
    
    return <Badge variant={variants[priority as keyof typeof variants] || 'default'}>{priority}</Badge>;
  };

  // Assignment history columns
  const assignmentColumns = [
    {
      accessorKey: 'employee_name',
      header: 'Employee',
      cell: ({ row }: { row: any }) => (
        <div>
          <div className="font-medium">{row.original.employee_name}</div>
          <div className="text-sm text-gray-500">{row.original.department}</div>
        </div>
      ),
    },
    {
      accessorKey: 'assigned_date',
      header: 'Assigned Date',
      cell: ({ row }: { row: any }) => new Date(row.original.assigned_date).toLocaleDateString(),
    },
    {
      accessorKey: 'return_date',
      header: 'Return Date',
      cell: ({ row }: { row: any }) => row.original.return_date ? new Date(row.original.return_date).toLocaleDateString() : '-',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }: { row: any }) => {
        const variants = {
          'Active': 'default',
          'Returned': 'secondary',
          'Under Maintenance': 'destructive'
        } as const;
        return <Badge variant={variants[row.original.status as keyof typeof variants] || 'default'}>{row.original.status}</Badge>;
      },
    },
    {
      accessorKey: 'assigned_by_name',
      header: 'Assigned By',
    },
  ];

  // Maintenance history columns
  const maintenanceColumns = [
    {
      accessorKey: 'maintenance_type',
      header: 'Type',
      cell: ({ row }: { row: any }) => {
        const variants = {
          'Preventive': 'default',
          'Corrective': 'secondary',
          'Emergency': 'destructive'
        } as const;
        return <Badge variant={variants[row.original.maintenance_type as keyof typeof variants] || 'default'}>{row.original.maintenance_type}</Badge>;
      },
    },
    {
      accessorKey: 'description',
      header: 'Description',
    },
    {
      accessorKey: 'scheduled_date',
      header: 'Scheduled',
      cell: ({ row }: { row: any }) => new Date(row.original.scheduled_date).toLocaleDateString(),
    },
    {
      accessorKey: 'completed_date',
      header: 'Completed',
      cell: ({ row }: { row: any }) => row.original.completed_date ? new Date(row.original.completed_date).toLocaleDateString() : '-',
    },
    {
      accessorKey: 'technician',
      header: 'Technician',
    },
    {
      accessorKey: 'cost',
      header: 'Cost',
      cell: ({ row }: { row: any }) => `$${row.original.cost.toFixed(2)}`,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }: { row: any }) => getMaintenanceStatusBadge(row.original.status),
    },
    {
      accessorKey: 'priority',
      header: 'Priority',
      cell: ({ row }: { row: any }) => getPriorityBadge(row.original.priority),
    },
  ];

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
            <h1 className="text-3xl font-bold text-gray-900">{asset.name}</h1>
            <p className="text-gray-600 mt-1">{asset.asset_code} • {asset.brand} {asset.model}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          {asset.status === 'Available' && (
            <Button onClick={() => setShowAssignModal(true)}>
              <UserPlus className="w-4 h-4 mr-2" />
              {t('assignAsset')}
            </Button>
          )}
          {asset.status === 'Assigned' && (
            <Button variant="outline">
              <ArrowRightLeft className="w-4 h-4 mr-2" />
              {t('transferAsset')}
            </Button>
          )}
          <Button variant="outline" onClick={() => setShowMaintenanceModal(true)}>
            <Wrench className="w-4 h-4 mr-2" />
            {t('addMaintenanceLog')}
          </Button>
        </div>
      </div>

      {/* Asset Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="w-5 h-5" />
                <span>{t('assetDetails')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">{t('assetCode')}</label>
                    <p className="text-sm mt-1">{asset.asset_code}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">{t('category')}</label>
                    <p className="text-sm mt-1">{asset.category}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">{t('brand')}</label>
                    <p className="text-sm mt-1">{asset.brand}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">{t('model')}</label>
                    <p className="text-sm mt-1">{asset.model}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">{t('serialNumber')}</label>
                    <p className="text-sm mt-1">{asset.serial_number}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">{t('status')}</label>
                    <div className="mt-1">{getStatusBadge(asset.status)}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">{t('condition')}</label>
                    <div className="mt-1">{getConditionBadge(asset.condition)}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">{t('location')}</label>
                    <p className="text-sm mt-1">{asset.location}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">{t('supplier')}</label>
                    <p className="text-sm mt-1">{asset.supplier}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">{t('purchaseDate')}</label>
                    <p className="text-sm mt-1">{new Date(asset.purchase_date).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {asset.assigned_to && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Current Assignment</h4>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{asset.assigned_to.employee_name}</p>
                        <p className="text-sm text-gray-500">{asset.assigned_to.department}</p>
                        <p className="text-sm text-gray-500">Assigned: {new Date(asset.assigned_to.assigned_date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {asset.notes && (
                <>
                  <Separator />
                  <div>
                    <label className="text-sm font-medium text-gray-600">{t('notes')}</label>
                    <p className="text-sm mt-1 text-gray-700">{asset.notes}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Financial Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5" />
                <span>Financial Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">{t('purchasePrice')}</label>
                <p className="text-lg font-semibold">${asset.purchase_price.toLocaleString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">{t('currentValue')}</label>
                <p className="text-lg font-semibold text-green-600">${asset.current_value.toLocaleString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Depreciation Rate</label>
                <p className="text-sm">{(asset.depreciation_rate * 100).toFixed(1)}% annually</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">{t('warrantyExpiry')}</label>
                <p className="text-sm">{new Date(asset.warranty_expiry).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>

          {/* Maintenance Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Wrench className="w-5 h-5" />
                <span>Maintenance</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">{t('lastMaintenance')}</label>
                <p className="text-sm">{asset.last_maintenance ? new Date(asset.last_maintenance).toLocaleDateString() : 'Never'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">{t('nextMaintenance')}</label>
                <p className="text-sm">{asset.next_maintenance ? new Date(asset.next_maintenance).toLocaleDateString() : 'Not scheduled'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Maintenance Logs</label>
                <p className="text-sm">{assetMaintenanceLogs.length} records</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs for History */}
      <Tabs defaultValue="assignments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="assignments" className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span>{t('assignmentHistory')}</span>
          </TabsTrigger>
          <TabsTrigger value="maintenance" className="flex items-center space-x-2">
            <Wrench className="w-4 h-4" />
            <span>{t('maintenanceLogs')}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assignments">
          <Card>
            <CardHeader>
              <CardTitle>{t('assignmentHistory')}</CardTitle>
              <CardDescription>
                History of asset assignments and transfers
              </CardDescription>
            </CardHeader>
            <CardContent>
              {assetAssignments.length > 0 ? (
                <DataTable
                  columns={assignmentColumns}
                  data={assetAssignments}
                  searchKey="employee_name"
                />
              ) : (
                <div className="text-center py-8">
                  <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">{t('noAssignments')}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance">
          <Card>
            <CardHeader>
              <CardTitle>{t('maintenanceLogs')}</CardTitle>
              <CardDescription>
                Maintenance history and scheduled activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              {assetMaintenanceLogs.length > 0 ? (
                <DataTable
                  columns={maintenanceColumns}
                  data={assetMaintenanceLogs}
                  searchKey="description"
                />
              ) : (
                <div className="text-center py-8">
                  <Wrench className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">{t('noMaintenanceLogs')}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      {showAssignModal && (
        <AssetAssignModal
          open={showAssignModal}
          onClose={() => setShowAssignModal(false)}
          asset={asset}
          onAssign={() => {
            setShowAssignModal(false);
            // Handle assignment logic here
          }}
        />
      )}

      {showMaintenanceModal && (
        <MaintenanceModal
          open={showMaintenanceModal}
          onClose={() => setShowMaintenanceModal(false)}
          asset={asset}
          onAdd={() => {
            setShowMaintenanceModal(false);
            // Handle maintenance log addition here
          }}
        />
      )}
    </div>
  );
}
