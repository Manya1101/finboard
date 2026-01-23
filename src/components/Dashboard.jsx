"use client";

import { useState } from "react";

export default function Dashboard() {
  const [widgets, setWidgets] = useState([]);

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">
          API Dashboard
        </h1>
        <p className="text-slate-400 mb-8">
          Monitor your APIs in one place
        </p>

        {widgets.length === 0 ? (
          <div className="border border-dashed border-slate-700 rounded-xl p-12 text-center text-slate-400">
            No widgets yet
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {widgets.map((widget) => (
              <div
                key={widget.id}
                className="bg-slate-900 border border-slate-700 rounded-lg p-4 text-white"
              >
                {widget.title || "Widget"}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
