"use client";
import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import Button from "@/components/ui/Button";

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const hours = Array.from({ length: 13 }, (_, i) => i + 8); // 8 to 20
function fmtHour(h: number) { return `${(h % 12 || 12)}${h < 12 ? 'am' : 'pm'}`; }

export default function AvailabilityModal({
  open,
  onClose,
  availability: initialAvailability,
  onSave
}:{
  open: boolean,
  onClose: () => void,
  availability: any,
  onSave: (avail:any) => Promise<void>
}) {
  const [availability, setAvailability] = useState<any>({});
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    setAvailability(initialAvailability || {});
  }, [initialAvailability]);

  const todayIdx = new Date().getDay() - 1 < 0 ? 6 : new Date().getDay() - 1;
  const currentHour = new Date().getHours();

  function toggleSlot(day: string, hour: number) {
    setAvailability((prev: any) => {
      const copy = { ...prev };
      if (!copy[day]) copy[day] = [];
      if (copy[day].includes(hour)) {
        copy[day] = copy[day].filter((h: number) => h !== hour);
      } else {
        copy[day] = [...copy[day], hour];
      }
      return copy;
    });
  }
  function clearAll() {
    setAvailability(daysOfWeek.reduce((acc, d) => { acc[d] = []; return acc; }, {}));
  }
  function selectAllWeekdays() {
    setAvailability(
      daysOfWeek.reduce((acc, d, i) => {
        acc[d] = i < 5 ? [...hours] : [];
        return acc;
      }, {} as any)
    );
  }
  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(availability);
      onClose();
    } finally {
      setSaving(false);
    }
  }
  if (!open) return null;
  return (
    <Dialog open={open} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
      {/* Blurred/transparent overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm" aria-hidden="true" />
      <div className="flex items-center justify-center min-h-screen px-4">
        <Dialog.Panel className="relative bg-white rounded-lg shadow-lg max-w-2xl mx-auto w-full p-6 z-10">
          <Dialog.Title className="text-lg font-bold mb-4">My Availability</Dialog.Title>
          <p className="mb-2 text-sm text-gray-700">Click slots to toggle available hours. Today is highlighted. Past hours are greyed out for today.</p>
          <div className="mb-2 flex items-center gap-3">
            <button className="text-xs text-blue-600 underline" onClick={clearAll}>Clear All</button>
            <button className="text-xs text-gray-700 underline" onClick={selectAllWeekdays}>Select All Weekdays</button>
          </div>
          <div className="overflow-x-auto mb-4">
            <table className="border mb-2">
              <thead>
                <tr>
                  <th></th>
                  {daysOfWeek.map((d, idx) => (
                    <th key={d} className={`${idx === todayIdx ? "bg-blue-50 text-blue-700" : ""} p-1 text-xs`}>{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {hours.map(h => (
                  <tr key={h}>
                    <td className="p-1 text-xs font-mono">{fmtHour(h)}</td>
                    {daysOfWeek.map((d, idx) => {
                      const isToday = idx === todayIdx;
                      const isPast = isToday && h < currentHour;
                      return <td key={d} className={"p-0 text-center"}>
                        <button
                          onClick={() => !isPast && toggleSlot(d, h)}
                          className={`w-7 h-7 rounded-full border border-gray-300 transition ${availability[d]?.includes(h) ? "bg-blue-500" : "bg-gray-100"} ${isToday ? "ring-2 ring-blue-300" : ""} ${isPast ? "bg-gray-200 text-gray-400 cursor-not-allowed opacity-60" : ""}`}
                          disabled={isPast}
                          tabIndex={isPast ? -1 : 0}
                        ></button>
                      </td>;
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex gap-3 mt-6">
            <Button type="button" onClick={handleSave} loading={saving} className="flex-1">Save Availability</Button>
            <Button type="button" variant="ghost" onClick={onClose} className="flex-1">Cancel</Button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
