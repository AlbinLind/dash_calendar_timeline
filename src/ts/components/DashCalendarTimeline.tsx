import React from "react";
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
  can_move?: boolean;
  /** Can the item be resized at all, and if so, can all or only one edge be resized? */
  can_resize?: boolean | "left" | "right";
  /** Can the item be moved to a different group? */
  can_change_group?: boolean;
  item_props?: ItemPropsType;
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
} & DashComponentProps;

/**
 * Component description
 */
const DashCalendarTimeline = (props: Props) => {
  const { id } = props;

  // HACK: we can't set defaultTimeStart to 0, so we have to set it to 1.
  const minStartTime = Math.max(
    Math.min(...props.items.map((item) => item.start_time), 0),
    1,
  );
  const maxEndTime = Math.max(
    ...props.items.map((item) => item.end_time),
    20000,
  );
  const defaultTimeStart = props.default_time_start || minStartTime;
  const defaultTimeEnd = props.default_time_end || maxEndTime;
  console.log(defaultTimeStart, defaultTimeEnd);

  return (
    <div id={id}>
      <Timeline
        groups={props.groups}
        items={props.items}
        defaultTimeStart={defaultTimeStart}
        defaultTimeEnd={defaultTimeEnd}
      />
    </div>
  );
};

export default DashCalendarTimeline;
