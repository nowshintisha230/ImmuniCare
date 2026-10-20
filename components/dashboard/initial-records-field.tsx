"use client";

import { Check, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { useLanguage } from "@/components/providers/language-provider";
import { DASH, fill } from "@/lib/content/dashboard";
import type { Localized } from "@/lib/content/types";
import { VACCINES, type VaccineKey } from "@/lib/content/vaccine-info";
import { VACCINE_ORDER, VACCINE_TYPE } from "@/lib/vaccination/doses";
import { dosesOfVaccine, type RecordInput } from "@/lib/vaccination/records";
import { cn } from "@/lib/utils";

export type RecordRow = { id: number; vaccine: VaccineKey | ""; dose: string; date: string };
export type RecordsValue = { enabled: boolean; rows: RecordRow[] };

export const EMPTY_RECORDS: RecordsValue = { enabled: false, rows: [] };

const PICK_FIRST: Localized = {
  en: "Select a vaccine first",
  bn: "আগে টিকা বেছে নিন",
};

const newRow = (rows: RecordRow[]): RecordRow => ({
  id: rows.reduce((max, r) => Math.max(max, r.id), 0) + 1,
  vaccine: "",
  dose: "",
  date: "",
});

/** Rows the parent actually filled (fully empty rows are ignored). */
export function collectRecords(value: RecordsValue): RecordInput[] {
  return value.rows
    .filter((r) => r.vaccine || r.date)
    .map((r) => ({
      doseCode: r.vaccine && r.dose ? `${r.vaccine}-${r.dose}` : "",
      givenAt: r.date,
    }));
}

type Props = {
  value: RecordsValue;
  onChange: (value: RecordsValue) => void;
  dob: string;
  todayKey?: string;
  error?: string;
};

const GOV = VACCINE_ORDER.filter((k) => VACCINE_TYPE[k] === "government");
const PRIV = VACCINE_ORDER.filter((k) => VACCINE_TYPE[k] === "private");

export function InitialRecordsField({ value, onChange, dob, todayKey, error }: Props) {
  const { l } = useLanguage();

  function setEnabled(enabled: boolean) {
    onChange({
      enabled,
      rows: enabled && value.rows.length === 0 ? [newRow([])] : value.rows,
    });
  }

  function updateRow(id: number, patch: Partial<RecordRow>) {
    onChange({ ...value, rows: value.rows.map((r) => (r.id === id ? { ...r, ...patch } : r)) });
  }

  function removeRow(id: number) {
    const rows = value.rows.filter((r) => r.id !== id);
    onChange({ ...value, rows: rows.length ? rows : [newRow([])] });
  }

  /** Dose codes already picked in other rows, so the same dose cannot be added twice. */
  function usedElsewhere(rowId: number) {
    return new Set(
      value.rows
        .filter((r) => r.id !== rowId && r.vaccine && r.dose)
        .map((r) => `${r.vaccine}-${r.dose}`),
    );
  }

  function pickVaccine(row: RecordRow, vaccine: VaccineKey | "") {
    if (!vaccine) {
      updateRow(row.id, { vaccine: "", dose: "" });
      return;
    }
    const used = usedElsewhere(row.id);
    const free = dosesOfVaccine(vaccine).find((d) => !used.has(d.code));
    updateRow(row.id, { vaccine, dose: free ? String(free.doseNumber) : "" });
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-muted/30 p-4">
      <p className="text-sm font-medium">{l(DASH.records.question)}</p>

      <div className="flex gap-2" role="radiogroup" aria-label={l(DASH.records.question)}>
        {[true, false].map((answer) => (
          <button
            key={String(answer)}
            type="button"
            role="radio"
            aria-checked={value.enabled === answer}
            onClick={() => setEnabled(answer)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              value.enabled === answer
                ? "border-primary bg-primary text-primary-foreground"
                : "bg-background text-muted-foreground hover:bg-muted",
            )}
          >
            {l(answer ? DASH.records.yes : DASH.records.no)}
          </button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        {l(value.enabled ? DASH.records.yesHint : DASH.records.noHint)}
      </p>

      {value.enabled && (
        <div className="flex flex-col gap-3">
          {value.rows.map((row) => {
            const doses = row.vaccine ? dosesOfVaccine(row.vaccine) : [];
            const used = usedElsewhere(row.id);

            return (
              <div key={row.id} className="flex flex-col gap-3 rounded-lg border bg-background p-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="flex flex-col gap-1 text-xs text-muted-foreground">
                    {l(DASH.records.vaccine)}
                    <NativeSelect
                      className="w-full text-foreground"
                      value={row.vaccine}
                      onChange={(e) => pickVaccine(row, e.target.value as VaccineKey | "")}
                    >
                      <option value="">{l(DASH.records.selectVaccine)}</option>
                      <optgroup label={l(DASH.records.groupGov)}>
                        {GOV.map((k) => (
                          <option key={k} value={k}>{VACCINES[k].name}</option>
                        ))}
                      </optgroup>
                      <optgroup label={l(DASH.records.groupPriv)}>
                        {PRIV.map((k) => (
                          <option key={k} value={k}>{VACCINES[k].name}</option>
                        ))}
                      </optgroup>
                    </NativeSelect>
                  </label>

                  <label className="flex flex-col gap-1 text-xs text-muted-foreground">
                    {l(DASH.records.date)}
                    <Input
                      type="date"
                      className="h-9 text-foreground"
                      min={dob || undefined}
                      max={todayKey}
                      value={row.date}
                      onChange={(e) => updateRow(row.id, { date: e.target.value })}
                    />
                  </label>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2" role="group" aria-label={l(DASH.records.dose)}>
                    <span className="text-xs text-muted-foreground">{l(DASH.records.dose)}:</span>

                    {row.vaccine ? (
                      doses.map((d) => {
                        const selected = row.dose === String(d.doseNumber);
                        const taken = used.has(d.code);
                        return (
                          <button
                            key={d.code}
                            type="button"
                            aria-pressed={selected}
                            disabled={taken}
                            onClick={() => updateRow(row.id, { dose: String(d.doseNumber) })}
                            className={cn(
                              "inline-flex min-h-9 items-center gap-1 rounded-full border px-3 text-sm font-medium transition-colors",
                              selected
                                ? "border-primary bg-primary text-primary-foreground"
                                : "bg-background hover:bg-muted",
                              taken && "cursor-not-allowed opacity-40 line-through",
                            )}
                          >
                            {selected && <Check className="size-3.5" />}
                            {fill(l(DASH.schedule.dose), { n: d.doseNumber })}
                          </button>
                        );
                      })
                    ) : (
                      <span className="text-xs text-muted-foreground">{l(PICK_FIRST)}</span>
                    )}
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    aria-label={l(DASH.records.remove)}
                    onClick={() => removeRow(row.id)}
                  >
                    <Trash2 className="size-4" />
                    {l(DASH.records.remove)}
                  </Button>
                </div>
              </div>
            );
          })}

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-fit"
            onClick={() => onChange({ ...value, rows: [...value.rows, newRow(value.rows)] })}
          >
            <Plus className="size-4" />
            {l(DASH.records.add)}
          </Button>
        </div>
      )}

      {error && (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}