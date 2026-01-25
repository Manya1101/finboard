"use client";

import { useSelector, useDispatch } from "react-redux";
import { addWidget, deleteWidget ,updateWidget } from "@/store/widgetSlice";
//import { addWidget } from "@/store/widgetSlice"; 
//import { useState } from "react"; 
import { useState, useEffect, Suspense, useRef } from "react";

import {
  Plus,
} from "lucide-react";

import AddWidgetModal from "./modals/AddWidgetModal"; 
import ConfigureWidgetModal from "./modals/ConfigureWidgetModal";

import CardWidget from "./widgets/CardWidget";
import { EnhancedTableWidget } from "./widgets/TableWidget";
import { EnhancedChartWidget } from "./widgets/ChartWidget";

import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { reorderWidgets } from "@/store/widgetSlice";
import { v4 as uuidv4 } from "uuid";
import { nanoid } from "@reduxjs/toolkit";


function SortableWidget({ id, children, className }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={className}
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  );
}
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
  const widgets = useSelector((state) => state.widgets.list);  // READ widgets from Redux store

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [configWidget, setConfigWidget] = useState(null); // Configure modal
  
    const hasLoaded = useRef(false);

   useEffect(() => {
  const savedWidgets = localStorage.getItem("widgets");
  if (!savedWidgets) return;

  const parsedWidgets = JSON.parse(savedWidgets);

  // Load widgets ONCE and AS-IS
  //dispatch(reorderWidgets(parsedWidgets));
  const uniqueWidgets = Array.from(
  new Map(parsedWidgets.map(w => [w.id, w])).values()
  );

   dispatch(reorderWidgets(uniqueWidgets));

}, [dispatch]);

  // Save to localStorage whenever widgets change
useEffect(() => {
  if (widgets.length > 0) {
     localStorage.setItem("widgets", JSON.stringify(widgets));
  } else {
    localStorage.removeItem("widgets");
  }
}, [widgets]);

   const handleAddWidget = (widget) => {
      dispatch(
        addWidget({
          ...widget,
          id: nanoid(), // ID generated ONCE here
        })
      );
      setIsModalOpen(false);
    };

    const handleDeleteWidget = (id) => {
      dispatch(deleteWidget(id));
    };
    
  const handleUpdate = (id) => {
    const newName = prompt("Enter new widget name:");
    if (newName) {
      dispatch(updateWidget({ id, data: { name: newName } }));
    }
  };
    const handleConfigureWidget = (widget) => {
    console.log("Configure widget:", widget);
    };

    const handleDragEnd = (event) => {
    const { active, over } = event;

     console.log("DRAG END", {
        active: active?.id,
        over: over?.id,
      });

    if (!over || active.id === over.id) return;

    const oldIndex = widgets.findIndex((w) => w.id === active.id);
    const newIndex = widgets.findIndex((w) => w.id === over.id);

    dispatch(reorderWidgets(arrayMove(widgets, oldIndex, newIndex)));
   };

   return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-[1600px] mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Finance Dashboard</h1>

          <div className="flex gap-3">
            
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
  <DndContext onDragEnd={handleDragEnd}>
    <SortableContext
      items={widgets.map((w) => w.id)}
      strategy={rectSortingStrategy}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
           
        {widgets.map((widget) => (
            <SortableWidget
                    key={widget.id}
                    id={widget.id}
                    className={
                      widget.displayMode === "chart"
                        ? "lg:col-span-2"
                        : widget.displayMode === "table"
                        ? "xl:col-span-3"
                        : ""
                    }
                  >
                    <Suspense
                      fallback={
                        <WidgetSkeleton type={widget.displayMode} />
                      }
                    >
                      {widget.displayMode === "card" && (
                        <CardWidget
                          widget={widget}
                          onDelete={handleDeleteWidget}
                          onConfigure={handleConfigureWidget}
                        />
                      )}

                      {widget.displayMode === "table" && (
                        <EnhancedTableWidget
                          widget={widget}
                          onDelete={handleDeleteWidget}
                          onConfigure={handleConfigureWidget}
                        />
                      )}

                      {widget.displayMode === "chart" && (
                        <EnhancedChartWidget
                          widget={widget}
                          onDelete={handleDeleteWidget}
                          onConfigure={handleConfigureWidget}
                        />
                      )}
                    </Suspense>
                  </SortableWidget>
                ))}
         
      </div>
    </SortableContext>
  </DndContext>
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