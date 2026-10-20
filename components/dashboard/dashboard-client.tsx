"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/components/providers/language-provider";
import { useDashboard } from "@/hooks/use-dashboard";
import { DASH, fill } from "@/lib/content/dashboard";
import type { Localized } from "@/lib/content/types";
import { AttentionBanner } from "./attention-banner";
import { BottomNav } from "./bottom-nav";
import { ChildOverviewCard } from "./child-stats";
import { ChildSchedule } from "./child-schedule";
import { ChildrenDetails } from "./children-details";
import { ChildrenTab } from "./children-tab";
import { DashboardNav, isTab, type Tab } from "./dashboard-nav";
import { MyFeedback } from "./my-feedback";
import { NotificationList } from "./notification-list";
import { ProfileForm } from "./profile-form";

const PILL_CHILDREN: Localized = { en: "Children", bn: "সন্তান" };

function DashboardSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
      <Skeleton className="hidden h-64 lg:block" />
      <div className="flex flex-col gap-4">
        <Skeleton className="h-32 rounded-2xl" />
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
    window.scrollTo({ top: 0 });
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
  const totals = data
    ? {
        children: data.children.length,
        due: data.children.reduce((sum, c) => sum + c.stats.due, 0),
        completed: data.children.reduce((sum, c) => sum + c.stats.completed, 0),
      }
    : null;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 pb-28 pt-4 sm:pt-6 lg:pb-8 lg:pt-8">
        {loading ? (
          <DashboardSkeleton />
        ) : error || !data || !totals ? (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <p className="text-muted-foreground">{l(DASH.loadFailed)}</p>
            <Button type="button" onClick={() => reload()}>{l(DASH.retry)}</Button>
          </div>
        ) : (
          <div className="flex flex-col gap-5 lg:gap-6">
            {/* Header: gradient card on mobile, plain on desktop */}
            <div className="rounded-2xl bg-gradient-to-br from-primary to-teal-700 p-4 text-white shadow-md lg:rounded-none lg:bg-none lg:p-0 lg:text-foreground lg:shadow-none">
              <div className="flex items-center gap-3 lg:gap-4">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white/20 text-xl font-semibold text-white lg:bg-primary lg:text-primary-foreground">
                  {(name.trim()[0] ?? "U").toUpperCase()}
                </span>
                <div className="min-w-0">
                  <h1 className="truncate text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">
                    {fill(l(DASH.welcome), { name })}
                  </h1>
                  <p className="text-xs text-white/80 sm:text-sm lg:text-muted-foreground">{l(DASH.subtitle)}</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 lg:hidden">
                {[
                  { label: PILL_CHILDREN, value: totals.children },
                  { label: DASH.stats.due, value: totals.due },
                  { label: DASH.stats.completed, value: totals.completed },
                ].map(({ label, value }) => (
                  <div key={label.en} className="rounded-xl bg-white/15 px-3 py-2 backdrop-blur">
                    <p className="text-xl font-bold tabular-nums">{value}</p>
                    <p className="text-[11px] text-white/80">{l(label)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
              <DashboardNav value={tab} onChange={changeTab} notificationCount={data.notifications.length} />

              <div key={tab} className="bd-rise flex min-w-0 flex-col gap-4 lg:gap-5">
                <h2 className="text-lg font-semibold lg:text-xl">{l(DASH.tabs[tab])}</h2>

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

      {data && <BottomNav value={tab} onChange={changeTab} />}
    </div>
  );
}