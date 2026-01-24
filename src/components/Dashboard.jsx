"use client";

import { useSelector, useDispatch } from "react-redux";
import { addWidget, deleteWidget } from "@/store/widgetSlice";
//import { addWidget } from "@/store/widgetSlice"; 
//import { useState } from "react"; 
import { useState, useEffect, Suspense, useRef } from "react";

import {
  Plus,
  Download,
  Upload,
} from "lucide-react";

import AddWidgetModal from "./modals/AddWidgetModal"; 
import ConfigureWidgetModal from "./modals/ConfigureWidgetModal";

import CardWidget from "./widgets/CardWidget";
import { EnhancedTableWidget } from "./widgets/TableWidget";
import { EnhancedChartWidget } from "./widgets/ChartWidget";

const WidgetSkeleton = ({ type }) => (
  <div
    className={`bg-slate-900 border border-slate-700 rounded-xl p-5 animate-pulse ${
      type === "chart"
        ? "col-span-full lg:col-span-2"
        : type === "table"
        ? "col-span-full"
        : ""
    }`}
  >
    <div className="h-6 bg-slate-800 rounded w-1/3 mb-4"></div>
    <div className="space-y-3">
      <div className="h-4 bg-slate-800 rounded"></div>
      <div className="h-4 bg-slate-800 rounded w-5/6"></div>
      <div className="h-4 bg-slate-800 rounded w-4/6"></div>
    </div>
  </div>
);

export default function Dashboard() {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [configWidget, setConfigWidget] = useState(null); // Configure modal
  const [showExportMenu, setShowExportMenu] = useState(false);
  const fileInputRef = useRef(null);

   const handleAddWidget = (widget) => {
    dispatch(addWidget(widget));
    setIsModalOpen(false);
    };
    const handleDeleteWidget = (id) => {
    if (confirm("Delete this widget?")) {
      dispatch(deleteWidget(id));
    }
    };

    const handleConfigureWidget = (widget) => {
    console.log("Configure widget:", widget);
    };

  // READ widgets from Redux store
  const widgets = useSelector((state) => state.widgets.list);

   const handleExport = () => {
    const dataBlob = new Blob(
      [JSON.stringify({ widgets }, null, 2)],
      { type: "application/json" }
    );

    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "dashboard-config.json";
    link.click();
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

 //Import widgets JSON
  const handleImport = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const config = JSON.parse(e.target.result);
      config.widgets.forEach((widget) => dispatch(addWidget(widget)));
    };

    reader.readAsText(file);
  };

   return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-[1600px] mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">API Dashboard</h1>

          <div className="flex gap-3">
            {/* EXPORT / IMPORT */}
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="bg-slate-800 px-4 py-2 rounded text-white"
            >
              <Download size={16} />
            </button>

            {showExportMenu && (
              <div className="absolute bg-slate-800 rounded mt-2">
                <button onClick={handleExport}>Export</button>
                <button onClick={() => fileInputRef.current.click()}>
                  Import
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              hidden
              accept=".json"
              onChange={handleImport}
            />

            {/* ADD WIDGET */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-green-600 px-4 py-2 rounded text-white"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* =======================
            WIDGET GRID
            ======================= */}
        {widgets.length === 0 ? (
          <p className="text-slate-400 text-center">No widgets yet</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">

            {/* CHANGE: Map widgets & render based on displayMode */}
            {widgets.map((widget) => {

              // CHANGE: Grid size logic per widget type
              const getGridClass = () => {
                if (widget.displayMode === "chart") return "lg:col-span-2";
                if (widget.displayMode === "table") return "xl:col-span-3";
                return "";
              };

              return (
                <div key={widget.id} className={getGridClass()}>
                  <Suspense fallback={<WidgetSkeleton type={widget.displayMode} />}>

                    {/* CARD */}
                    {widget.displayMode === "card" && (
                      <CardWidget
                        widget={widget}
                        onDelete={handleDeleteWidget}
                        onConfigure={handleConfigureWidget}
                      />
                    )}

                    {/* TABLE */}
                    {widget.displayMode === "table" && (
                      <EnhancedTableWidget
                        widget={widget}
                        onDelete={handleDeleteWidget}
                        onConfigure={handleConfigureWidget}
                      />
                    )}

                    {/* CHART */}
                    {widget.displayMode === "chart" && (
                      <EnhancedChartWidget
                        widget={widget}
                        onDelete={handleDeleteWidget}
                        onConfigure={handleConfigureWidget}
                      />
                    )}

                  </Suspense>
                </div>
              );
            })}
          </div>
        )}

        {/* ADD WIDGET MODAL */}
        {isModalOpen && (
          <AddWidgetModal
            onClose={() => setIsModalOpen(false)}
            onAdd={handleAddWidget}
          />
        )}

        {/* CONFIGURE WIDGET MODAL */}
        {configWidget && (
          <ConfigureWidgetModal
            widget={configWidget}
            onClose={() => setConfigWidget(null)}
          />
        )}
      </div>
    </div>
  );
}