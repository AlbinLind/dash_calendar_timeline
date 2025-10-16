import { DashComponentProps, setPropsType } from "props";

export type CalendarItem = {
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
  /** Hover information for the item, can be html to show. */
  hoverInfo?: string;
};

export type Group = {
  id: string | number;
  title: string;
  rightTitle: string;
  stackItems?: boolean;
  height?: number;
};

export type Props = {
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
  // ========== Callbacks ==========
  /** The item that was clicked, if any. */
  clickedItem?: CalendarItem;
  selectedItemInput?: Record<string, any>;
} & DashComponentProps;

export type ItemPropsType = {
  className?: string;
  //style?: React.CSSProperties;
  /**
   * Dict with CSS styles to apply to the item
   */
  style?: Record<string, any>;
};

export type SelectedCalendarItemProps = {
  mousePosition: { x: number; y: number };
  inputs?: { [key: string]: React.InputHTMLAttributes<HTMLInputElement> };
} & CalendarItem;

export type SelectedItemInfoProps = {
  item?: SelectedCalendarItemProps;
  setProps: setPropsType;
  selectedItemProps?: Record<string, any>;
};
