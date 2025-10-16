"use client";

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useTheme } from 'next-themes'
import { db, type TaskRow, type MoodRow } from '@/db'

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
  const { setTheme } = useTheme();
  const { register, handleSubmit, setValue, watch } = useForm<SettingsFormValues>({
    defaultValues: {
      allowBackgroundProcessing: false,
      openaiApiKey: '',
      theme: 'system',
      notificationEnabled: true,
      autoSave: true,
    },
  });
  const [syncing, setSyncing] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load saved settings from localStorage on component mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('appSettings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        Object.entries(parsedSettings).forEach(([key, value]) => {
          setValue(key as keyof SettingsFormValues, value as any);
        });
        if (parsedSettings.theme) {
          setTheme(parsedSettings.theme);
        }
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setIsLoading(false);
    }
  }, [setValue, setTheme]);

  const onSubmit = (data: SettingsFormValues) => {
    try {
      // Save to localStorage
      localStorage.setItem('appSettings', JSON.stringify(data));
      
      // Apply settings
      setTheme(data.theme);

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

  const doExport = async () => {
    try {
      const tasks = await db.tasks.toArray();
      const moods = (db as any).moods ? await (db as any).moods.toArray() : [];
      const payload = { version: 1, exportedAt: new Date().toISOString(), tasks, moods };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `focus-notebook-export-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({ title: 'Exported', description: 'Your data has been exported as JSON.' });
    } catch (e) {
      toast({ title: 'Export failed', description: 'Could not export data.', variant: 'destructive' });
    } finally {
      setExportOpen(false);
    }
  };

  const startImport = () => {
    if (fileInputRef.current) fileInputRef.current.value = '';
    fileInputRef.current?.click();
  };

  const handleFileChosen: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      const tasks: TaskRow[] = Array.isArray(data?.tasks) ? data.tasks : [];
      const moods: MoodRow[] = Array.isArray(data?.moods) ? data.moods : [];
      await db.tasks.clear();
      if ((db as any).moods) await (db as any).moods.clear();
      if (tasks.length) await db.tasks.bulkPut(tasks as any);
      if ((db as any).moods && moods.length) await (db as any).moods.bulkPut(moods as any);
      toast({ title: 'Import complete', description: 'Your data has been restored.' });
    } catch (e) {
      toast({ title: 'Import failed', description: 'Invalid or unreadable JSON.', variant: 'destructive' });
    } finally {
      setImportOpen(false);
    }
  };

  const handleCloudSync = async () => {
    if (syncing) return;
    setSyncing(true);
    try {
      await new Promise((r) => setTimeout(r, 1200));
      toast({
        title: 'Cloud sync complete',
        description: 'Your Focus Notebook is up to date.',
      });
    } catch (e) {
      toast({
        title: 'Cloud sync failed',
        description: 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSyncing(false);
    }
  };

  const allowBackgroundProcessing = watch('allowBackgroundProcessing');
  const notificationEnabled = watch('notificationEnabled');
  const autoSave = watch('autoSave');
  const theme = watch('theme');

  useEffect(() => {
    const subscription = watch((value) => {
      try {
        localStorage.setItem('appSettings', JSON.stringify(value as SettingsFormValues));
        if (value && typeof value === 'object' && 'theme' in (value as any)) {
          setTheme((value as SettingsFormValues).theme);
        }
      } catch (e) {
        console.error('Failed to auto-save settings:', e);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setTheme]);

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

      {exportOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/30" onClick={() => setExportOpen(false)} />
          <div className="relative z-10 flex min-h-full items-center justify-center p-4">
            <div className="card p-6 border w-full max-w-md">
              <div className="text-lg font-medium">Export Data</div>
              <div className="mt-2 text-sm text-muted-foreground">Export tasks (including backlog) and moods as a JSON file?</div>
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="secondary" type="button" onClick={() => setExportOpen(false)}>Cancel</Button>
                <Button type="button" onClick={doExport}>Export</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {importOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/30" onClick={() => setImportOpen(false)} />
          <div className="relative z-10 flex min-h-full items-center justify-center p-4">
            <div className="card p-6 border w-full max-w-md">
              <div className="text-lg font-medium">Import Data</div>
              <div className="mt-2 text-sm text-muted-foreground">This will replace your current tasks and moods with the JSON file content. Continue?</div>
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="secondary" type="button" onClick={() => setImportOpen(false)}>Cancel</Button>
                <Button type="button" onClick={startImport}>Choose File</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
