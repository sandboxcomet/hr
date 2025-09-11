// Employee types
export interface Employee {
  id: number;
  emp_code: string;
  name: string;
  email: string;
  department: string;
  position: string;
  status: string;
  hire_date: string;
  phone: string;
  address: string;
  manager_id: number | null;
  salary: number;
  avatar?: string;
}

// Leave types
export interface Leave {
  id: number;
  employee_id: number;
  employee_name: string;
  type: string;
  start_date: string;
  end_date: string;
  days: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  applied_date: string;
  approved_by: number | null;
  approved_date: string | null;
  rejection_reason?: string;
}

// Time log types
export interface TimeLog {
  id: number;
  employee_id: number;
  employee_name: string;
  date: string;
  check_in: string | null;
  check_out: string | null;
  break_duration: number;
  total_hours: number;
  overtime_hours: number;
  status: 'Present' | 'Absent' | 'Late';
}

// Payroll types
export interface Payroll {
  id: number;
  employee_id: number;
  employee_name: string;
  emp_code: string;
  month: string;
  base_salary: number;
  monthly_salary: number;
  overtime_hours: number;
  overtime_rate: number;
  overtime_pay: number;
  allowances: {
    transport: number;
    meal: number;
    mobile: number;
  };
  total_allowances: number;
  gross_pay: number;
  deductions: {
    tax: number;
    social_security: number;
    health_insurance: number;
    provident_fund: number;
  };
  total_deductions: number;
  net_pay: number;
}

// Candidate types
export interface Candidate {
  id: number;
  name: string;
  email: string;
  phone: string;
  position_applied: string;
  department: string;
  experience_years: number;
  status: 'Screening' | 'Interview Scheduled' | 'Final Interview' | 'Hired' | 'Rejected';
  applied_date: string;
  resume_url: string;
  skills: string[];
  expected_salary: number;
  interview_date: string | null;
  interviewer: string | null;
  notes: string;
}

// Performance types
export interface Performance {
  id: number;
  employee_id: number;
  employee_name: string;
  review_period: string;
  goals: {
    title: string;
    description: string;
    target_date: string;
    status: 'Completed' | 'Partially Completed' | 'Not Started';
    score: number;
  }[];
  overall_rating: number;
  technical_skills: number;
  communication: number;
  teamwork: number;
  leadership: number;
  manager_feedback: string;
  employee_feedback: string;
  reviewed_by: number;
  review_date: string;
}

// Training types
export interface Training {
  id: number;
  title: string;
  description: string;
  category: string;
  instructor: string;
  start_date: string;
  end_date: string;
  duration_hours: number;
  max_participants: number;
  location: string;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
  participants: {
    employee_id: number;
    employee_name: string;
    enrollment_date: string;
    status: 'Enrolled' | 'Attending' | 'Completed' | 'Cancelled';
  }[];
  cost_per_participant: number;
  total_cost: number;
}

// Benefits types
export interface Benefits {
  id: number;
  employee_id: number;
  employee_name: string;
  benefits: {
    type: string;
    provider: string;
    coverage: string;
    monthly_premium: number;
    employee_contribution: number;
    company_contribution: number;
    status: 'Active' | 'Inactive';
  }[];
  total_monthly_cost: number;
  employee_total_contribution: number;
  company_total_contribution: number;
}

// Dashboard KPI types
export interface DashboardKPI {
  headcount: number;
  turnover_rate: number;
  pending_leaves: number;
  trainings_this_month: number;
  payroll_processed: number;
  open_positions: number;
  avg_performance_rating: number;
  benefits_cost: number;
}
