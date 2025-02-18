"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { getUser, createReport, getUserReports } from "@/lib/database";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  LogOut,
  Loader2,
  FileText,
} from "lucide-react";
import { DATABASE_ID, databases, REPORTS_COLLECTION_ID } from "@/lib/appwrite";
import { ReportForm } from "./components/report-form";
import { ReportList } from "./components/report-list";
import { ProfileCard } from "./components/profile-card";
import { generateReportContent } from "@/lib/report-generator";
import { Report, ReportFormData } from "@/types/report";
import { UserProfile } from "@/types/user";
import * as Docx from "docx";
import { generatePDF } from '@/lib/pdf-generator';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.replace("/");
      return;
    }
    
    const fetchData = async () => {
      try {
        const userDoc = await getUser(user.$id);
        if (!userDoc) {
          router.replace("/onboarding");
          return;
        }
        setUserData(userDoc as unknown as UserProfile);
        const userReports = await getUserReports(user.$id);
        setReports(userReports as unknown as Report[]);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to load your data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]); // Remove router from dependencies

  const handleCreateReport = async (formData: ReportFormData) => {
    if (!user) return;

    try {      
      const report = await createReport(user.$id, formData);
      setReports((prev) => [...prev, report as unknown as Report]);
      toast({
        title: "Report created",
        description: "Your report has been successfully created.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateReport = async (reportId: string, updatedData: Partial<Report>) => {
    try {
      const updatedReport = await databases.updateDocument(
        DATABASE_ID,
        REPORTS_COLLECTION_ID,
        reportId,
        updatedData
      );
      
      setReports(reports.map(report => 
        report.$id === reportId ? { ...report, ...updatedReport } : report
      ));
      
      toast({
        title: "Report updated",
        description: "Your report has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update the report. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleExportPDF = async (report: Report) => {
    if (!userData) return;
    
    try {
      const content = await generateReportContent(report, userData);
      const blob = await generatePDF(content);
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Week${report.weekNumber}_Report.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export successful",
        description: "Your report has been exported to PDF.",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to export the report. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleExportWord = async (report: Report) => {
    if (!userData) return;
    
    try {
      const content = await generateReportContent(report, userData);
      const doc = new Docx.Document({
        sections: [{
          properties: {},
          children: [
            new Docx.Paragraph({
              text: content,
              style: 'normal'
            })
          ]
        }]
      });
      
      const blob = await Docx.Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Week${report.weekNumber}_Report.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to export the report. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6" />
            <h1 className="text-2xl font-bold">InternReport</h1>
          </div>
          <Button variant="ghost" onClick={signOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-[1fr_300px]">
          <div className="space-y-8">
            <ReportForm onSubmit={handleCreateReport} />
            <ReportList
              reports={reports}
              onUpdateReport={handleUpdateReport}
              onExportPDF={handleExportPDF}
              onExportWord={handleExportWord}
            />
          </div>
          <div>
            <ProfileCard profile={userData} />
          </div>
        </div>
      </main>
    </div>
  );
}