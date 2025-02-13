"use client";

import { Report } from "@/types/report";
import { UserProfile } from "@/types/user";
import { ReportCard } from "./report-card";

interface ReportListProps {
  reports: Report[];
  onUpdateReport: (reportId: string, data: Partial<Report>) => Promise<void>;
  onExportPDF: (report: Report) => Promise<void>;
  onExportWord: (report: Report) => Promise<void>;
}

export function ReportList({
  reports,
  onUpdateReport,
  onExportPDF,
  onExportWord,
}: ReportListProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Your Reports</h2>
      {reports.length === 0 ? (
        <div className="text-center p-8 text-muted-foreground">
          No reports yet. Create your first report!
        </div>
      ) : (
        <div className="space-y-4">
          {reports
            .sort((a, b) => parseInt(b.weekNumber) - parseInt(a.weekNumber))
            .map((report) => (
              <ReportCard
                key={report.$id}
                report={report}
                onUpdate={onUpdateReport}
                onExportPDF={onExportPDF}
                onExportWord={onExportWord}
              />
            ))}
        </div>
      )}
    </div>
  );
}