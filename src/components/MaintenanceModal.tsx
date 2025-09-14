'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Wrench, Calendar, User, DollarSign, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Asset } from '@/types';

interface MaintenanceModalProps {
  open: boolean;
  onClose: () => void;
  asset: Asset;
  onAdd: (maintenanceLog: Record<string, unknown>) => void;
}

export function MaintenanceModal({ open, onClose, asset, onAdd }: MaintenanceModalProps) {
  const t = useTranslations('assets');
  const [maintenanceType, setMaintenanceType] = useState<'Preventive' | 'Corrective' | 'Emergency'>('Preventive');
  const [description, setDescription] = useState('');
  const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().split('T')[0]);
  const [technician, setTechnician] = useState('');
  const [estimatedCost, setEstimatedCost] = useState('');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Medium');
  const [notes, setNotes] = useState('');
  const [partsUsed, setPartsUsed] = useState('');

  const handleSubmit = () => {
    const maintenanceLog = {
      id: Date.now(), // Mock ID generation
      asset_id: asset.id,
      asset_code: asset.asset_code,
      asset_name: asset.name,
      maintenance_type: maintenanceType,
      description,
      scheduled_date: scheduledDate,
      completed_date: null,
      technician: technician || 'IT Support Team',
      cost: parseFloat(estimatedCost) || 0,
      status: 'Scheduled' as const,
      notes,
      next_maintenance: null,
      downtime_hours: null,
      parts_used: partsUsed ? partsUsed.split(',').map(part => part.trim()) : [],
      priority
    };

    onAdd(maintenanceLog);
    handleClose();
  };

  const handleClose = () => {
    setMaintenanceType('Preventive');
    setDescription('');
    setScheduledDate(new Date().toISOString().split('T')[0]);
    setTechnician('');
    setEstimatedCost('');
    setPriority('Medium');
    setNotes('');
    setPartsUsed('');
    onClose();
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'Available': 'default',
      'Assigned': 'secondary',
      'Under Maintenance': 'destructive',
      'Disposed': 'outline'
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants] || 'default'}>{status}</Badge>;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Low': return 'text-green-600';
      case 'Medium': return 'text-yellow-600';
      case 'High': return 'text-orange-600';
      case 'Critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getMaintenanceTypeIcon = (type: string) => {
    switch (type) {
      case 'Preventive': return <Wrench className="w-4 h-4 text-blue-600" />;
      case 'Corrective': return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      case 'Emergency': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <Wrench className="w-4 h-4 text-gray-600" />;
    }
  };

  const isFormValid = () => {
    return description.trim() && scheduledDate && maintenanceType && priority;
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Wrench className="w-5 h-5" />
            <span>{t('addMaintenanceLog')}</span>
          </DialogTitle>
          <DialogDescription>
            Schedule maintenance for {asset.name} ({asset.asset_code})
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Asset Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Asset Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Asset Code</Label>
                  <p className="text-sm">{asset.asset_code}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Name</Label>
                  <p className="text-sm">{asset.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Category</Label>
                  <p className="text-sm">{asset.category}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Status</Label>
                  <div className="pt-1">{getStatusBadge(asset.status)}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Maintenance Details Form */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{t('maintenanceType')} *</Label>
                <Select value={maintenanceType} onValueChange={(value: 'Preventive' | 'Corrective' | 'Emergency') => setMaintenanceType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Preventive">
                      <div className="flex items-center space-x-2">
                        {getMaintenanceTypeIcon('Preventive')}
                        <span>Preventive</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="Corrective">
                      <div className="flex items-center space-x-2">
                        {getMaintenanceTypeIcon('Corrective')}
                        <span>Corrective</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="Emergency">
                      <div className="flex items-center space-x-2">
                        {getMaintenanceTypeIcon('Emergency')}
                        <span>Emergency</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>{t('priority')} *</Label>
                <Select value={priority} onValueChange={(value: 'Low' | 'Medium' | 'High' | 'Critical') => setPriority(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">
                      <span className={getPriorityColor('Low')}>Low Priority</span>
                    </SelectItem>
                    <SelectItem value="Medium">
                      <span className={getPriorityColor('Medium')}>Medium Priority</span>
                    </SelectItem>
                    <SelectItem value="High">
                      <span className={getPriorityColor('High')}>High Priority</span>
                    </SelectItem>
                    <SelectItem value="Critical">
                      <span className={getPriorityColor('Critical')}>Critical Priority</span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>{t('description')} *</Label>
              <Textarea
                placeholder="Describe the maintenance work to be performed..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{t('scheduledDate')} *</span>
                </Label>
                <Input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                />
              </div>

              <div>
                <Label className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4" />
                  <span>Estimated {t('cost')}</span>
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={estimatedCost}
                  onChange={(e) => setEstimatedCost(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>{t('technician')}</span>
              </Label>
              <Input
                placeholder="Technician name or service provider"
                value={technician}
                onChange={(e) => setTechnician(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">Leave blank to assign to IT Support Team</p>
            </div>

            <div>
              <Label>{t('partsUsed')}</Label>
              <Input
                placeholder="Part 1, Part 2, Part 3..."
                value={partsUsed}
                onChange={(e) => setPartsUsed(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">Separate multiple parts with commas</p>
            </div>

            <div>
              <Label>{t('notes')}</Label>
              <Textarea
                placeholder="Additional notes or special instructions..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
              />
            </div>
          </div>

          {/* Summary */}
          {isFormValid() && (
            <Card className="bg-gray-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Maintenance Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Type:</span>
                    <div className="flex items-center space-x-2 mt-1">
                      {getMaintenanceTypeIcon(maintenanceType)}
                      <span>{maintenanceType}</span>
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Priority:</span>
                    <p className={`mt-1 ${getPriorityColor(priority)}`}>{priority}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Scheduled:</span>
                    <p className="mt-1">{new Date(scheduledDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Estimated Cost:</span>
                    <p className="mt-1">${estimatedCost ? parseFloat(estimatedCost).toFixed(2) : '0.00'}</p>
                  </div>
                </div>
                {description && (
                  <div className="mt-3">
                    <span className="font-medium text-gray-600">Description:</span>
                    <p className="text-sm mt-1">{description}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <div className="flex justify-end space-x-2 w-full">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!isFormValid()}>
              {t('addMaintenanceLog')}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
