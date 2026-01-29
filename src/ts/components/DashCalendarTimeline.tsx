import React, { useEffect, useRef, useState } from "react";
import Timeline, { TimelineHeaders, DateHeader, SidebarHeader } from "react-calendar-timeline";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import "react-calendar-timeline/dist/style.css";
import "../styles/selected-item.css";
import "../styles/base.css";
import "../styles/resize-handle.css";
import { SelectedItemInfo } from "../internal/components/SelectedItemInfo";
import { CalendarItem, Props, rightClickProps, SelectedCalendarItemProps } from "types/types";
import { RightClickOutsideHandler } from "../internal/components/RightClickOutsideHandler";
import { CustomItemRenderer } from "../renderers/CustomItemRenderer";

// Import all commonly used dayjs locales
import "dayjs/locale/de";
import "dayjs/locale/nl";
import "dayjs/locale/sv";

// Enable week of year plugin for dayjs
dayjs.extend(weekOfYear);

// Configure dayjs to start weeks on Monday (1) instead of Sunday (0)
dayjs.Ls.en.weekStart = 1;

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
  const { id, setProps, locale = "en" } = props;

  // Set dayjs locale (locales are preloaded via imports above)
  useEffect(() => {
    dayjs.locale(locale);
  }, [locale]);

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
  const timeChangeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setItems(transformItems(props.items));
  }, [props.items]);

  useEffect(() => {
    if (props.visible_time_start !== undefined) {
      setVisibleTimeStart(props.visible_time_start);
    }
    if (props.visible_time_end !== undefined) {
      setVisibleTimeEnd(props.visible_time_end);
    }
  }, [props.visible_time_start, props.visible_time_end]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeChangeTimeoutRef.current) {
        clearTimeout(timeChangeTimeoutRef.current);
      }
    };
  }, []);

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

  const onItemRightClick = (itemId: string | number, e: React.MouseEvent) => {
    if (props.rightClickedItem) {
      setProps({ rightClickedItem: undefined });
      return;
    }
    setProps({
      rightClickedItem: items.find((item) => item.id === itemId),
    });
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
    setProps({ clickedItem: undefined, selectedItemInput: undefined, rightClickedItem: undefined });
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

  // Custom item renderer with resize handles only visible when selected
  const itemRenderer = ({ item, itemContext, getItemProps, getResizeProps }: any) => {
    return (
      <CustomItemRenderer
        item={item}
        itemContext={itemContext}
        getItemProps={getItemProps}
        getResizeProps={getResizeProps}
        onMouseEnter={(e) => onMouseEnter(item.id, e)}
        onMouseLeave={onMouseLeave}
      />
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

    // Clear any existing timeout
    if (timeChangeTimeoutRef.current) {
      clearTimeout(timeChangeTimeoutRef.current);
    }

    // Set a new timeout to update props only after user stops interacting (debounce)
    timeChangeTimeoutRef.current = setTimeout(() => {
      setProps({
        visible_time_start: visibleTimeStart,
        visible_time_end: visibleTimeEnd,
      });
    }, 300); // Wait 300ms after the last change before updating props
  };

  /**
   * Determine the appropriate header units based on the visible time range
   * Returns [primaryUnit, secondaryUnit]
   *
   * Hierarchy: minute → hour → day → week → month → year
   */
  const getHeaderUnits = (): [string, string] => {
    if (!props.enable_week_headers) {
      return ["day", "day"];
    }

    const start = visibleTimeStart ?? defaultTimeStart;
    const end = visibleTimeEnd ?? defaultTimeEnd;
    const visibleDuration = end - start;
    const daysVisible = visibleDuration / (1000 * 60 * 60 * 24);

    // Default to 21 days (3 weeks) if not specified
    const maxWeekDays = props.week_header_max_days ?? 21;

    // Less than 2 days: show hours and days
    if (daysVisible < 2) {
      return ["day", "hour"];
    }

    // 2 days to maxWeekDays: show days (bottom) with week as primary (top)
    if (daysVisible <= maxWeekDays) {
      return ["week", "day"];
    }

    // maxWeekDays to ~60 days: show weeks (bottom) with months (top)
    if (daysVisible < 60) {
      return ["month", "week"];
    }

    // 60 to 365 days: show months (bottom) with year as primary (top)
    if (daysVisible < 365) {
      return ["year", "month"];
    }

    // More than 365 days: show years
    return ["year", "year"];
  };

  // Custom interval renderer to add primary header styling
  const primaryIntervalRenderer = ({ getIntervalProps, intervalContext }: any) => {
    const { key, ...rest } = getIntervalProps();
    return (
      <div {...rest} key={key} className="rct-dateHeader rct-dateHeader-primary">
        <span>{intervalContext.intervalText}</span>
      </div>
    );
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
      const group_id = props.groups[groupIdx].id;
      const start = visibleTimeStart ?? defaultTimeStart;
      const end = visibleTimeEnd ?? defaultTimeEnd;
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
        items={items.filter((item) =>
          props.deselected_legend_items
            ? !props.deselected_legend_items.includes(item.legend || "")
            : true,
        )}
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
        onItemContextMenu={onItemRightClick}
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
      >
        {props.enable_week_headers &&
          (() => {
            const [primaryUnit, secondaryUnit] = getHeaderUnits();

            // Custom label formatter for week headers to show "Week X" instead of "W"
            const weekLabelFormat = (
              [startTime, endTime]: [any, any],
              unit: string,
              labelWidth: number,
            ) => {
              if (unit === "week") {
                // Ensure we have a dayjs object
                const dayjsStart = dayjs.isDayjs(startTime) ? startTime : dayjs(startTime);
                const weekNumber = dayjsStart.week();
                return `Week ${weekNumber}`;
              }
              // For other units, use the default formatting
              const dayjsStart = dayjs.isDayjs(startTime) ? startTime : dayjs(startTime);
              return dayjsStart.format();
            };

            return (
              <TimelineHeaders>
                <SidebarHeader>
                  {({ getRootProps }) => {
                    return (
                      <div {...getRootProps()} className="sidebarHeader">
                        {props.top_left_sidebar_content}
                      </div>
                    );
                  }}
                </SidebarHeader>
                <DateHeader
                  unit={primaryUnit as any}
                  labelFormat={primaryUnit === "week" ? weekLabelFormat : undefined}
                  intervalRenderer={primaryIntervalRenderer}
                />
                <DateHeader
                  unit={secondaryUnit as any}
                  labelFormat={secondaryUnit === "week" ? weekLabelFormat : undefined}
                />
              </TimelineHeaders>
            );
          })()}
      </Timeline>
      {showContextMenu && <RightClickOutsideHandler {...showContextMenu} />}
      <SelectedItemInfo
        skuAlternativeName={props.sku_alternative_name}
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
          const fixedItem = items.find((item) => item.id === itemId);
          const newItems = items.map((item) => {
            if (item.group !== fixedItem.group) {
              return item;
            }
            if (!isFixed) {
              return { ...item, is_fixed: false };
            }
            if (item.start_time < fixedItem.end_time) {
              // If drp id exists on the item, we check that it is not negative
              // -2 is cleaning
              if (item["drp_id"] !== undefined && item["drp_id"] < 0 && item["drp_id"] !== -2) {
                return item;
              }
              return { ...item, is_fixed: true };
            }
            return item;
          });
          setItems(newItems);
          setProps({ items: newItems });
        }}
        onSkuChange={(itemId, sku) => {
          const newItems = items.map((item) => (item.id === itemId ? { ...item, sku: sku } : item));
          setItems(newItems);
          setProps({ items: newItems });
          setShownItemInfo((prev) => (prev ? { ...prev, sku: sku } : prev));
        }}
        onStartTimeChange={(itemId, startTime) => {
          const newItems = items.map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  start_time: startTime,
                  end_time: startTime - item.start_time + item.end_time,
                }
              : item,
          );
          setItems(newItems);
          setProps({ items: newItems });
          setShownItemInfo((prev) =>
            prev
              ? {
                  ...prev,
                  start_time: startTime,
                  end_time: startTime - prev.start_time + prev.end_time,
                }
              : prev,
          );
        }}
        onEndTimeChange={(itemId, endTime) => {
          const newItems = items.map((item) =>
            item.id === itemId ? { ...item, end_time: endTime } : item,
          );
          setItems(newItems);
          setProps({ items: newItems });
          setShownItemInfo((prev) => (prev ? { ...prev, end_time: endTime } : prev));
        }}
      />
    </div>
  );
};

export default DashCalendarTimeline;
