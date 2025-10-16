"use client";

import SummaryPanel from "@/components/SummaryPanel";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
          <CardDescription>Overview of your day at a glance</CardDescription>
        </CardHeader>
        <CardContent>
          <SummaryPanel />
        </CardContent>
      </Card>
    </div>
  );
}
