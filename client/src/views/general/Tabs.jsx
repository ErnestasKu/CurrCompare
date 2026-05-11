export default function Tabs({ setTab, Tab, options, labels }) {
  return (
    <div className="flex bg-bg-dark rounded-lg p-1 border border-bg-border w-fit">
      {options.map((option, index) => (
        <button
          key={option}
          onClick={() => setTab(option)}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm transition-all ${
            Tab === option
              ? "bg-primary text-bg-dark shadow-lg font-bold"
              : "font-semibold text-txt-dark hover:text-txt-main"
          }`}
        >
          {labels && labels[index]}
        </button>
      ))}
    </div>
  );
}
