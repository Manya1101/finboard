"use client";

import { useSelector, useDispatch } from "react-redux";
//import { addWidget, deleteWidget } from "@/store/widgetSlice";
import { addWidget } from "@/store/widgetSlice"; 
import AddWidgetModal from "./modals/AddWidgetModal"; 
import { useState } from "react"; 

export default function Dashboard() {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);

   const handleAddWidget = (widget) => {
    dispatch(addWidget(widget));
    setIsModalOpen(false);
  };

  // READ widgets from Redux store
  const widgets = useSelector((state) => state.widgets.list);

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">
          API Dashboard
        </h1>
        <p className="text-slate-400 mb-8">
          Monitor your APIs in one place
        </p>
        
          <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg mb-6"
        >
          Add Widget
        </button>
        
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
                {/* <div className="flex justify-between items-center"> */}
                  <span>{widget.title || "Widget"}</span>
                  {/* <button
                    onClick={() => dispatch(deleteWidget(widget.id))}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Delete
                  </button> */}
                {/* </div> */}
              </div>
            ))}
          </div>
        )}
          {isModalOpen && (
          <AddWidgetModal
            onClose={() => setIsModalOpen(false)}
            onAdd={handleAddWidget}
          />
        )}
      </div>
    </div>
  );
}
