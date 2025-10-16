import React, { useState } from "react";
import { DashComponentProps, setPropsType } from "../props";
import Timeline from "react-calendar-timeline";
import "react-calendar-timeline/dist/style.css";
import "../styles/selected-item.css";

type ItemPropsType = {
  className?: string;
  //style?: React.CSSProperties;
  /**
   * Dict with CSS styles to apply to the item
   */
  style?: Record<string, any>;
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
  /** Hover information for the item, can be html to show. */
  hoverInfo?: string;
};

type SelectedCalendarItemProps = {
  mousePosition: { x: number; y: number };
  inputs?: { [key: string]: React.InputHTMLAttributes<HTMLInputElement> };
} & CalendarItem;

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
  // ========== Callbacks ==========
  /** The item that was clicked, if any. */
  clickedItem?: CalendarItem;
  selectedItemInput?: Record<string, any>;
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
  const [selectedItem, setSelectedItem] = useState<
    SelectedCalendarItemProps | undefined
  >(undefined);

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

  const onItemSelect = (
    itemId: string | number,
    e: React.MouseEvent,
    time: number,
  ) => {
    const item = items.find((item) => item.id === itemId);
    setProps({ clickedItem: { item } });
    setSelectedItem({
      ...item,
      mousePosition: { x: e.clientX, y: e.clientY },
    } as SelectedCalendarItemProps);
  };
  const onItemDeselect = () => {
    setSelectedItem(undefined);
    setProps({ clickedItem: undefined });
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
        onItemSelect={onItemSelect}
        onItemClick={onItemSelect}
        onItemDeselect={onItemDeselect}
      />
      <SelectedItemInfo
        item={selectedItem}
        setProps={setProps}
        selectedItemProps={props.selectedItemInput}
      />
    </div>
  );
};

function SelectedItemInfo({
  item,
  setProps,
  selectedItemProps,
}: {
  item?: SelectedCalendarItemProps;
  setProps: setPropsType;
  selectedItemProps?: Record<string, any>;
}) {
  console.log("Rendering SelectedItemInfo with item:", item);
  if (item == null) {
    return <></>;
  }
  let x = item.mousePosition.x;
  let y = item.mousePosition.y;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
      }}
      className="selected-item-info"
    >
      <b>{item.title}</b>
      <br />
      Start: {new Date(item.start_time).toLocaleString()}
      <br />
      End: {new Date(item.end_time).toLocaleString()}
      <br />
      Group: {item.group}
      <br />
      {item.hoverInfo && (
        <div dangerouslySetInnerHTML={{ __html: item.hoverInfo }}></div>
      )}
      {/*Dynamically add inputs and update props*/}
      {item.inputs &&
        Object.entries(item.inputs).map(([key, input], index) => {
          return (
            <div key={index}>
              <label htmlFor={input.id}>{key}</label>
              <input
                {...input}
                onChange={(e) => {
                  if (input.onChange) {
                    input.onChange(e);
                  }
                  const value =
                    e.target.type === "checkbox"
                      ? e.target.checked
                      : e.target.value;
                  setProps({
                    selectedItemInput: {
                      ...selectedItemProps,
                      [key]: value,
                    },
                  });
                }}
              />
            </div>
          );
        })}
    </div>
  );
}

export default DashCalendarTimeline;
