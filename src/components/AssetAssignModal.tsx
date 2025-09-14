'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Calendar, User, Building, FileText, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { mockData } from '@/lib/mock-data';
import { Asset, Employee } from '@/types';

interface AssetAssignModalProps {
  open: boolean;
  onClose: () => void;
  asset: Asset;
  onAssign: (assignment: any) => void;
}

export function AssetAssignModal({ open, onClose, asset, onAssign }: AssetAssignModalProps) {
  const t = useTranslations('assets');
  const [step, setStep] = useState(1);
  const [assignmentType, setAssignmentType] = useState<'employee' | 'department'>('employee');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [assignmentDate, setAssignmentDate] = useState(new Date().toISOString().split('T')[0]);
  const [expectedReturnDate, setExpectedReturnDate] = useState('');
  const [notes, setNotes] = useState('');

  const employees = mockData.employees as Employee[];
  const departments = [...new Set(employees.map(emp => emp.department))];

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleAssign = () => {
    const assignment = {
      asset_id: asset.id,
      asset_code: asset.asset_code,
      asset_name: asset.name,
      assignment_type: assignmentType,
      employee_id: assignmentType === 'employee' ? parseInt(selectedEmployee) : null,
      employee_name: assignmentType === 'employee' ? employees.find(emp => emp.id === parseInt(selectedEmployee))?.name : null,
      department: assignmentType === 'department' ? selectedDepartment : employees.find(emp => emp.id === parseInt(selectedEmployee))?.department,
      assigned_date: assignmentDate,
      expected_return_date: expectedReturnDate || null,
      notes,
      assigned_by: 8, // Current user ID (Jennifer Taylor from mock data)
      assigned_by_name: 'Jennifer Taylor',
      status: 'Active'
    };

    onAssign(assignment);
  };

  const handleClose = () => {
    setStep(1);
    setAssignmentType('employee');
    setSelectedEmployee('');
    setSelectedDepartment('');
    setAssignmentDate(new Date().toISOString().split('T')[0]);
    setExpectedReturnDate('');
    setNotes('');
    onClose();
  };

  const selectedEmployeeData = selectedEmployee ? employees.find(emp => emp.id === parseInt(selectedEmployee)) : null;

  const isStepValid = () => {
    switch (step) {
      case 1:
        return assignmentType === 'employee' ? !!selectedEmployee : !!selectedDepartment;
      case 2:
        return !!assignmentDate;
      default:
        return true;
    }
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

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>{t('assignAsset')}</span>
          </DialogTitle>
          <DialogDescription>
            Assign {asset.name} ({asset.asset_code}) to an employee or department
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

          {/* Step Indicator */}
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNumber ? 'bg-primary text-primary-foreground' : 'bg-gray-200 text-gray-600'
                }`}>
                  {step > stepNumber ? <Check className="w-4 h-4" /> : stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-12 h-0.5 mx-2 ${
                    step > stepNumber ? 'bg-primary' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Step 1: Select Assignee</h3>
              
              <div className="space-y-4">
                <div>
                  <Label>Assignment Type</Label>
                  <Select value={assignmentType} onValueChange={(value: 'employee' | 'department') => setAssignmentType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="employee">Assign to Employee</SelectItem>
                      <SelectItem value="department">Assign to Department</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {assignmentType === 'employee' ? (
                  <div>
                    <Label>{t('selectEmployee')}</Label>
                    <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose an employee" />
                      </SelectTrigger>
                      <SelectContent>
                        {employees.filter(emp => emp.status === 'Active').map(employee => (
                          <SelectItem key={employee.id} value={employee.id.toString()}>
                            <div className="flex flex-col">
                              <span>{employee.name}</span>
                              <span className="text-sm text-gray-500">{employee.department} - {employee.position}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    {selectedEmployeeData && (
                      <Card className="mt-3">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{selectedEmployeeData.name}</p>
                              <p className="text-sm text-gray-500">{selectedEmployeeData.department}</p>
                              <p className="text-sm text-gray-500">{selectedEmployeeData.position}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                ) : (
                  <div>
                    <Label>{t('selectDepartment')}</Label>
                    <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map(dept => (
                          <SelectItem key={dept} value={dept}>
                            <div className="flex items-center space-x-2">
                              <Building className="w-4 h-4" />
                              <span>{dept}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Step 2: Assignment Details</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{t('assignmentDate')}</Label>
                  <Input
                    type="date"
                    value={assignmentDate}
                    onChange={(e) => setAssignmentDate(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label>{t('expectedReturnDate')} (Optional)</Label>
                  <Input
                    type="date"
                    value={expectedReturnDate}
                    onChange={(e) => setExpectedReturnDate(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <Label>{t('assignmentNotes')}</Label>
                <Textarea
                  placeholder="Add any notes about this assignment..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Step 3: Confirm Assignment</h3>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t('assignmentDetails')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Asset</Label>
                      <p className="text-sm">{asset.name} ({asset.asset_code})</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Assignee</Label>
                      <p className="text-sm">
                        {assignmentType === 'employee' && selectedEmployeeData
                          ? `${selectedEmployeeData.name} (${selectedEmployeeData.department})`
                          : selectedDepartment
                        }
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Assignment Date</Label>
                      <p className="text-sm">{new Date(assignmentDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Expected Return</Label>
                      <p className="text-sm">
                        {expectedReturnDate ? new Date(expectedReturnDate).toLocaleDateString() : 'Not specified'}
                      </p>
                    </div>
                  </div>
                  
                  {notes && (
                    <>
                      <Separator />
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Notes</Label>
                        <p className="text-sm mt-1">{notes}</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <DialogFooter>
          <div className="flex justify-between w-full">
            <div>
              {step > 1 && (
                <Button variant="outline" onClick={handlePrevious}>
                  Previous
                </Button>
              )}
            </div>
            <div className="space-x-2">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              {step < 3 ? (
                <Button onClick={handleNext} disabled={!isStepValid()}>
                  Next
                </Button>
              ) : (
                <Button onClick={handleAssign}>
                  {t('confirmAssignment')}
                </Button>
              )}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
