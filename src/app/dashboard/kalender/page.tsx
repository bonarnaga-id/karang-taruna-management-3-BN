"use client";

import { useState, useEffect } from "react";
import { CalendarIcon, ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";

interface Activity {
  id: string;
  title: string;
  startDate: string;
  endDate: string | null;
  location: string | null;
  status: "rencana" | "berlangsung" | "selesai" | "dibatalkan";
}

const statusLabels: Record<string, string> = {
  rencana: "Rencana",
  berlangsung: "Berlangsung",
  selesai: "Selesai",
  dibatalkan: "Dibatalkan"
};

const statusColors: Record<string, string> = {
  rencana: "bg-blue-100 text-blue-800",
  berlangsung: "bg-yellow-100 text-yellow-800",
  selesai: "bg-green-100 text-green-800",
  dibatalkan: "bg-red-100 text-red-800"
};

export default function KalenderPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    fetch("/api/activities")
      .then((res) => {
        if (!res.ok) throw new Error("Gagal memuat data kegiatan");
        return res.json();
      })
      .then((data) => {
        setActivities(data.data || []);
      })
      .catch((e) => {
        if (e instanceof Error) setError(e.message);
      })
      .finally(() => setLoading(false));
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const firstDayIndex = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const today = new Date();
  const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const getActivityForDate = (day: number) => {
    const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return activities.filter((a) => {
      const start = (a.startDate || "").split("T")[0];
      return start === dateString;
    });
  };

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

  if (loading) {
    return (
      <div className="animate-fade-in space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="h-96 bg-gray-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-fade-in text-center py-16">
        <CalendarDays className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-semibold text-gray-600">Gagal memuat kalender</h3>
        <p className="text-gray-500 mt-2">{error}</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Kalender Kegiatan</h2>
          <p className="text-gray-500 mt-1">Jadwal kegiatan Karang Taruna</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="p-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-semibold text-gray-700 min-w-[200px] text-center">
            {monthNames[month]} {year}
          </span>
          <button
            onClick={nextMonth}
            className="p-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
          {dayNames.map((day) => (
            <div key={day} className="text-center py-3 font-semibold text-gray-600 text-sm">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="h-24 p-2 border-b border-gray-100" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const isToday = dateString === todayString;
            const dayActivities = getActivityForDate(day);

            return (
              <div
                key={day}
                className={`h-24 p-1 border-b border-gray-100 relative ${isToday ? "bg-blue-50" : ""}`}
              >
                <span className={`text-xs ${isToday ? "font-bold text-blue-600" : "text-gray-400"}`}>
                  {day}
                </span>
                <div className="mt-1 space-y-1">
                  {dayActivities.slice(0, 2).map((activity) => (
                    <div
                      key={activity.id}
                      className={`text-xs p-1 rounded truncate ${statusColors[activity.status]}`}
                      title={activity.title}
                    >
                      {activity.title}
                    </div>
                  ))}
                  {dayActivities.length > 2 && (
                    <div className="text-xs text-gray-500">+{dayActivities.length - 2} lainnya</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {activities.filter((a) => a.status !== "selesai" && a.status !== "dibatalkan").length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CalendarDays className="w-5 h-5" />
            Kegiatan Mendatang
          </h3>
          <div className="space-y-4">
            {activities
              .filter((a) => a.status !== "selesai" && a.status !== "dibatalkan")
              .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
              .slice(0, 5)
              .map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="bg-blue-100 rounded-xl p-2 flex-shrink-0">
                    <CalendarIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(activity.startDate).toLocaleDateString("id-ID", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      })}
                      {activity.location && ` • ${activity.location}`}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[activity.status]}`}>
                    {statusLabels[activity.status]}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
