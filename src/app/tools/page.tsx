"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const TOOLS = [
  {
    key: "brainstorming",
    title: "Brainstorming",
    description: "Generate ideas quickly and capture them.",
  },
  {
    key: "cbt",
    title: "CBT",
    description: "Cognitive Behavioral Therapy worksheets and prompts.",
  },
];

export default function ToolsPage() {
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Tools</CardTitle>
          <CardDescription>Explore built-in tools to enhance your workflow</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TOOLS.map((tool) => (
              <div key={tool.key} className="card p-4 border">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-medium">{tool.title}</div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {tool.description}
                    </p>
                  </div>
                  <Button size="sm">Open</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
