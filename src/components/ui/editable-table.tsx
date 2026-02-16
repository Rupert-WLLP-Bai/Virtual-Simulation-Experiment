import { useState, useCallback } from "react";
import { Button } from "./button";
import { Input } from "./input";

export interface Column<T> {
  key: string;
  title: string;
  dataIndex?: keyof T;
  editable?: boolean;
  type?: "text" | "number";
  width?: string;
  render?: (value: unknown, record: T, index: number) => React.ReactNode;
}

interface EditableTableProps<T extends Record<string, unknown>> {
  columns: Column<T>[];
  data: T[];
  onChange: (data: T[]) => void;
  rowKey?: string;
  addButtonText?: string;
  showAddButton?: boolean;
}

export function EditableTable<T extends Record<string, unknown>>({
  columns,
  data,
  onChange,
  rowKey = "id",
  addButtonText = "添加行",
  showAddButton = true,
}: EditableTableProps<T>) {
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);

  const handleEdit = (record: T) => {
    const key = String(record[rowKey] || Math.random());
    setEditingKey(key);
  };

  const handleSave = () => {
    setEditingKey(null);
    setEditingField(null);
  };

  const handleCancel = () => {
    setEditingKey(null);
    setEditingField(null);
  };

  const handleChange = useCallback(
    (key: string, field: string, value: unknown) => {
      const newData = data.map((item) => {
        const itemKey = String(item[rowKey] || Math.random());
        if (itemKey === key) {
          return { ...item, [field]: value };
        }
        return item;
      });
      onChange(newData);
    },
    [data, onChange, rowKey]
  );

  const handleAdd = () => {
    const newRow: T = { [rowKey]: `new-${Date.now()}` } as T;
    // Initialize all editable fields with empty values
    columns.forEach((col) => {
      if (col.editable) {
        (newRow as Record<string, unknown>)[col.key] = "";
      }
    });
    onChange([...data, newRow]);
    setEditingKey(String(newRow[rowKey]));
  };

  const handleDelete = useCallback(
    (record: T) => {
      const newData = data.filter((item) => {
        const itemKey = String(item[rowKey]);
        const recordKey = String(record[rowKey]);
        return itemKey !== recordKey;
      });
      onChange(newData);
    },
    [data, onChange, rowKey]
  );

  const renderCell = (column: Column<T>, record: T, index: number) => {
    const key = String(record[rowKey] || Math.random());
    const isEditing = editingKey === key;
    const value = column.dataIndex ? record[column.dataIndex] : record[column.key];

    if (column.render) {
      return column.render(value, record, index);
    }

    if (column.editable && isEditing) {
      return (
        <Input
          type={column.type || "text"}
          value={String(value ?? "")}
          onChange={(e) => {
            const val = column.type === "number" ? Number(e.target.value) : e.target.value;
            handleChange(key, column.key, val);
          }}
          onBlur={handleSave}
          autoFocus={editingField === column.key}
          className="h-8"
        />
      );
    }

    return (
      <span
        className={column.editable ? "cursor-pointer" : ""}
        onDoubleClick={() => column.editable && handleEdit(record)}
      >
        {String(value ?? "")}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b"
                  style={{ width: col.width }}
                >
                  {col.title}
                </th>
              ))}
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b w-24">
                操作
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((record, index) => {
              const key = String(record[rowKey] || Math.random());
              return (
                <tr key={key} className="hover:bg-gray-50">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-2 border-b text-sm">
                      {renderCell(col, record, index)}
                    </td>
                  ))}
                  <td className="px-4 py-2 border-b">
                    <div className="flex gap-2">
                      {editingKey === key ? (
                        <Button variant="ghost" size="sm" onClick={handleCancel}>
                          取消
                        </Button>
                      ) : (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(record)}
                          >
                            编辑
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(record)}
                            className="text-red-600 hover:text-red-700"
                          >
                            删除
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {data.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="px-4 py-8 text-center text-gray-500"
                >
                  暂无数据
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {showAddButton && (
        <Button onClick={handleAdd} variant="outline">
          {addButtonText}
        </Button>
      )}
    </div>
  );
}
