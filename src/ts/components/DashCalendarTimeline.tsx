import React, { useState } from "react";
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
  const [selectedItem, setSelectedItem] = useState<SelectedCalendarItemProps | undefined>(
    undefined,
  );

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
    setItems((items) =>
      items.map((item) =>
        item.id === itemId
          ? Object.assign({}, item, {
              start_time: dragTime,
              end_time: dragTime + (item.end_time - item.start_time),
              group: group.id,
            })
          : item,
      ),
    );
    setProps({ items: items });
  };

  const onItemSelect = (itemId: string | number, e: React.MouseEvent) => {
    // Only respond to left clicks
    if (e.button !== 0) {
      return;
    }
    if (selectedItem && selectedItem.id !== itemId) {
      setProps({ clickedItem: undefined, selectedItemInput: undefined });
      setSelectedItem(undefined);
      return;
    }
  };

  const onItemClick = (itemId: string | number, e: React.MouseEvent, time: number) => {
    // Only respond to left clicks
    if (e.button !== 0) {
      return;
    }
    if (selectedItem && selectedItem.id === itemId) {
      setProps({ clickedItem: undefined, selectedItemInput: undefined });
      setSelectedItem(undefined);
      return;
    }
    const item = items.find((item) => item.id === itemId);
    setProps({ clickedItem: { item } });
    setSelectedItem({
      ...item,
      mousePosition: { x: e.clientX, y: e.clientY },
    } as SelectedCalendarItemProps);
  };

  const onItemDeselect = () => {
    setSelectedItem(undefined);
    setProps({ clickedItem: undefined, selectedItemInput: undefined });
  };

  const onItemResize = (itemId: string | number, time: number, edge: "left" | "right") => {
    setItems((items) =>
      items.map((item) =>
        item.id === itemId
          ? Object.assign({}, item, {
              start_time: edge === "left" ? time : item.start_time,
              end_time: edge === "right" ? time : item.end_time,
            })
          : item,
      ),
    );
    setProps({ items: items });
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
        useResizeHandle={props.use_resize_handle ? false : true}
        onItemMove={onItemMove}
        onItemSelect={onItemSelect}
        onItemClick={onItemClick}
        onItemDeselect={onItemDeselect}
        onItemResize={onItemResize}
      />
      <SelectedItemInfo
        item={selectedItem}
        setProps={setProps}
        selectedItemProps={props.selectedItemInput}
      />
    </div>
  );
};

export default DashCalendarTimeline;
