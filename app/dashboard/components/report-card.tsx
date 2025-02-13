"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileDown, FileText } from "lucide-react";
import { Report } from "@/types/report";
import { UserProfile } from "@/types/user";

interface ReportCardProps {
  report: Report;
  onUpdate: (reportId: string, data: Partial<Report>) => Promise<void>;
  onExportPDF: (report: Report) => Promise<void>;
  onExportWord: (report: Report) => Promise<void>;
}

export function ReportCard({ report, onUpdate, onExportPDF, onExportWord }: ReportCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedReport, setEditedReport] = useState(report);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdate(report.$id!, editedReport);
    setIsEditing(false);
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold">Week {report.weekNumber}</h3>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => onExportPDF(report)}>
            <FileDown className="h-4 w-4 mr-2" />
            PDF
          </Button>
          <Button size="sm" variant="outline" onClick={() => onExportWord(report)}>
            <FileText className="h-4 w-4 mr-2" />
            DOCX
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Key Tasks</Label>
              <Textarea
                value={editedReport.tasks}
                onChange={(e) => setEditedReport({ ...editedReport, tasks: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Learnings</Label>
              <Textarea
                value={editedReport.learnings}
                onChange={(e) => setEditedReport({ ...editedReport, learnings: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Challenges</Label>
              <Textarea
                value={editedReport.challenges}
                onChange={(e) => setEditedReport({ ...editedReport, challenges: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Next Week&apos;s Plan</Label>
              <Textarea
                value={editedReport.nextWeekPlan}
                onChange={(e) => setEditedReport({ ...editedReport, nextWeekPlan: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit">Save Changes</Button>
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <>
            {report.tasks && (
              <div>
                <h4 className="font-medium mb-2">Key Tasks</h4>
                <p className="text-muted-foreground">{report.tasks}</p>
              </div>
            )}
            {report.learnings && (
              <div>
                <h4 className="font-medium mb-2">Learnings</h4>
                <p className="text-muted-foreground">{report.learnings}</p>
              </div>
            )}
            {report.challenges && (
              <div>
                <h4 className="font-medium mb-2">Challenges</h4>
                <p className="text-muted-foreground">{report.challenges}</p>
              </div>
            )}
            {report.nextWeekPlan && (
              <div>
                <h4 className="font-medium mb-2">Next Week&apos;s Plan</h4>
                <p className="text-muted-foreground">{report.nextWeekPlan}</p>
              </div>
            )}
            <Button variant="outline" onClick={() => setIsEditing(true)} className="mt-4">
              Edit Report
            </Button>
          </>
        )}
      </div>
    </Card>
  );
}