"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { ReportFormData } from "@/types/report";

interface ReportFormProps {
  onSubmit: (data: ReportFormData) => Promise<void>;
}

export function ReportForm({ onSubmit }: ReportFormProps) {
  const [formData, setFormData] = useState<ReportFormData>({
    weekNumber: "",
    tasks: "",
    learnings: "",
    challenges: "",
    nextWeekPlan: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    setFormData({
      weekNumber: "",
      tasks: "",
      learnings: "",
      challenges: "",
      nextWeekPlan: "",
    });
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Create New Report</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="weekNumber">Week Number</Label>
          <Input
            id="weekNumber"
            type="number"
            required
            value={formData.weekNumber}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                weekNumber: e.target.value,
              }))
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tasks">Key Tasks Performed</Label>
          <Textarea
            id="tasks"
            value={formData.tasks}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                tasks: e.target.value,
              }))
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="learnings">Key Learnings</Label>
          <Textarea
            id="learnings"
            value={formData.learnings}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                learnings: e.target.value,
              }))
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="challenges">Key Challenges</Label>
          <Textarea
            id="challenges"
            value={formData.challenges}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                challenges: e.target.value,
              }))
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nextWeekPlan">Plan for Next Week</Label>
          <Textarea
            id="nextWeekPlan"
            value={formData.nextWeekPlan}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                nextWeekPlan: e.target.value,
              }))
            }
          />
        </div>
        <Button type="submit" className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Create Report
        </Button>
      </form>
    </Card>
  );
}