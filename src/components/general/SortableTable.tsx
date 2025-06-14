// SortableTable.tsx
import React, { useContext, useMemo } from "react";
import { HolderOutlined } from "@ant-design/icons";
import type { DragEndEvent, UniqueIdentifier } from "@dnd-kit/core";
import { DndContext } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button, Table, TableProps } from "antd";

interface RowContextProps {
  setActivatorNodeRef?: (element: HTMLElement | null) => void;
  listeners?: SyntheticListenerMap;
}

const RowContext = React.createContext<RowContextProps>({});

export const DragHandle: React.FC<{ disabled?: boolean }> = ({ disabled }) => {
  const { setActivatorNodeRef, listeners } = useContext(RowContext);
  return (
    <Button
      type="text"
      size="small"
      icon={<HolderOutlined />}
      style={{ cursor: disabled ? "not-allowed" : "move" }}
      ref={setActivatorNodeRef}
      {...(!disabled ? listeners : {})}
      disabled={disabled}
    />
  );
};

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  "data-row-key": string;
}

const Row: React.FC<RowProps> = (props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props["data-row-key"] });

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Translate.toString(transform),
    transition,
    ...(isDragging ? { position: "relative", zIndex: 9999 } : {}),
  };

  const contextValue = useMemo<RowContextProps>(
    () => ({ setActivatorNodeRef, listeners }),
    [setActivatorNodeRef, listeners]
  );

  return (
    <RowContext.Provider value={contextValue}>
      <tr
        onClick={(e) => {
          // 阻止冒泡，避免拖拽干扰
          const target = e.target as Element;
          if (target.closest(".ant-table-row-expand-icon")) {
            e.stopPropagation();
          }
        }}
        {...props}
        ref={setNodeRef}
        style={style}
        {...attributes}
      />
    </RowContext.Provider>
  );
};

interface SortableTableProps<T extends { id: UniqueIdentifier; index?: number }>
  extends TableProps<T> {
  onDragEnd?: (data: T[]) => void;
  sortable?: boolean;
  rowKey?: keyof T; // 改为可选，默认使用 'id'
}

export function SortableTable<
  T extends {
    id: UniqueIdentifier;
    index?: number;
    parentId?: number | undefined;
  }
>({
  dataSource = [],
  onDragEnd,
  sortable = true,
  rowKey = "id", // 默认使用 'id'
  ...props
}: SortableTableProps<T>) {
  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const activeItem = dataSource.find(
      (item) => item[rowKey as keyof T] === active.id
    );
    const overItem = dataSource.find(
      (item) => item[rowKey as keyof T] === over.id
    );
    // if (
    //   activeItem?.parentId &&
    //   !overItem?.parentId &&
    //   activeItem.parentId !== overItem?.id
    // ) {
    //   return;
    // }
    const newData = arrayMove(
      [...dataSource],
      dataSource.findIndex((item) => item[rowKey as keyof T] === active.id),
      dataSource.findIndex((item) => item[rowKey as keyof T] === over.id)
    );

    // 更新index字段
    const dataWithIndex = newData.map((item, index) => ({
      ...item,
      index: index + 1,
    }));

    onDragEnd?.(dataWithIndex);
  };

  return (
    <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={handleDragEnd}>
      <SortableContext
        items={dataSource?.map((item) => {
          const id = item[rowKey as keyof T];
          // 确保返回的是 UniqueIdentifier 或 { id: UniqueIdentifier }
          return typeof id === "string" || typeof id === "number"
            ? id
            : { id: String(id) };
        })}
        strategy={verticalListSortingStrategy}
      >
        <Table<T>
          {...props}
          dataSource={dataSource}
          rowKey={rowKey}
          components={{
            body: {
              row: Row,
            },
          }}
        />
      </SortableContext>
    </DndContext>
  );
}

export default SortableTable;
