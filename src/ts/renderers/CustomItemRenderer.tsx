import React from "react";

interface CustomItemRendererProps {
  item: any;
  itemContext: any;
  getItemProps: (props?: any) => any;
  getResizeProps: () => { left: any; right: any };
  onMouseEnter?: (e: React.MouseEvent) => void;
  onMouseLeave?: () => void;
}

export const CustomItemRenderer: React.FC<CustomItemRendererProps> = ({
  item,
  itemContext,
  getItemProps,
  getResizeProps,
  onMouseEnter,
  onMouseLeave,
}) => {
  const { left: leftResizeProps, right: rightResizeProps } = getResizeProps();
  const { key, ref, ...rest } = getItemProps(item.itemProps ?? {});
  const { useResizeHandle, selected } = itemContext;

  // Add class to resize handles based on selection state
  const resizeHandleClass = selected ? "rct-resize-handle-visible" : "rct-resize-handle-hidden";

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      {...rest}
      ref={ref}
      key={`${key}-outer`}
      isfixed={item.is_fixed ? "true" : "false"}
    >
      {useResizeHandle ? (
        <div
          {...leftResizeProps}
          key={`${key}-lr`}
          className={`${leftResizeProps.className || ""} ${resizeHandleClass}`.trim()}
        />
      ) : null}

      <div
        className="rct-item-content"
        style={{ maxHeight: `${itemContext.dimensions.height}` }}
        key={`${key}-content`}
      >
        {itemContext.title}
      </div>

      {useResizeHandle ? (
        <div
          {...rightResizeProps}
          key={`${key}-rr`}
          className={`${rightResizeProps.className || ""} ${resizeHandleClass}`.trim()}
        />
      ) : null}
    </div>
  );
};
