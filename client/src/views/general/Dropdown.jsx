import { useState, useRef, useEffect } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import useClickOutside from "../../utilities/useClickOutside";

export default function Dropdown({
  data,
  selected,
  setSelected,
  disabled,
  valueBased,
  maxVisible = 5,
}) {
  const [open, setOpen] = useState(false);

  const ClickOutRef = useRef(null);
  useClickOutside(ClickOutRef, () => setOpen(false));

  const itemHeight = 46;
  const maxHeight = itemHeight * maxVisible;
  return (
    <div ref={ClickOutRef} className="relative w-full font-semibold text-txt-main">
      <button
        className="w-full p-2 bg-bg-lighter flex items-center rounded-lg"
        onClick={() => setOpen(!open)}
      >
        <span className="ms-2">
          {selected === undefined || selected == null
            ? ""
            : valueBased
              ? selected
              : data[selected]}
        </span>
        <RiArrowDropDownLine
          className={`text-2xl ml-auto transform transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className="
          absolute mt-0.5 w-full p-1
          rounded-xl shadow-2xl border border-bg-lighter3/20 bg-bg-lighter divide-y divide-bg-lighter3/20
          overflow-hidden overflow-y-scroll z-1"
          style={{ maxHeight: `${maxHeight}px` }}
        >
          {data.map((item, index) => (
            <button
              key={item}
              onClick={() => {
                valueBased ? setSelected(item) : setSelected(index);
                setOpen(false);
              }}
              className={`
              flex w-full px-3 py-2 rounded-lg
              hover:bg-primary hover:text-bg-main
              disabled:bg-bg-lighter disabled:text-bg-lighter2 
              ${(!valueBased && index === selected) || (valueBased && item == selected) ? "text-primary" : ""} `}
              disabled={
                (!valueBased && index === disabled) ||
                (valueBased && item == disabled)
              }
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
