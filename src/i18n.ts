import {getRequestConfig} from 'next-intl/server';

// Inline messages to avoid dynamic import issues
const messages = {
  th: {
    navigation: {
      dashboard: "แดชบอร์ด",
      employees: "พนักงาน",
      attendance: "การเข้างาน",
      leaves: "การลา",
      payroll: "เงินเดือน",
      recruitment: "การสรรหา",
      performance: "ประสิทธิภาพ",
      training: "การฝึกอบรม",
      benefits: "สวัสดิการ",
      selfService: "บริการตนเอง"
    },
    dashboard: {
      title: "แดชบอร์ด",
      subtitle: "ยินดีต้อนรับกลับ! นี่คือสิ่งที่เกิดขึ้นในองค์กรของคุณ",
      recentHires: "พนักงานใหม่ล่าสุด",
      pendingLeaves: "การลาที่รออนุมัติ",
      upcomingTrainings: "การฝึกอบรมที่จะมาถึง"
    }
  },
  en: {
    navigation: {
      dashboard: "Dashboard",
      employees: "Employees",
      attendance: "Attendance",
      leaves: "Leaves",
      payroll: "Payroll",
      recruitment: "Recruitment",
      performance: "Performance",
      training: "Training",
      benefits: "Benefits",
      selfService: "Self Service"
    },
    dashboard: {
      title: "Dashboard",
      subtitle: "Welcome back! Here's what's happening at your organization",
      recentHires: "Recent Hires",
      pendingLeaves: "Pending Leaves",
      upcomingTrainings: "Upcoming Trainings"
    }
  }
};
 
// Can be imported from a shared config
const locales = ['en', 'th'];
 
export default getRequestConfig(async ({locale}) => {
  // Debug logging
  console.log('i18n getRequestConfig called with locale:', locale);
  
  // Ensure we have a valid locale
  const validLocale = locale && locales.includes(locale) ? locale : 'th';
  
  console.log('Using validLocale:', validLocale);
  console.log('Messages keys:', Object.keys(messages[validLocale as keyof typeof messages] || messages.th));
  
  return {
    locale: validLocale,
    messages: messages[validLocale as keyof typeof messages] || messages.th
  };
});
