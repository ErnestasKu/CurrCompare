import { useState, useRef, useEffect } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import useClickOutside from "../../utilities/useClickOutside";

export default function DropdownCurrency({
  data,
  selected,
  setSelected,
  disabled,
}) {
  const [open, setOpen] = useState(false);

  const ClickOutRef = useRef(null);
  useClickOutside(ClickOutRef, () => setOpen(false));

  return (
    <div ref={ClickOutRef} className="relative w-full">
      <button
        className={`
        w-full px-4 py-2
        flex items-center justify-between
        bg-bg-lighter border transition duration-200 rounded-xl
        ${open ? "border-primary" : "border-bg-border"}     text-left`}
        onClick={() => setOpen(!open)}
      >
        <span className="truncate">
          {selected === undefined || selected == null
            ? ""
            : data[selected].name}
        </span>

        <RiArrowDropDownLine
          className={`text-2xl ml-auto transform transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className="
          absolute mt-0.5 w-full p-1
          rounded-xl shadow-2xl border border-bg-lighter3/20 bg-bg-lighter
          divide-y divide-bg-lighter3/20
          overflow-hidden h-80 overflow-y-scroll z-1"
        >
          {Object.entries(data).map(([key, item], index) => (
            <button
              title={`(${item.symbol}) ${item.name}`}
              key={index}
              onClick={() => {
                setSelected(key);
                setOpen(false);
              }}
              className={`
              flex w-full px-3 py-2 rounded-lg text-left
              hover:bg-bg-lighter2
              disabled:bg-bg-lighter disabled:text-bg-lighter2 
              ${index === selected ? "text-primary font-semibold" : ""} `}
              disabled={key === disabled}
            >
              <span className=" mr-3 text-primary/60 font-mono w-8">
                {item.symbol}
              </span>
              <span className="truncate flex-1">{item.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
