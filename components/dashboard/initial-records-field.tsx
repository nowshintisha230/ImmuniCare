"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { useLanguage } from "@/components/providers/language-provider";
import { DASH } from "@/lib/content/dashboard";
import { VACCINES, type VaccineKey } from "@/lib/content/vaccine-info";
import { VACCINE_ORDER, VACCINE_TYPE } from "@/lib/vaccination/doses";
import { dosesOfVaccine, type RecordInput } from "@/lib/vaccination/records";
import { cn } from "@/lib/utils";

export type RecordRow = { id: number; vaccine: VaccineKey | ""; dose: string; date: string };
export type RecordsValue = { enabled: boolean; rows: RecordRow[] };

export const EMPTY_RECORDS: RecordsValue = { enabled: false, rows: [] };

const newRow = (rows: RecordRow[]): RecordRow => ({
  id: rows.reduce((max, r) => Math.max(max, r.id), 0) + 1,
  vaccine: "",
  dose: "",
  date: "",
});


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
            return (
              <div
                key={row.id}
                className="grid gap-2 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,0.7fr)_minmax(0,1fr)_auto] sm:items-end"
              >
                <label className="flex flex-col gap-1 text-xs text-muted-foreground">
                  {l(DASH.records.vaccine)}
                  <NativeSelect
                    className="w-full text-foreground"
                    value={row.vaccine}
                    onChange={(e) => {
                      const vaccine = e.target.value as VaccineKey | "";
                      updateRow(row.id, { vaccine, dose: vaccine ? "1" : "" });
                    }}
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
                  {l(DASH.records.dose)}
                  <NativeSelect
                    className="w-full text-foreground"
                    value={row.dose}
                    disabled={!row.vaccine}
                    onChange={(e) => updateRow(row.id, { dose: e.target.value })}
                  >
                    <option value="">{l(DASH.records.selectDose)}</option>
                    {doses.map((d) => (
                      <option key={d.code} value={d.doseNumber}>{d.doseNumber}</option>
                    ))}
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

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={l(DASH.records.remove)}
                  onClick={() => removeRow(row.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
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