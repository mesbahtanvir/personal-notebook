"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

type SettingsFormValues = {
  allowBackgroundProcessing: boolean;
  openaiApiKey: string;
  theme: 'light' | 'dark' | 'system';
  notificationEnabled: boolean;
  autoSave: boolean;
};

export default function SettingsPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const { register, handleSubmit, setValue, watch } = useForm<SettingsFormValues>({
    defaultValues: {
      allowBackgroundProcessing: false,
      openaiApiKey: '',
      theme: 'system',
      notificationEnabled: true,
      autoSave: true,
    },
  });

  // Load saved settings from localStorage on component mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('appSettings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        Object.entries(parsedSettings).forEach(([key, value]) => {
          setValue(key as keyof SettingsFormValues, value as any);
        });
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setIsLoading(false);
    }
  }, [setValue]);

  const onSubmit = (data: SettingsFormValues) => {
    try {
      // Save to localStorage
      localStorage.setItem('appSettings', JSON.stringify(data));
      
      // Apply settings
      if (data.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else if (data.theme === 'light') {
        document.documentElement.classList.remove('dark');
      } else {
        // System preference
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }

      toast({
        title: 'Settings saved',
        description: 'Your settings have been saved successfully.',
      });
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save settings. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const allowBackgroundProcessing = watch('allowBackgroundProcessing');
  const notificationEnabled = watch('notificationEnabled');
  const autoSave = watch('autoSave');
  const theme = watch('theme');

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading settings...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>Manage your application preferences</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            {/* Background Processing */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="allowBackgroundProcessing">Background Processing</Label>
                <p className="text-sm text-muted-foreground">
                  Enable to allow the app to process data in the background
                </p>
              </div>
              <Switch
                id="allowBackgroundProcessing"
                checked={allowBackgroundProcessing}
                onCheckedChange={(checked) => setValue('allowBackgroundProcessing', checked)}
              />
            </div>

            {/* OpenAI API Key */}
            <div className="space-y-2">
              <Label htmlFor="openaiApiKey">OpenAI API Key</Label>
              <Input
                id="openaiApiKey"
                type="password"
                placeholder="sk-..."
                {...register('openaiApiKey')}
                className="max-w-md"
              />
              <p className="text-sm text-muted-foreground">
                Your API key is stored locally and never sent to our servers
              </p>
            </div>

            {/* Theme Selection */}
            <div className="space-y-2">
              <Label>Theme</Label>
              <div className="flex space-x-4">
                {(['light', 'dark', 'system'] as const).map((option) => (
                  <label key={option} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      className="h-4 w-4"
                      checked={theme === option}
                      onChange={() => setValue('theme', option)}
                    />
                    <span className="capitalize">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Notifications */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notificationEnabled">Enable Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications for important updates
                </p>
              </div>
              <Switch
                id="notificationEnabled"
                checked={notificationEnabled}
                onCheckedChange={(checked) => setValue('notificationEnabled', checked)}
              />
            </div>

            {/* Auto Save */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="autoSave">Auto Save</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically save changes
                </p>
              </div>
              <Switch
                id="autoSave"
                checked={autoSave}
                onCheckedChange={(checked) => setValue('autoSave', checked)}
              />
            </div>
          </CardContent>
          
          <CardFooter className="border-t px-6 py-4">
            <Button type="submit">Save Changes</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
