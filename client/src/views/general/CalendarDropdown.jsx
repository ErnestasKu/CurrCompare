import { useState, useRef } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import useClickOutside from "../../utilities/useClickOutside";

export default function CalendarDropdown({
  data,
  selected,
  onChange,
  widthClass = "w-32",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  useClickOutside(containerRef, () => setIsOpen(false));

  return (
    <div ref={containerRef} className={`relative ${widthClass}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-2 py-1 text-sm font-bold transition-colors rounded-md bg-bg-dark2 hover:bg-bg-lighter2 text-txt-main"
      >
        <span>{selected}</span>
        <RiArrowDropDownLine
          className={`text-xl transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 z-20 w-full mt-1 overflow-y-auto border shadow-xl max-h-60 bg-bg-dark2 border-bg-border rounded-xl">
          {data.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                onChange(item);
                setIsOpen(false);
              }}
              className={`w-full px-3 py-1.5 text-left text-sm hover:bg-bg-lighter2 ${
                selected === item ? "text-primary font-bold" : "text-txt-main"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
