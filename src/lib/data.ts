import { promises as fs } from 'fs';
import path from 'path';
import { mockData } from './mock-data';
import type {
  Employee,
  Leave,
  TimeLog,
  Payroll,
  Candidate,
  Performance,
  Training,
  Benefits,
  DashboardKPI,
} from '@/types';

const dataDir = path.join(process.cwd(), 'mock');

export async function getEmployees(): Promise<Employee[]> {
  try {
    const filePath = path.join(dataDir, 'employees.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Error reading employees data:', error);
    return [];
  }
}

export async function getLeaves(): Promise<Leave[]> {
  try {
    const filePath = path.join(dataDir, 'leaves.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Error reading leaves data:', error);
    return [];
  }
}

export async function getTimeLogs(): Promise<TimeLog[]> {
  try {
    const filePath = path.join(dataDir, 'time_logs.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Error reading time logs data:', error);
    return [];
  }
}

export async function getPayroll(): Promise<Payroll[]> {
  try {
    const filePath = path.join(dataDir, 'payroll.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Error reading payroll data:', error);
    return [];
  }
}

export async function getCandidates(): Promise<Candidate[]> {
  try {
    const filePath = path.join(dataDir, 'candidates.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Error reading candidates data:', error);
    return [];
  }
}

export async function getPerformance(): Promise<Performance[]> {
  try {
    const filePath = path.join(dataDir, 'performance.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Error reading performance data:', error);
    return [];
  }
}

export async function getTrainings(): Promise<Training[]> {
  try {
    const filePath = path.join(dataDir, 'trainings.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Error reading trainings data:', error);
    return [];
  }
}

export async function getBenefits(): Promise<Benefits[]> {
  try {
    const filePath = path.join(dataDir, 'benefits.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Error reading benefits data:', error);
    return [];
  }
}

export async function getDashboardKPIs(): Promise<DashboardKPI> {
  try {
    const [employees, leaves, trainings, payroll, candidates, performance, benefits] = await Promise.all([
      getEmployees(),
      getLeaves(),
      getTrainings(),
      getPayroll(),
      getCandidates(),
      getPerformance(),
      getBenefits(),
    ]);

    const activeEmployees = employees.filter(emp => emp.status === 'Active');
    const pendingLeaves = leaves.filter(leave => leave.status === 'Pending');
    const activeTrainings = trainings.filter(training => training.status === 'Scheduled' || training.status === 'In Progress');
    const totalPayroll = payroll.reduce((sum, p) => sum + p.net_pay, 0);
    const openPositions = candidates.filter(c => c.status !== 'Hired' && c.status !== 'Rejected').length;
    const avgRating = performance.reduce((sum, p) => sum + p.overall_rating, 0) / performance.length;
    const totalBenefitsCost = benefits.reduce((sum, b) => sum + b.total_monthly_cost, 0);

    return {
      headcount: activeEmployees.length,
      turnover_rate: 8.5,
      pending_leaves: pendingLeaves.length,
      trainings_this_month: activeTrainings.length,
      payroll_processed: totalPayroll,
      open_positions: openPositions,
      avg_performance_rating: avgRating || 4.2,
      benefits_cost: totalBenefitsCost,
    };
  } catch (error) {
    console.error('Error calculating dashboard KPIs:', error);
    return {
      headcount: 0,
      turnover_rate: 0,
      pending_leaves: 0,
      trainings_this_month: 0,
      payroll_processed: 0,
      open_positions: 0,
      avg_performance_rating: 0,
      benefits_cost: 0,
    };
  }
}

export async function getEmployee(id: number): Promise<Employee | null> {
  const employees = await getEmployees();
  return employees.find(emp => emp.id === id) || null;
}

// Client-side data functions that work in browser
export function getEmployeesClient(): Employee[] {
  return mockData.employees as Employee[];
}

export function getLeavesClient(): Leave[] {
  return mockData.leaves as Leave[];
}

export function getTimeLogsClient(): TimeLog[] {
  return mockData.timeLogs as TimeLog[];
}

export function getPayrollClient(): Payroll[] {
  return mockData.payroll as Payroll[];
}

export function getCandidatesClient(): Candidate[] {
  return mockData.candidates as Candidate[];
}

export function getPerformanceClient(): Performance[] {
  return mockData.performance as Performance[];
}

export function getTrainingsClient(): Training[] {
  return mockData.trainings as Training[];
}

export function getBenefitsClient(): Benefits[] {
  return mockData.benefits as Benefits[];
}
