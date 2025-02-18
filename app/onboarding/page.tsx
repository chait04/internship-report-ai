"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { createUser, getUser } from "@/lib/database";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function Onboarding() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    prnNumber: "",
    department: "",
    fullName: "",
    studentMentor: "",
    internshipRole: "",
    additionalRole: "",
  });

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/');
        return;
      }

      const checkUserProfile = async () => {
        try {
          const userProfile = await getUser(user.$id);
          if (userProfile) {
            router.replace('/dashboard');
          } else if (user.name) {
            setFormData(prev => ({
              ...prev,
              fullName: user.name
            }));
          }
        } catch (error) {
          console.error('Error checking user profile:', error);
        }
      };

      checkUserProfile();
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {      
      const userData = {
        ...formData,
        email: user.email,
      };
      
      await createUser(user.$id, userData);
      
      toast({
        title: "Profile created",
        description: "Your profile has been successfully created.",
      });
      router.push("/dashboard");
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-8">
      <Card className="max-w-2xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Complete Your Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="prnNumber">PRN Number</Label>
              <Input
                id="prnNumber"
                name="prnNumber"
                required
                value={formData.prnNumber}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                name="department"
                required
                value={formData.department}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="studentMentor">Student Mentor</Label>
              <Input
                id="studentMentor"
                name="studentMentor"
                required
                value={formData.studentMentor}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="internshipRole">Internship Role and Field</Label>
              <Input
                id="internshipRole"
                name="internshipRole"
                required
                value={formData.internshipRole}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="additionalRole">Additional Role (Optional)</Label>
              <Input
                id="additionalRole"
                name="additionalRole"
                value={formData.additionalRole}
                onChange={handleChange}
              />
            </div>
          </div>
          <Button type="submit" className="w-full">
            Complete Profile
          </Button>
        </form>
      </Card>
    </div>
  );
}