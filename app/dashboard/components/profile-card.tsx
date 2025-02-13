"use client";

import { Card } from "@/components/ui/card";
import { UserProfile } from "@/types/user";

interface ProfileCardProps {
  profile: UserProfile;
}

export function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
      <div className="space-y-2">
        <div>
          <p className="text-sm text-muted-foreground">Full Name</p>
          <p className="font-medium">{profile.fullName}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">PRN Number</p>
          <p className="font-medium">{profile.prnNumber}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Department</p>
          <p className="font-medium">{profile.department}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Student Mentor</p>
          <p className="font-medium">{profile.studentMentor}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Internship Role</p>
          <p className="font-medium">{profile.internshipRole}</p>
        </div>
        {profile.additionalRole && (
          <div>
            <p className="text-sm text-muted-foreground">Additional Role</p>
            <p className="font-medium">{profile.additionalRole}</p>
          </div>
        )}
      </div>
    </Card>
  );
}