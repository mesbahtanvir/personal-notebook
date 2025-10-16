"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type ProfileForm = {
  fullName: string;
  email: string;
  bio: string;
};

export default function ProfilePage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const { register, handleSubmit, setValue } = useForm<ProfileForm>({
    defaultValues: {
      fullName: "",
      email: "",
      bio: "",
    },
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem("profile");
      if (saved) {
        const data = JSON.parse(saved) as ProfileForm;
        Object.entries(data).forEach(([k, v]) => setValue(k as keyof ProfileForm, v as any));
      }
    } catch (e) {
      console.error("Failed to load profile:", e);
    } finally {
      setIsLoading(false);
    }
  }, [setValue]);

  const onSubmit = (data: ProfileForm) => {
    try {
      localStorage.setItem("profile", JSON.stringify(data));
      toast({ title: "Profile saved", description: "Your profile has been updated." });
    } catch (e) {
      console.error("Failed to save profile:", e);
      toast({ title: "Error", description: "Could not save profile.", variant: "destructive" });
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading profile...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Basic information about you</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="space-y-2 max-w-xl">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" placeholder="Jane Doe" {...register("fullName")} />
            </div>

            <div className="space-y-2 max-w-xl">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="jane@example.com" {...register("email")} />
            </div>

            <div className="space-y-2 max-w-2xl">
              <Label htmlFor="bio">Bio</Label>
              <textarea
                id="bio"
                className="input w-full min-h-[120px]"
                placeholder="A short bio..."
                {...register("bio")}
              />
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button type="submit">Save Profile</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
