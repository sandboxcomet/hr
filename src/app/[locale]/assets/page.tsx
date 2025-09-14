'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Search, Filter, Eye, UserPlus, ArrowUpDown, Package, DollarSign, Wrench, AlertTriangle, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DataTable } from '@/components/DataTable';
import { KpiCards } from '@/components/KpiCards';
import { AssetAssignModal } from '@/components/AssetAssignModal';
import { mockData } from '@/lib/mock-data';
import { Asset } from '@/types';

export default function AssetsPage() {
  const t = useTranslations('assets');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [conditionFilter, setConditionFilter] = useState('all');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  const assets = mockData.assets as Asset[];

  // Calculate KPIs
  const kpiData = useMemo(() => {
    const totalAssets = assets.length;
    const assignedAssets = assets.filter(asset => asset.status === 'Assigned').length;
    const availableAssets = assets.filter(asset => asset.status === 'Available').length;
    const underMaintenance = assets.filter(asset => asset.status === 'Under Maintenance').length;
    const totalValue = assets.reduce((sum, asset) => sum + asset.current_value, 0);
    
    // Calculate upcoming maintenance (next 30 days)
    const today = new Date();
    const nextMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    const upcomingMaintenance = assets.filter(asset => {
      if (!asset.next_maintenance) return false;
      const maintenanceDate = new Date(asset.next_maintenance);
      return maintenanceDate >= today && maintenanceDate <= nextMonth;
    }).length;

    return [
      {
        title: t('totalAssets'),
        value: totalAssets.toString(),
        description: 'All assets in system',
        icon: Package,
        trend: { value: 0, label: 'No change' }
      },
      {
        title: t('assignedAssets'),
        value: assignedAssets.toString(),
        description: `${((assignedAssets / totalAssets) * 100).toFixed(1)}% of total assets`,
        icon: UserPlus,
        trend: { value: 0, label: 'No change' }
      },
      {
        title: t('totalValue'),
        value: `$${totalValue.toLocaleString()}`,
        description: 'Current depreciated value',
        icon: DollarSign,
        trend: { value: 0, label: 'No change' }
      },
      {
        title: t('upcomingMaintenance'),
        value: upcomingMaintenance.toString(),
        description: 'Next 30 days',
        icon: upcomingMaintenance > 0 ? AlertTriangle : Wrench,
        trend: { value: 0, label: 'No change' }
      }
    ];
  }, [assets, t]);

  // Filter and search assets
  const filteredAssets = useMemo(() => {
    return assets.filter(asset => {
      const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           asset.asset_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           asset.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           asset.model.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = categoryFilter === 'all' || asset.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || asset.status === statusFilter;
      const matchesCondition = conditionFilter === 'all' || asset.condition === conditionFilter;

      return matchesSearch && matchesCategory && matchesStatus && matchesCondition;
    });
  }, [assets, searchTerm, categoryFilter, statusFilter, conditionFilter]);

  // Get unique filter options
  const categories = [...new Set(assets.map(asset => asset.category))];
  const statuses = [...new Set(assets.map(asset => asset.status))];
  const conditions = [...new Set(assets.map(asset => asset.condition))];

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

  const handleAssignAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setShowAssignModal(true);
  };

  const columns = [
    {
      accessorKey: 'asset_code',
      header: t('assetCode'),
    },
    {
      accessorKey: 'name',
      header: t('assetName'),
      cell: ({ row }: { row: any }) => (
        <div>
          <div className="font-medium">{row.original.name}</div>
          <div className="text-sm text-gray-500">{row.original.brand} {row.original.model}</div>
        </div>
      ),
    },
    {
      accessorKey: 'category',
      header: t('category'),
    },
    {
      accessorKey: 'status',
      header: t('status'),
      cell: ({ row }: { row: any }) => getStatusBadge(row.original.status),
    },
    {
      accessorKey: 'condition',
      header: t('condition'),
      cell: ({ row }: { row: any }) => getConditionBadge(row.original.condition),
    },
    {
      accessorKey: 'assigned_to',
      header: t('assignedTo'),
      cell: ({ row }: { row: any }) => (
        <div>
          {row.original.assigned_to ? (
            <>
              <div className="font-medium">{row.original.assigned_to.employee_name}</div>
              <div className="text-sm text-gray-500">{row.original.assigned_to.department}</div>
            </>
          ) : (
            <span className="text-gray-400">-</span>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'current_value',
      header: t('currentValue'),
      cell: ({ row }: { row: any }) => `$${row.original.current_value.toLocaleString()}`,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: { row: any }) => (
        <div className="flex items-center space-x-2">
          <Link href={`/assets/${row.original.id}`}>
            <Button variant="ghost" size="sm">
              <Eye className="w-4 h-4" />
            </Button>
          </Link>
          {row.original.status === 'Available' && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => handleAssignAsset(row.original)}
            >
              <UserPlus className="w-4 h-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
          <p className="text-gray-600 mt-2">{t('subtitle')}</p>
        </div>
        <div className="flex space-x-2">
          <Link href="/assets/reports">
            <Button variant="outline">
              <BarChart3 className="w-4 h-4 mr-2" />
              {t('quickReports')}
            </Button>
          </Link>
          <Button>
            <Package className="w-4 h-4 mr-2" />
            {t('addAsset')}
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <KpiCards data={kpiData} />

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder={t('searchAssets')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder={t('filterByCategory')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('allCategories')}</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder={t('filterByStatus')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('allStatuses')}</SelectItem>
                  {statuses.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={conditionFilter} onValueChange={setConditionFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder={t('filterByCondition')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('allConditions')}</SelectItem>
                  {conditions.map(condition => (
                    <SelectItem key={condition} value={condition}>{condition}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filteredAssets}
            searchKey="name"
          />
        </CardContent>
      </Card>

      {/* Asset Assignment Modal */}
      {selectedAsset && (
        <AssetAssignModal
          open={showAssignModal}
          onClose={() => {
            setShowAssignModal(false);
            setSelectedAsset(null);
          }}
          asset={selectedAsset}
          onAssign={() => {
            // Handle assignment logic here
            setShowAssignModal(false);
            setSelectedAsset(null);
          }}
        />
      )}
    </div>
  );
}
