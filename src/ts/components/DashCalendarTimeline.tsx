import React, { useEffect, useRef, useState } from "react";
import Timeline from "react-calendar-timeline";
import "react-calendar-timeline/dist/style.css";
import "../styles/selected-item.css";
import "../styles/base.css";
import { SelectedItemInfo } from "../internal/components/SelectedItemInfo";
import { CalendarItem, Props, rightClickProps, SelectedCalendarItemProps } from "types/types";
import { RightClickOutsideHandler } from "../internal/components/RightClickOutsideHandler";

function transformItems(items: CalendarItem[]): CalendarItem[] {
  return items.map((item) => ({
    canResize: "both",
    ...item,
  }));
}

/**
 * Component description
 */
const DashCalendarTimeline = (props: Props) => {
  const { id, setProps } = props;

  const [items, setItems] = useState(transformItems(props.items));
  const [visibleTimeStart, setVisibleTimeStart] = useState<number | undefined>(
    props.visible_time_start,
  );
  const [visibleTimeEnd, setVisibleTimeEnd] = useState<number | undefined>(props.visible_time_end);
  const [shownItemInfo, setShownItemInfo] = useState<SelectedCalendarItemProps | undefined>(
    undefined,
  );
  const [hasSelectedItem, setHasSelectedItem] = useState<boolean>(false);
  const [showContextMenu, setShowContextMenu] = useState<rightClickProps | undefined>(undefined);
  const timelineRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setItems(transformItems(props.items));
  }, [props.items]);

  useEffect(() => {
    if (props.visible_time_start !== undefined) {
      setVisibleTimeStart(props.visible_time_start);
      setProps({
        visible_time_start: undefined,
      });
    }
    if (props.visible_time_end !== undefined) {
      setVisibleTimeEnd(props.visible_time_end);
      setProps({
        visible_time_end: undefined,
      });
    }
  }, [props.visible_time_start, props.visible_time_end]);

  // HACK: we can't set defaultTimeStart to 0, so we have to set it to 1.
  const minStartTime = Math.max(Math.min(...items.map((item) => item.start_time)), 1);
  const maxEndTime = Math.max(
    ...items.map((item) => item.end_time),
    1000 * 60 * 60 * 24, // 1 day
  );
  // Add 12 hours of padding on each side
  const defaultTimeStart = props.default_time_start || minStartTime - 1000 * 60 * 60 * 12;
  const defaultTimeEnd = props.default_time_end || maxEndTime + 1000 * 60 * 60 * 12;

  const onItemMove = (itemId: string | number, dragTime: number, newGroupOrder: number) => {
    const group = props.groups[newGroupOrder];
    const newItems = items.map((item) =>
      item.id === itemId
        ? Object.assign({}, item, {
            start_time: dragTime,
            end_time: dragTime + (item.end_time - item.start_time),
            group: group.id,
          })
        : item,
    );
    setItems(newItems);
    setProps({ items: newItems });
  };

  const onItemSelect = (itemId: string | number, e: React.MouseEvent) => {
    // Only respond to left clicks
    if (e.button !== 0) {
      return;
    }
    if (!hasSelectedItem && shownItemInfo?.id === itemId) {
      setHasSelectedItem(true);
      setProps({ clickedItem: shownItemInfo });
      return;
    }
    const item = items.find((item) => item.id === itemId);
    setShownItemInfo({
      ...item,
      mousePosition: { x: e.clientX, y: e.clientY },
    } as SelectedCalendarItemProps);
    setProps({ clickedItem: item });
    setHasSelectedItem(true);
  };

  const onItemClick = (itemId: string | number, e: React.MouseEvent, time: number) => {
    // Only respond to left clicks
    if (e.button !== 0) {
      return;
    }
    if (hasSelectedItem) {
      setShownItemInfo(undefined);
      setProps({ clickedItem: undefined, selectedItemInput: undefined });
      setHasSelectedItem(false);
    } else {
      const item = items.find((item) => item.id === itemId);
      setShownItemInfo({
        ...item,
        mousePosition: { x: e.clientX, y: e.clientY },
      } as SelectedCalendarItemProps);
      setProps({ clickedItem: item });
      setHasSelectedItem(true);
    }
  };

  const onItemDeselect = () => {
    setShownItemInfo(undefined);
    setProps({ clickedItem: undefined, selectedItemInput: undefined });
    setHasSelectedItem(false);
  };

  const onItemResize = (itemId: string | number, time: number, edge: "left" | "right") => {
    const newItems = items.map((item) =>
      item.id === itemId
        ? Object.assign({}, item, {
            start_time: edge === "left" ? time : item.start_time,
            end_time: edge === "right" ? time : item.end_time,
          })
        : item,
    );
    setItems(newItems);
    setProps({ items: newItems });
  };

  const onMouseEnter = (itemId: string | number, e: React.MouseEvent) => {
    if (hasSelectedItem) {
      return;
    }
    // Show the selected item info on hover
    const item = items.find((item) => item.id === itemId);
    setShownItemInfo({
      ...item,
      mousePosition: { x: e.clientX, y: e.clientY },
    } as SelectedCalendarItemProps);
  };

  const onMouseLeave = () => {
    // Hide the selected item info when not hovering
    if (!hasSelectedItem) {
      setShownItemInfo(undefined);
    }
  };

  // Slightly modfied default item renderer from react-calendar-timeline to add mouse events
  const itemRenderer = ({ item, itemContext, getItemProps, getResizeProps }: any) => {
    const { left: leftResizeProps, right: rightResizeProps } = getResizeProps();
    const { key, ref, ...rest } = getItemProps(item.itemProps ?? {});
    const { useResizeHandle } = itemContext;

    return (
      <div
        onMouseEnter={(e) => onMouseEnter(item.id, e)}
        onMouseLeave={onMouseLeave}
        {...rest}
        ref={ref}
        key={`${key}-outer`}
        isfixed={item.is_fixed ? "true" : "false"}
      >
        {useResizeHandle ? <div {...leftResizeProps} key={`${key}-lr`} /> : null}

        <div
          className="rct-item-content"
          style={{ maxHeight: `${itemContext.dimensions.height}` }}
          key={`${key}-content`}
        >
          {itemContext.title}
        </div>

        {useResizeHandle ? <div {...rightResizeProps} key={`${key}-rr`} /> : null}
      </div>
    );
  };

  const onCanvasContextMenu = (groupId: string | number, time: number, e: React.MouseEvent) => {
    if (!props.context_menu_options) {
      return;
    }
    e.preventDefault();
    setShowContextMenu({
      contextItems: props.context_menu_options || [],
      mouseEvent: e,
      time: time,
      groupId: groupId,
      onClickEvent: (option: string) => {
        setShowContextMenu(undefined);
        setProps({
          rightClickedEvent: {
            time: time,
            group_id: groupId,
            option: option,
          },
        });
      },
    });
  };

  const onTimeChange = (
    visibleTimeStart: number,
    visibleTimeEnd: number,
    updateScrollCanvas: (start: number, end: number, forceUpdateDimensions?: boolean) => void,
  ) => {
    setVisibleTimeStart(visibleTimeStart);
    setVisibleTimeEnd(visibleTimeEnd);
    updateScrollCanvas(visibleTimeStart, visibleTimeEnd);
  };

  useEffect(() => {
    if (!props.enable_external_drop) {
      return;
    }

    const canvas = timelineRef.current?.querySelector<HTMLDivElement>(".rct-scroll");
    if (!canvas || !setProps) {
      return;
    }

    const handleDragOver = (event: DragEvent) => {
      event.preventDefault();
      event.dataTransfer && (event.dataTransfer.dropEffect = "copy");
    };

    const handleDrop = (event: DragEvent) => {
      event.preventDefault();
      const raw = event.dataTransfer?.getData("application/json");
      if (!raw || props.groups.length === 0) {
        return;
      }

      const payload = JSON.parse(raw);
      const rect = canvas.getBoundingClientRect();
      const lineHeight = props.line_height ?? 60;

      const offsetX = event.clientX - rect.left;
      const offsetY = event.clientY - rect.top;

      const groupIdx = Math.min(Math.floor(offsetY / lineHeight), props.groups.length - 1);
      console.log("Calculated group index:", groupIdx);
      const group_id = props.groups[groupIdx].id;
      console.log("Groups", props.groups);
      console.log("Calculated group id:", group_id);
      const start = visibleTimeStart ?? defaultTimeStart;
      const end = visibleTimeEnd ?? defaultTimeEnd;
      console.log("Calculating drop time with:", {
        offsetX,
        rect,
        canvas,
        visibleTimeStart,
        visibleTimeEnd,
        start,
        end,
      }); // Debug log
      const dropTime = start + (offsetX / rect.width) * (end - start);

      setProps({
        externalDrop: {
          data: payload,
          group_id: props.groups[groupIdx].id,
          time: dropTime,
        },
      });
    };

    canvas.addEventListener("dragover", handleDragOver);
    canvas.addEventListener("drop", handleDrop);
    return () => {
      canvas.removeEventListener("dragover", handleDragOver);
      canvas.removeEventListener("drop", handleDrop);
    };
  }, [
    props.enable_external_drop,
    props.groups,
    visibleTimeStart,
    visibleTimeEnd,
    defaultTimeStart,
    defaultTimeEnd,
    setProps,
  ]);

  return (
    <div id={id} ref={timelineRef}>
      <Timeline
        groups={props.groups}
        items={items}
        defaultTimeStart={defaultTimeStart}
        defaultTimeEnd={defaultTimeEnd}
        dragSnap={props.drag_snap}
        minZoom={props.min_zoom}
        maxZoom={props.max_zoom}
        lineHeight={props.line_height}
        itemHeightRatio={props.item_height_ratio}
        useResizeHandle={props.use_resize_handle ? false : true}
        onItemMove={onItemMove}
        onItemSelect={onItemSelect}
        onItemClick={onItemClick}
        onItemDeselect={onItemDeselect}
        onItemResize={onItemResize}
        onItemDrag={() => {
          setHasSelectedItem(false);
          setShownItemInfo(undefined);
        }}
        itemRenderer={itemRenderer}
        onCanvasContextMenu={onCanvasContextMenu}
        onCanvasClick={() => {
          setShowContextMenu(undefined);
        }}
        onTimeChange={onTimeChange}
        visibleTimeStart={visibleTimeStart}
        visibleTimeEnd={visibleTimeEnd}
      />
      {showContextMenu && <RightClickOutsideHandler {...showContextMenu} />}
      <SelectedItemInfo
        item={shownItemInfo}
        setProps={setProps}
        selectedItemProps={props.selectedItemInput}
        onDelete={(itemId) => {
          const newItems = items.filter((item) => item.id !== itemId);
          setItems(newItems);
          setProps({ items: newItems, clickedItem: undefined, selectedItemInput: undefined });
          setShownItemInfo(undefined);
        }}
        onItemFix={(itemId, isFixed) => {
          const newItems = items.map((item) =>
            item.id === itemId ? { ...item, is_fixed: isFixed } : item,
          );
          setItems(newItems);
          setProps({ items: newItems });
        }}
        onSkuChange={(itemId, sku) => {
          const newItems = items.map((item) => (item.id === itemId ? { ...item, sku: sku } : item));
          setItems(newItems);
          setProps({ items: newItems });
        }}
      />
    </div>
  );
};

export default DashCalendarTimeline;
