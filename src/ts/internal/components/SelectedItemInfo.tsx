import React, { useEffect, useState } from "react";

import { SelectedItemInfoProps } from "types/types";

export function SelectedItemInfo({
  item,
  setProps,
  selectedItemProps,
  onDelete,
  onItemFix,
  onSkuChange,
}: SelectedItemInfoProps) {
  const [sku, setSku] = useState<number>(item?.sku || 0);
  const [isFixed, setIsFixed] = useState<boolean>(item?.is_fixed || false);

  useEffect(() => {
    setSku(item?.sku || 0);
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
        <div>
          <label htmlFor="sku-input">SKU</label>
          <input
            type="number"
            name="SKU"
            id="sku-input"
            value={sku}
            onChange={(e) => {
              setSku(Number(e.target.value));
              setProps({
                skuChanged: Number(e.target.value),
              });
              onSkuChange(item.id, Number(e.target.value));
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
