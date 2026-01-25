"use client";

import {
  RotateCcw,
  Settings,
  Trash,
  Search,
} from "lucide-react";

import { useState, useEffect } from "react";

/* -------------------------------------------------------
   Resolve nested path: supports a.b.c[2].price
--------------------------------------------------------*/
const resolvePath = (obj, path) => {
  if (!obj || !path) return undefined;

  return path.split(".").reduce((acc, part) => {
    if (!acc) return undefined;

    const match = part.match(/^(.+?)\[(\d+)\]$/);
    if (match) {
      const [, key, index] = match;
      return acc[key]?.[Number(index)];
    }
    return acc[part];
  }, obj);
};

/* -------------------------------------------------------
   COMPONENT
--------------------------------------------------------*/
export const EnhancedTableWidget = ({ widget, onDelete, onConfigure }) => {
  const [apiData, setApiData] = useState(null);
  const [lastUpdated, setLastUpdated] = useState("--");
  const [searchText, setSearchText] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortAsc, setSortAsc] = useState(true);

  /* -------------------------------------------------------
     Build URL & Headers
  --------------------------------------------------------*/
  const buildUrl = () => {
    let url = widget.apiUrl;

    if (widget.params?.length > 0) {
      const query = widget.params
        .filter((p) => p.key && p.value)
        .map(
          (p) => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`
        )
        .join("&");

      url += url.includes("?") ? `&${query}` : `?${query}`;
    }

    return url;
  };

  const buildHeaders = () => {
    const h = {};
    widget.headers?.forEach((item) => {
      if (item.key && item.value) h[item.key] = item.value;
    });
    return h;
  };

  /* -------------------------------------------------------
     Fetch API
  --------------------------------------------------------*/
  const fetchData = async () => {
    try {
      const res = await fetch(buildUrl(), { headers: buildHeaders() });
      const json = await res.json();

      setApiData(json);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Table Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchData();
    const timer = setInterval(fetchData, (widget.interval ?? 30) * 1000);
    return () => clearInterval(timer);
  }, [widget.apiUrl, widget.params, widget.headers, widget.interval]);

  /* -------------------------------------------------------
     Extract Rows
  --------------------------------------------------------*/
  const rows = Array.isArray(resolvePath(apiData, widget.arrayPath))
    ? resolvePath(apiData, widget.arrayPath)
    : [];

  /* -------------------------------------------------------
     Search & Sort
  --------------------------------------------------------*/
  const searched = rows.filter((row) =>
    JSON.stringify(row).toLowerCase().includes(searchText.toLowerCase())
  );

  const sorted = [...searched].sort((a, b) => {
    if (sortField === null) return 0;

    const key = widget.tableColumns[sortField];
    const A = a[key];
    const B = b[key];

    if (A === undefined) return 1;
    if (B === undefined) return -1;

    if (typeof A === "number" && typeof B === "number") {
      return sortAsc ? A - B : B - A;
    }

    return sortAsc
      ? String(A).localeCompare(String(B))
      : String(B).localeCompare(String(A));
  });

  /* -------------------------------------------------------
     UI
  --------------------------------------------------------*/
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 sm:p-5 shadow-xl text-white">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <div className="flex gap-2 items-center">
          <h2 className="text-base sm:text-lg font-semibold">{widget.name}</h2>
          <span className="text-xs bg-slate-700 px-2 py-1 rounded">
            {widget.interval}s
          </span>
        </div>

        <div className="flex gap-3 text-slate-400">
          <RotateCcw
            size={18}
            className="cursor-pointer hover:text-white"
            onClick={fetchData}
          />

          <Settings
            size={18}
            className="cursor-pointer hover:text-white"
            onClick={() => onConfigure(widget)}
          />

          <Trash
            size={18}
            className="cursor-pointer hover:text-red-400"
            onClick={() => onDelete(widget.id)}
          />
        </div>
      </div>

      {/* SEARCH */}
      <div className="relative mb-4">
        <input
          className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 pl-8 text-sm focus:outline-none"
          placeholder="Search table..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Search size={16} className="absolute left-2 top-2.5 text-slate-500" />
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="border-b border-slate-700 text-slate-400">
            <tr>
              {widget.tableColumns?.map((col, idx) => (
                <th
                  key={idx}
                  className="py-2 px-3 text-left cursor-pointer hover:text-white"
                  onClick={() => {
                    if (sortField === idx) setSortAsc(!sortAsc);
                    else {
                      setSortField(idx);
                      setSortAsc(true);
                    }
                  }}
                >
                  {col}
                  {sortField === idx ? (sortAsc ? " ↑" : " ↓") : ""}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {!apiData ? (
              <tr>
                <td
                  colSpan={widget.tableColumns?.length || 1}
                  className="py-4 text-center text-slate-500"
                >
                  Loading...
                </td>
              </tr>
            ) : sorted.length === 0 ? (
              <tr>
                <td
                  colSpan={widget.tableColumns?.length || 1}
                  className="py-4 text-center text-slate-500"
                >
                  No data found
                </td>
              </tr>
            ) : (
              sorted.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  className="border-b border-slate-800 hover:bg-slate-800/50"
                >
                  {widget.tableColumns.map((col, colIdx) => (
                    <td key={colIdx} className="py-2 px-3">
                      {row[col] ?? "--"}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* FOOTER */}
      <div className="text-xs text-slate-500 border-t border-slate-700 pt-2 mt-3">
        Last updated: {lastUpdated} • {rows.length} rows
      </div>
    </div>
  );
};
