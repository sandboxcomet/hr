'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Payroll } from '@/types';
import { Building, User, Calendar, DollarSign, Download, Printer } from 'lucide-react';

interface PayrollCardProps {
  payroll: Payroll;
  onPrint?: () => void;
  onDownload?: () => void;
}

export function PayrollCard({ payroll, onPrint, onDownload }: PayrollCardProps) {
  const formatCurrency = (amount: number) => `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

  return (
    <Card className="rounded-2xl border-gray-200 shadow-sm max-w-2xl mx-auto print:shadow-none print:border-0">
      <CardHeader className="text-center border-b bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Building className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-bold text-gray-900">Company Name</h2>
        </div>
        <CardTitle className="text-2xl text-primary">Salary Slip</CardTitle>
        <p className="text-gray-600">{payroll.month}</p>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {/* Employee Information */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">Employee Name</span>
            </div>
            <div className="font-semibold text-gray-900">{payroll.employee_name}</div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">Employee ID</span>
            </div>
            <div className="font-semibold text-gray-900">{payroll.emp_code}</div>
          </div>
        </div>

        <Separator />

        {/* Earnings */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
            <DollarSign className="w-4 h-4 mr-2 text-green-600" />
            Earnings
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Basic Salary</span>
              <span className="font-medium">{formatCurrency(payroll.monthly_salary)}</span>
            </div>
            {payroll.overtime_hours > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">
                  Overtime ({payroll.overtime_hours}h @ ${payroll.overtime_rate}/h)
                </span>
                <span className="font-medium">{formatCurrency(payroll.overtime_pay)}</span>
              </div>
            )}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-600">Transport Allowance</span>
                <span className="font-medium">{formatCurrency(payroll.allowances.transport)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Meal Allowance</span>
                <span className="font-medium">{formatCurrency(payroll.allowances.meal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Mobile Allowance</span>
                <span className="font-medium">{formatCurrency(payroll.allowances.mobile)}</span>
              </div>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-semibold text-green-600">
              <span>Total Earnings</span>
              <span>{formatCurrency(payroll.gross_pay)}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Deductions */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
            <DollarSign className="w-4 h-4 mr-2 text-red-600" />
            Deductions
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Income Tax</span>
              <span className="font-medium">{formatCurrency(payroll.deductions.tax)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Social Security</span>
              <span className="font-medium">{formatCurrency(payroll.deductions.social_security)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Health Insurance</span>
              <span className="font-medium">{formatCurrency(payroll.deductions.health_insurance)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Provident Fund</span>
              <span className="font-medium">{formatCurrency(payroll.deductions.provident_fund)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-semibold text-red-600">
              <span>Total Deductions</span>
              <span>{formatCurrency(payroll.total_deductions)}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Net Pay */}
        <div className="bg-primary/10 p-4 rounded-xl">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900">Net Pay</span>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">
                {formatCurrency(payroll.net_pay)}
              </div>
              <Badge variant="default" className="mt-1">
                Take Home
              </Badge>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center space-x-3 print:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={onPrint}
            className="rounded-xl"
          >
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onDownload}
            className="rounded-xl"
          >
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 border-t pt-4">
          <p>This is a computer-generated salary slip and does not require a signature.</p>
          <p className="mt-1">Generated on {new Date().toLocaleDateString()}</p>
        </div>
      </CardContent>
    </Card>
  );
}
