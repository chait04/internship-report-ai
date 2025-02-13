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

  useEffect(() => {
    const checkUserProfile = async () => {
      if (!loading && user) {
        try {
          const userProfile = await getUser(user.$id);
          if (userProfile) {
            console.log('User profile exists, redirecting to dashboard');
            router.replace('/dashboard');
            return;
          }
        } catch (error) {
          console.error('Error checking user profile:', error);
        }
      } else if (!loading && !user) {
        console.log('No user in onboarding, redirecting to home');
        router.replace('/');
      }
    };

    checkUserProfile();
  }, [user, loading, router]);

  // Remove duplicate checks
  if (!loading && !user) {
    console.log('No user in onboarding, redirecting to home');
    router.replace('/');
  }
  
  const [formData, setFormData] = useState({
    prnNumber: "",
    department: "",
    fullName: "", // Will be updated when user data is available
    studentMentor: "",
    internshipRole: "",
    additionalRole: "",
  });

  useEffect(() => {
    if (user?.name) {
      console.log('Pre-filling user data:', user.name);
      setFormData(prev => ({
        ...prev,
        fullName: user.name
      }));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      console.log('No user found in onboarding');
      return;
    }

    try {
      console.log('Creating user profile with data:', {
        userId: user.$id,
        ...formData,
        email: user.email
      });
      
      const userData = {
        ...formData,
        email: user.email,
      };
      
      const result = await createUser(user.$id, userData);
      console.log('User profile created:', result);
      
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