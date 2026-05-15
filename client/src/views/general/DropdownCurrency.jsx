import { useState, useRef, useEffect } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import useClickOutside from "../../utilities/useClickOutside";
import { IoSearchOutline } from "react-icons/io5";

// undefined selected = add currency button
// disbaled = greyed out options
// isDisables = is button functional
export default function DropdownCurrency({
  data,
  selected,
  setSelected,
  disabled,
  isDisabled,
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const filteredData = Object.entries(data).filter(
    ([key, item]) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      key.toLowerCase().includes(search.toLowerCase()),
  );

  const handleToggle = () => {
    if (!isDisabled) {
      setOpen(!open);
    }
  };

  const ClickOutRef = useRef(null);
  useClickOutside(ClickOutRef, () => setOpen(false));

  return (
    <div ref={ClickOutRef} className="relative w-full">
      {selected ? (
        <button
          disabled={isDisabled}
          className={`
            page-select-field
            flex items-center justify-between
            ${open ? "border-primary" : ""} 
            ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={handleToggle}
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
      ) : (
        <button
          disabled={isDisabled}
          className={`
            flex items-center justify-center
            hover:text-primary page-select-field
            ${open ? "border-primary" : "border-bg-border"} 
            ${isDisabled ? "cursor-not-allowed opacity-50" : ""}`}
          onClick={handleToggle}
        >
          <span className="leading-none uppercase tracking-wider text-xl">
            + Add currency
          </span>
        </button>
      )}
      {open && (
        <div
          className="
          absolute mt-0.5 w-full p-1
          rounded-xl shadow-2xl border border-bg-lighter3/20 bg-bg-lighter
          divide-y divide-bg-lighter3/20
          overflow-hidden h-80 overflow-y-scroll z-1"
        >
          <div className="flex items-center px-3 py-2 bg-bg-dark/30 rounded-t-lg">
            <IoSearchOutline className="text-txt-dark mr-2 text-xl" />
            <input
              autoFocus
              type="text"
              placeholder="Search currency..."
              className="text-sm outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {filteredData.length > 0 ? (
            filteredData.map(([key, item], index) => (
              <button
                title={`${item.name} (${key})`}
                key={index}
                onClick={() => {
                  setSelected(key);
                  setOpen(false);
                }}
                className={`
              flex w-full px-3 py-2 rounded-lg text-left
              hover:bg-bg-lighter2
              disabled:bg-bg-lighter disabled:text-bg-lighter2 
              ${key === selected ? "text-primary font-semibold" : ""} `}
                disabled={disabled?.includes(key)}
              >
                <span className=" mr-1 text-primary font-mono w-8 bg-bg-dark/50 text-center rounded text-xs flex items-center justify-center">
                  {item.symbol}
                </span>
                <span className="truncate flex-1 text-sm">{item.name}</span>
              </button>
            ))
          ) : (
            <div className="p-4 text-center text-xs text-txt-dark">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
