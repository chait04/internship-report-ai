import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export async function generateReport(weekNumber: string, userData: any, reportData: any) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
    Generate a detailed internship report in markdown format with the following structure:

    Context:
    - Week Number: ${weekNumber}
    - Student Role: ${userData.internshipRole}
    - Department: ${userData.department}
    ${parseInt(weekNumber) <= 2 ? '- Note: This is an early week, focus on basic concepts and initial learning experiences.' : '- Note: Include more advanced concepts and deeper insights.'}

    User Provided Information:
    - Tasks: ${reportData.tasks || 'Generate appropriate tasks based on the role and week'}
    - Learnings: ${reportData.learnings || 'Generate relevant learnings'}
    - Challenges: ${reportData.challenges || 'Generate realistic challenges'}
    - Next Week Plan: ${reportData.nextWeekPlan || 'Generate suitable next steps'}

    Required Format:
    1. Title should be center-aligned and bold
    2. All section headings should be bold and center-aligned
    3. Content should be professional and well-structured
    4. Include specific technical details related to ${userData.internshipRole}
    5. Format the report in two columns where appropriate
    6. Use markdown formatting for better readability
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating report:', error);
    throw error;
  }
}