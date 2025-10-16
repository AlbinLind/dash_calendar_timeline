import React, { useState } from "react";
import { DashComponentProps } from "../props";
import Timeline from "react-calendar-timeline";
import "react-calendar-timeline/dist/style.css";

type ItemPropsType = {
  className?: string;
  style?: React.CSSProperties;
};

type CalendarItem = {
  id: string | number;
  group: string | number;
  title: string;
  /** Unix timestamp in milliseconds */
  start_time: number;
  /** Unix timestamp in milliseconds */
  end_time: number;
  /** Can the item be moved */
  canMove?: boolean;
  /** Can the item be resized at all, and if so, can all or only one edge be resized?
   *
   * You cannot disable resizing. This is becuase dash does not
   * generate literal unions with primitive types well. See https://github.com/plotly/dash/issues/3017
   * "both": can be resized at both edges
   * "left": can only be resized at the left edge
   * "right": can only be resized at the right edge
   */
  canResize?: boolean | "left" | "right" | "both";
  /** Can the item be moved to a different group? */
  canChangeGroup?: boolean;
  itemProps?: ItemPropsType;
};

type Group = {
  id: string | number;
  title: string;
  rightTitle: string;
  stackItems?: boolean;
  height?: number;
};

type Props = {
  items: CalendarItem[];
  groups: Group[];
  /** Default start time for the timeline */
  default_time_start?: number;
  /** Default end time for the timeline */
  default_time_end?: number;
  /** Snap dragged items to a time interval (in milliseconds) */
  drag_snap?: number;
  min_zoom?: number;
  max_zoom?: number;
} & DashComponentProps;

function transformItems(items: CalendarItem[]): CalendarItem[] {
  return items.map((item) => ({
    ...item,
  }));
}

/**
 * Component description
 */
const DashCalendarTimeline = (props: Props) => {
  const { id, setProps } = props;

  const [items, setItems] = useState(transformItems(props.items));

  // HACK: we can't set defaultTimeStart to 0, so we have to set it to 1.
  const minStartTime = Math.max(
    Math.min(...items.map((item) => item.start_time)),
    1,
  );
  const maxEndTime = Math.max(
    ...items.map((item) => item.end_time),
    1000 * 60 * 60 * 24, // 1 day
  );
  // Add 12 hours of padding on each side
  const defaultTimeStart =
    props.default_time_start || minStartTime - 1000 * 60 * 60 * 12;
  const defaultTimeEnd =
    props.default_time_end || maxEndTime + 1000 * 60 * 60 * 12;

  const onItemMove = (
    itemId: string | number,
    dragTime: number,
    newGroupOrder: number,
  ) => {
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
        onItemMove={onItemMove}
      />
    </div>
  );
};

export default DashCalendarTimeline;
