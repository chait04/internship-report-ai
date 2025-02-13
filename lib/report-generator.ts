import { generateReport } from './gemini';
import { Report } from '@/types/report';
import { UserProfile } from '@/types/user';
import { marked } from 'marked';

export async function generateReportContent(report: Report, userData: UserProfile) {
  try {
    // If minimal information is provided, use AI to generate content
    const shouldUseAI = !report.tasks || !report.learnings || !report.challenges || !report.nextWeekPlan;
    
    if (shouldUseAI) {
      const aiContent = await generateReport(report.weekNumber, userData, report);
      return aiContent;
    }

    // If detailed information is provided, format it in markdown
    return `
# Internship Report - Week ${report.weekNumber}

## Student Information
- **Name:** ${userData.fullName}
- **PRN Number:** ${userData.prnNumber}
- **Department:** ${userData.department}
- **Student Mentor:** ${userData.studentMentor}
- **Role:** ${userData.internshipRole}

## Key Tasks Performed
${report.tasks}

## Key Learnings
${report.learnings}

## Challenges & Solutions
${report.challenges}

## Plan for Next Week
${report.nextWeekPlan}
    `;
  } catch (error) {
    console.error('Error generating report content:', error);
    throw error;
  }
}

export function convertMarkdownToHTML(markdown: string) {
  return marked(markdown);
}