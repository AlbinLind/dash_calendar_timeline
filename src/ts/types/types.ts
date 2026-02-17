import { DashComponentProps, setPropsType } from "props";
import React from "react";

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
  /** SKU number for the item */
  sku?: number;
  /** Hide the is fixed checkbox in the selected item info */
  hide_is_fixed?: boolean;
  /** Is the item fixed in position */
  is_fixed?: boolean;
  legend?: string;
  /** If you want some input fields to be shown for the item, you can specify them here.
   *
   * When the input field changes it will update the `selectedItemInput` prop with the new values.
   * Which can be used in a callback to update the item data.
   */
  inputs?: { [key: string]: Record<string, any> };
};

export type Group = {
  id: string | number;
  title: string;
  rightTitle: string;
  stackItems?: boolean;
  height?: number;
};

export type RightClickEvent = {
  /**
   * The time (in milliseconds since epoch) where the right click happened.
   */
  time: number;
  /** The group id where the right click happened */
  group_id: string | number;
  /** The option that was clicked, defined in the context menu */
  option: string;
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
  line_height?: number;
  item_height_ratio?: number;
  /** Options to show in the right click context menu */
  context_menu_options?: string[];
  visible_time_start?: number;
  visible_time_end?: number;
  enable_external_drop?: boolean;
  /** Enable week headers when zoomed between 1 and 2 weeks visible. Defaults to false */
  enable_week_headers?: boolean;
  /** Maximum number of days visible to show week headers. Defaults to 21 (3 weeks) */
  week_header_max_days?: number;
  /** Legend items that are not selected */
  deselected_legend_items?: string[];
  top_left_sidebar_content?: React.ReactNode;
  /** dayjs locale to use for date formatting. Defaults to 'en'. Should be one of "en", "de", "sv", "nl" */
  locale?: string;

  /** Should you only be able to resize from the ends? Defaults to true */
  use_resize_handle?: boolean;
  /** Change the title of the sku entry. */
  sku_alternative_name?: string;
  // ========== Callbacks ==========
  /** The item that was clicked, if any. */
  clickedItem?: CalendarItem;
  selectedItemInput?: Record<string, any>;
  rightClickedItem?: CalendarItem;
  rightClickedEvent?: RightClickEvent;
  /** SKU number of the item that was changed for the selected item */
  skuChanged?: number;
  /** Is fixed value of the item that was changed for the selected item */
  isFixedChanged?: boolean;
  externalDrop?: {
    data: any;
    time: number;
    group_id: string | number;
  };
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
} & CalendarItem;

export type SelectedItemInfoProps = {
  item?: SelectedCalendarItemProps;
  setProps: setPropsType;
  selectedItemProps?: Record<string, any>;
  onDelete: (itemId: string | number) => void;
  onItemFix: (itemId: string | number, isFixed: boolean) => void;
  onSkuChange: (itemId: string | number, sku: number) => void;
  onStartTimeChange: (itemId: string | number, startTime: number) => void;
  onEndTimeChange: (itemId: string | number, endTime: number) => void;
  skuAlternativeName?: string;
};
export type rightClickProps = {
  contextItems: string[];
  mouseEvent: React.MouseEvent;
  time: number;
  groupId: string | number;
  onClickEvent: (option: string) => void;
};
