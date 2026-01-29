import React, { useEffect, useState } from "react";

import { SelectedItemInfoProps } from "types/types";

export function SelectedItemInfo({
  item,
  setProps,
  selectedItemProps,
  onDelete,
  onItemFix,
  onSkuChange,
  onStartTimeChange,
  onEndTimeChange,
  skuAlternativeName,
}: SelectedItemInfoProps) {
  const [sku, setSku] = useState<number | string>(item?.sku || "");
  const [isFixed, setIsFixed] = useState<boolean>(item?.is_fixed || false);

  useEffect(() => {
    setSku(item?.sku || "");
    setIsFixed(item?.is_fixed || false);
  }, [item]);

  if (item === undefined) {
    return <></>;
  }

  let x = item.mousePosition.x + 5;
  let y = item.mousePosition.y + 5;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
      }}
      className="selected-item-info"
    >
      <div className="selected-item-info-inputs">
        <button type="button" onClick={() => onDelete(item.id)}>
          🗑
        </button>
        {item.hide_is_fixed ? (
          <div></div>
        ) : (
          <div>
            <label htmlFor="is-fixed-check">Is Fixed</label>
            <input
              type="checkbox"
              name="Is Fixed"
              id="is-fixed-check"
              checked={isFixed}
              onChange={(e) => {
                setIsFixed(e.target.checked);
                setProps({
                  isFixedChanged: e.target.checked,
                });
                onItemFix(item.id, e.target.checked);
              }}
            />
          </div>
        )}
        <div>
          <label htmlFor="sku-input">{skuAlternativeName || "SKU"}</label>
          <input
            type="number"
            name={skuAlternativeName || "SKU"}
            id="sku-input"
            min={0}
            value={sku}
            onChange={(e) => {
              if (e.target.value === "") {
                setSku("");
                return;
              }
              if (Number(e.target.value) < 0 || isNaN(Number(e.target.value))) {
                return;
              }
              setSku(Number(e.target.value));
              setProps({
                skuChanged: Number(e.target.value),
              });
              onSkuChange(item.id, Number(e.target.value));
            }}
          />
        </div>
        <div>
          <label htmlFor="start-time-input">Start Time</label>
          <input
            type="datetime-local"
            id="start-time-input"
            value={new Date(item.start_time - new Date().getTimezoneOffset() * 60000)
              .toISOString()
              .slice(0, 16)}
            onChange={(e) => {
              const localTime = new Date(e.target.value).getTime();
              setProps({
                startTimeChanged: localTime,
              });
              onStartTimeChange && onStartTimeChange(item.id, localTime);
            }}
          />
        </div>

        <div>
          <label htmlFor="end-time-input">End Time</label>
          <input
            type="datetime-local"
            id="end-time-input"
            value={new Date(item.end_time - new Date().getTimezoneOffset() * 60000)
              .toISOString()
              .slice(0, 16)}
            onChange={(e) => {
              const localTime = new Date(e.target.value).getTime();
              setProps({
                endTimeChanged: localTime,
              });
              onEndTimeChange && onEndTimeChange(item.id, localTime);
            }}
          />
        </div>
      </div>
      {item.hoverInfo && <div dangerouslySetInnerHTML={{ __html: item.hoverInfo }}></div>}
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
                  const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
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
