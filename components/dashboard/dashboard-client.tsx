"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/components/providers/language-provider";
import { useDashboard } from "@/hooks/use-dashboard";
import { DASH, fill } from "@/lib/content/dashboard";
import { ChildSchedule } from "./child-schedule";
import { ChildrenTab } from "./children-tab";
import { MyFeedback } from "./my-feedback";
import { NotificationList } from "./notification-list";
import { ProfileForm } from "./profile-form";
import { ProgressBar } from "./progress-bar";
import { StatsCards } from "./stats-cards";

function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-10 w-64" />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-28" />
        ))}
      </div>
      <Skeleton className="h-64" />
    </div>
  );
}

export function DashboardClient() {
  const { l } = useLanguage();
  const { data, loading, error, reload } = useDashboard();
  const [tab, setTab] = useState("overview");

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {loading ? (
        <DashboardSkeleton />
      ) : error || !data ? (
        <div className="flex flex-col items-center gap-4 py-20 text-center">
          <p className="text-muted-foreground">{l(DASH.loadFailed)}</p>
          <Button type="button" onClick={() => reload()}>{l(DASH.retry)}</Button>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {fill(l(DASH.welcome), { name: data.user.name ?? data.user.email })}
            </h1>
            <p className="mt-1 text-muted-foreground">{l(DASH.subtitle)}</p>
          </div>

          <Tabs value={tab} onValueChange={(v) => setTab(String(v))}>
            <div className="overflow-x-auto">
              <TabsList>
                <TabsTrigger value="overview">{l(DASH.tabs.overview)}</TabsTrigger>
                <TabsTrigger value="schedule">{l(DASH.tabs.schedule)}</TabsTrigger>
                <TabsTrigger value="notifications">
                  {l(DASH.tabs.notifications)}
                  {data.notifications.length > 0 && (
                    <Badge variant="destructive" className="ml-1.5 px-1.5 py-0">
                      {data.notifications.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="children">{l(DASH.tabs.children)}</TabsTrigger>
                <TabsTrigger value="feedback">{l(DASH.tabs.feedback)}</TabsTrigger>
                <TabsTrigger value="profile">{l(DASH.tabs.profile)}</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview" className="mt-6 flex flex-col gap-6">
              {data.children.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
                    <p className="font-semibold">{l(DASH.overview.emptyTitle)}</p>
                    <p className="text-sm text-muted-foreground">{l(DASH.overview.emptyText)}</p>
                    <Button type="button" onClick={() => setTab("children")}>{l(DASH.overview.addChild)}</Button>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <StatsCards summary={data.summary} />

                  <div className="grid gap-6 lg:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">{l(DASH.overview.progress)}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                          <ProgressBar value={data.summary.percent} />
                          <p className="text-xs text-muted-foreground">
                            {fill(l(DASH.overview.doses), { done: data.summary.completed, total: data.summary.total })} ({data.summary.percent}%)
                          </p>
                        </div>
                        <p className="text-sm font-medium">{l(DASH.overview.childProgress)}</p>
                        {data.children.map((c) => (
                          <div key={c.id} className="flex flex-col gap-1.5">
                            <div className="flex justify-between text-sm">
                              <span>{c.name}</span>
                              <span className="text-muted-foreground">{c.stats.percent}%</span>
                            </div>
                            <ProgressBar value={c.stats.percent} />
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg">{l(DASH.overview.reminders)}</CardTitle>
                        <Button type="button" variant="ghost" size="sm" onClick={() => setTab("notifications")}>
                          {l(DASH.overview.viewAll)}
                        </Button>
                      </CardHeader>
                      <CardContent>
                        <NotificationList items={data.notifications} limit={3} />
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}
            </TabsContent>

            <TabsContent value="schedule" className="mt-6">
              <ChildSchedule items={data.children} onChange={reload} />
            </TabsContent>

            <TabsContent value="notifications" className="mt-6 flex flex-col gap-3">
              <p className="text-sm text-muted-foreground">{l(DASH.notifications.hint)}</p>
              <NotificationList items={data.notifications} />
            </TabsContent>

            <TabsContent value="children" className="mt-6">
              <ChildrenTab items={data.children} onChange={reload} />
            </TabsContent>

            <TabsContent value="feedback" className="mt-6">
              <MyFeedback items={data.feedback} onChange={reload} />
            </TabsContent>

            <TabsContent value="profile" className="mt-6">
              <ProfileForm user={data.user} onSaved={reload} />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}