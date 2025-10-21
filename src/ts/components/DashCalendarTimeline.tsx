import React, { useEffect, useState } from "react";
import Timeline from "react-calendar-timeline";
import "react-calendar-timeline/dist/style.css";
import "../styles/selected-item.css";
import "../styles/base.css";
import { SelectedItemInfo } from "../internal/components/SelectedItemInfo";
import { CalendarItem, Props, SelectedCalendarItemProps } from "types/types";

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
  const [shownItemInfo, setShownItemInfo] = useState<SelectedCalendarItemProps | undefined>(
    undefined,
  );
  const [hasSelectedItem, setHasSelectedItem] = useState<boolean>(false);

  useEffect(() => {
    setItems(transformItems(props.items));
  }, [props.items]);

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
    }
    if (!hasSelectedItem) {
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

  return (
    <div id={id}>
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
        itemRenderer={itemRenderer}
      />
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
      />
    </div>
  );
};

export default DashCalendarTimeline;
