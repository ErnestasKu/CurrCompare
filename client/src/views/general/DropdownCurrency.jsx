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
        className="w-full p-2 bg-bg-lighter flex items-center"
        onClick={() => setOpen(!open)}
      >
        {/* {selected === undefined || selected == null
          ? ""
          : valueBased
            ? selected
            : data[selected]} */}
        {selected === undefined || selected == null ? "" : selected.name}

        <RiArrowDropDownLine
          className={`text-2xl ml-auto transform transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className="
          absolute mt-0.5 w-full p-1
          rounded-xl shadow-2xl border border-bg-lighter3/20 bg-bg-lighter divide-y divide-bg-lighter3/20
          overflow-hidden h-42 overflow-y-scroll z-1"
        >
          {data.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                // valueBased ? setSelected(item) : setSelected(index);
                setSelected(item);
                setOpen(false);
              }}
              className={`
              flex w-full px-3 py-2 rounded-lg
              hover:bg-primary hover:text-bg-main
              disabled:bg-bg-lighter disabled:text-bg-lighter2 
              ${index === selected ? "text-primary font-semibold" : ""} `}
              disabled={item === disabled}
            >
              {`${item.name}`}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
