"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/components/providers/language-provider";
import { useDashboard } from "@/hooks/use-dashboard";
import { DASH, fill } from "@/lib/content/dashboard";
import { AttentionBanner } from "./attention-banner";
import { ChildOverviewCard } from "./child-stats";
import { ChildSchedule } from "./child-schedule";
import { ChildrenDetails } from "./children-details";
import { ChildrenTab } from "./children-tab";
import { DashboardNav, isTab, type Tab } from "./dashboard-nav";
import { MyFeedback } from "./my-feedback";
import { NotificationList } from "./notification-list";
import { ProfileForm } from "./profile-form";

function DashboardSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
      <Skeleton className="h-64" />
      <div className="flex flex-col gap-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-56" />
        <Skeleton className="h-56" />
      </div>
    </div>
  );
}

export function DashboardClient() {
  const { l } = useLanguage();
  const { data, loading, error, reload } = useDashboard();

  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [tab, setTab] = useState<Tab>(isTab(tabParam) ? tabParam : "overview");
  const [focus, setFocus] = useState<{ childId: string; nonce: number } | null>(null);

  useEffect(() => {
    setTab(isTab(tabParam) ? tabParam : "overview");
  }, [tabParam]);

  function changeTab(next: Tab) {
    setTab(next);
    window.history.replaceState(null, "", next === "overview" ? "/dashboard" : `/dashboard?tab=${next}`);
  }

  function reviewChild(childId: string) {
    setFocus({ childId, nonce: Date.now() });
    changeTab("schedule");
  }

  async function afterChildAdded() {
    await reload();
    changeTab("overview");
  }

  const name = data ? (data.user.name ?? data.user.email) : "";

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
        {loading ? (
          <DashboardSkeleton />
        ) : error || !data ? (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <p className="text-muted-foreground">{l(DASH.loadFailed)}</p>
            <Button type="button" onClick={() => reload()}>{l(DASH.retry)}</Button>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-xl font-semibold text-primary-foreground">
                {(name.trim()[0] ?? "U").toUpperCase()}
              </span>
              <div className="min-w-0">
                <h1 className="truncate text-2xl font-bold tracking-tight sm:text-3xl">
                  {fill(l(DASH.welcome), { name })}
                </h1>
                <p className="text-sm text-muted-foreground">{l(DASH.subtitle)}</p>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
              <DashboardNav value={tab} onChange={changeTab} notificationCount={data.notifications.length} />

              <div className="flex min-w-0 flex-col gap-5">
                <h2 className="text-xl font-semibold">{l(DASH.tabs[tab])}</h2>

                {tab === "overview" && (
                  <>
                    {data.children.length === 0 ? (
                      <Card>
                        <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
                          <p className="font-semibold">{l(DASH.overview.emptyTitle)}</p>
                          <p className="text-sm text-muted-foreground">{l(DASH.overview.emptyText)}</p>
                          <Button type="button" onClick={() => changeTab("children")}>
                            {l(DASH.overview.addChild)}
                          </Button>
                        </CardContent>
                      </Card>
                    ) : (
                      <>
                        <AttentionBanner items={data.children} onReview={reviewChild} />
                        {data.children.map((child) => (
                          <ChildOverviewCard key={child.id} child={child} />
                        ))}
                        <Card>
                          <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg">{l(DASH.overview.reminders)}</CardTitle>
                            <Button type="button" variant="ghost" size="sm" onClick={() => changeTab("notifications")}>
                              {l(DASH.overview.viewAll)}
                            </Button>
                          </CardHeader>
                          <CardContent>
                            <NotificationList items={data.notifications} limit={3} />
                          </CardContent>
                        </Card>
                      </>
                    )}
                  </>
                )}

                {tab === "schedule" && (
                  <ChildSchedule
                    key={focus?.nonce ?? 0}
                    items={data.children}
                    onChange={reload}
                    initialChildId={focus?.childId}
                    initialStatus={focus ? "due" : "all"}
                  />
                )}

                {tab === "notifications" && (
                  <div className="flex flex-col gap-3">
                    <p className="text-sm text-muted-foreground">{l(DASH.notifications.hint)}</p>
                    <NotificationList items={data.notifications} />
                  </div>
                )}

                {tab === "children" && (
                  <ChildrenTab items={data.children} onChange={reload} onAdded={afterChildAdded} />
                )}

                {tab === "feedback" && <MyFeedback items={data.feedback} onChange={reload} />}

                {tab === "profile" && (
                  <div className="flex flex-col gap-6">
                    <ProfileForm user={data.user} onSaved={reload} />
                    <ChildrenDetails items={data.children} />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}