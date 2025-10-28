// src/components/common/ResizableTable.jsx

import React, { useState, useRef, useEffect } from "react";
import { Edit2, Trash2, Eye } from "lucide-react";

/**
 * ResizableTable Component with Column Resizing
 *
 * Features:
 * - Resizable columns by dragging
 * - Mobile: Card layout
 * - Desktop: Table layout with resizing
 * - Configurable columns
 * - Action buttons (View, Edit, Delete)
 * - Loading state
 * - Empty state
 * - Responsive design
 * - Touch-friendly
 * - Accessible
 * - Persists column widths in localStorage
 */

const ResizableTable = ({
  // Data
  data = [],
  columns = [],

  // State
  loading = false,
  emptyMessage = "No data found",
  emptyIcon = "📋",

  // Actions
  onView = null,
  onEdit = null,
  onDelete = null,

  // Action labels
  viewLabel = "View",
  editLabel = "Edit",
  deleteLabel = "Delete",

  // Styling
  className = "",
  cardClassName = "",
  tableClassName = "",

  // Mobile card renderer (optional custom)
  renderMobileCard = null,

  // Row key
  rowKey = "_id",

  // Table ID for localStorage persistence
  tableId = "resizable-table",

  // Min/Max column widths
  minColumnWidth = 80,
  maxColumnWidth = 500,
}) => {
  const tableRef = useRef(null);
  const [columnWidths, setColumnWidths] = useState({});
  const [activeIndex, setActiveIndex] = useState(null);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);

  // Load saved column widths from localStorage
  useEffect(() => {
    const savedWidths = localStorage.getItem(`${tableId}-column-widths`);
    if (savedWidths) {
      try {
        setColumnWidths(JSON.parse(savedWidths));
      } catch (e) {
        console.error("Failed to parse saved column widths", e);
      }
    }
  }, [tableId]);

  // Save column widths to localStorage
  const saveColumnWidths = (widths) => {
    localStorage.setItem(`${tableId}-column-widths`, JSON.stringify(widths));
  };

  // Handle mouse down on resize handle
  const handleMouseDown = (e, index, currentWidth) => {
    e.preventDefault();
    setActiveIndex(index);
    setStartX(e.clientX);
    setStartWidth(currentWidth);
  };

  // Handle touch start on resize handle
  const handleTouchStart = (e, index, currentWidth) => {
    e.preventDefault();
    setActiveIndex(index);
    setStartX(e.touches[0].clientX);
    setStartWidth(currentWidth);
  };

  // Handle mouse/touch move
  useEffect(() => {
    const handleMove = (clientX) => {
      if (activeIndex === null) return;

      const diff = clientX - startX;
      const newWidth = Math.max(
        minColumnWidth,
        Math.min(maxColumnWidth, startWidth + diff)
      );

      const columnKey = columns[activeIndex].key;
      const newWidths = {
        ...columnWidths,
        [columnKey]: newWidth,
      };

      setColumnWidths(newWidths);
      saveColumnWidths(newWidths);
    };

    const handleMouseMove = (e) => {
      handleMove(e.clientX);
    };

    const handleTouchMove = (e) => {
      handleMove(e.touches[0].clientX);
    };

    const handleEnd = () => {
      setActiveIndex(null);
    };

    if (activeIndex !== null) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleEnd);
      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchend", handleEnd);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleEnd);
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleEnd);
      };
    }
  }, [activeIndex, startX, startWidth, columns, columnWidths, minColumnWidth, maxColumnWidth]);

  // Get column width
  const getColumnWidth = (columnKey) => {
    return columnWidths[columnKey] || 150;
  };

  // Default mobile card renderer
  const defaultMobileCard = (item) => {
    const primaryColumn = columns[0];
    const secondaryColumns = columns.slice(1, 3);

    return (
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Primary field */}
            {primaryColumn && (
              <h3 className="font-semibold text-gray-900 text-base mb-1 truncate">
                {primaryColumn.render
                  ? primaryColumn.render(item[primaryColumn.key], item)
                  : item[primaryColumn.key]}
              </h3>
            )}

            {/* Secondary fields */}
            {secondaryColumns.map((column) => (
              <p key={column.key} className="text-sm text-gray-600 truncate mt-1">
                {column.render
                  ? column.render(item[column.key], item)
                  : item[column.key]}
              </p>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        {(onView || onEdit || onDelete) && (
          <div className="flex gap-2">
            {onView && (
              <button
                onClick={() => onView(item)}
                className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium rounded-lg transition-colors min-h-touch tap-highlight-transparent touch-manipulation focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label={`${viewLabel} ${item[primaryColumn?.key] || ""}`}
              >
                <Eye size={16} aria-hidden="true" />
                <span>{viewLabel}</span>
              </button>
            )}

            {onEdit && (
              <button
                onClick={() => onEdit(item)}
                className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 font-medium rounded-lg transition-colors min-h-touch tap-highlight-transparent touch-manipulation focus:outline-none focus:ring-2 focus:ring-amber-500"
                aria-label={`${editLabel} ${item[primaryColumn?.key] || ""}`}
              >
                <Edit2 size={16} aria-hidden="true" />
                <span>{editLabel}</span>
              </button>
            )}

            {onDelete && (
              <button
                onClick={() => onDelete(item)}
                className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-medium rounded-lg transition-colors min-h-touch tap-highlight-transparent touch-manipulation focus:outline-none focus:ring-2 focus:ring-red-500"
                aria-label={`${deleteLabel} ${item[primaryColumn?.key] || ""}`}
              >
                <Trash2 size={16} aria-hidden="true" />
                <span>{deleteLabel}</span>
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}>
        <div className="p-8 sm:p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-blue-600 mb-4"></div>
          <p className="text-gray-500">Loading data...</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (!data || data.length === 0) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}>
        <div className="p-8 sm:p-12 text-center">
          <div className="text-5xl mb-4">{emptyIcon}</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {emptyMessage}
          </h3>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${className}`}>
      {/* Mobile Card Layout */}
      <div className={`divide-y divide-gray-200 sm:hidden ${cardClassName}`}>
        {data.map((item) => (
          <div key={item[rowKey]}>
            {renderMobileCard ? renderMobileCard(item) : defaultMobileCard(item)}
          </div>
        ))}
      </div>

      {/* Desktop Table Layout with Resizable Columns */}
      <div className={`hidden sm:block overflow-x-auto ${tableClassName}`}>
        <table ref={tableRef} className="w-full" role="table" style={{ tableLayout: "fixed" }}>
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={column.key}
                  scope="col"
                  className={`relative px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider ${
                    column.align === "right"
                      ? "text-right"
                      : column.align === "center"
                      ? "text-center"
                      : "text-left"
                  }`}
                  style={{ width: `${getColumnWidth(column.key)}px` }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate">{column.title}</span>
                  </div>

                  {/* Resize Handle */}
                  <div
                    className="absolute top-0 right-0 h-full w-1 cursor-col-resize hover:bg-blue-500 active:bg-blue-600 group"
                    style={{ userSelect: "none" }}
                    onMouseDown={(e) => handleMouseDown(e, index, getColumnWidth(column.key))}
                    onTouchStart={(e) => handleTouchStart(e, index, getColumnWidth(column.key))}
                  >
                    <div className="absolute inset-0 w-3 -left-1 group-hover:bg-blue-100 transition-colors" />
                  </div>
                </th>
              ))}

              {/* Actions column */}
              {(onView || onEdit || onDelete) && (
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  style={{ width: "150px" }}
                >
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 bg-white">
            {data.map((item) => (
              <tr
                key={item[rowKey]}
                className="hover:bg-gray-50 transition-colors"
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`px-6 py-4 ${
                      column.align === "right"
                        ? "text-right"
                        : column.align === "center"
                        ? "text-center"
                        : "text-left"
                    }`}
                    style={{ width: `${getColumnWidth(column.key)}px` }}
                  >
                    <div className="truncate">
                      {column.render
                        ? column.render(item[column.key], item)
                        : item[column.key]}
                    </div>
                  </td>
                ))}

                {/* Actions column */}
                {(onView || onEdit || onDelete) && (
                  <td className="px-6 py-4 whitespace-nowrap text-right" style={{ width: "150px" }}>
                    <div className="flex items-center justify-end gap-2">
                      {onView && (
                        <button
                          onClick={() => onView(item)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium rounded-lg transition-colors min-h-touch tap-highlight-transparent touch-manipulation focus:outline-none focus:ring-2 focus:ring-blue-500"
                          aria-label={`${viewLabel} ${item[columns[0]?.key] || ""}`}
                        >
                          <Eye size={14} aria-hidden="true" />
                          <span>{viewLabel}</span>
                        </button>
                      )}

                      {onEdit && (
                        <button
                          onClick={() => onEdit(item)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 text-sm font-medium rounded-lg transition-colors min-h-touch tap-highlight-transparent touch-manipulation focus:outline-none focus:ring-2 focus:ring-amber-500"
                          aria-label={`${editLabel} ${item[columns[0]?.key] || ""}`}
                        >
                          <Edit2 size={14} aria-hidden="true" />
                          <span>{editLabel}</span>
                        </button>
                      )}

                      {onDelete && (
                        <button
                          onClick={() => onDelete(item)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-sm font-medium rounded-lg transition-colors min-h-touch tap-highlight-transparent touch-manipulation focus:outline-none focus:ring-2 focus:ring-red-500"
                          aria-label={`${deleteLabel} ${item[columns[0]?.key] || ""}`}
                        >
                          <Trash2 size={14} aria-hidden="true" />
                          <span>{deleteLabel}</span>
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Reset Column Widths Button */}
      <div className="hidden sm:flex justify-end px-4 py-2 bg-gray-50 border-t border-gray-200">
        <button
          onClick={() => {
            setColumnWidths({});
            localStorage.removeItem(`${tableId}-column-widths`);
          }}
          className="text-xs text-gray-600 hover:text-gray-900 underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
        >
          Reset Column Widths
        </button>
      </div>
    </div>
  );
};

export default ResizableTable;
