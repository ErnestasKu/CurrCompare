export default function MessageConfirmation({
  title,
  message,
  onClose,
  onConfirm,
}) {
  function handleConfirm() {
    onClose();
    onConfirm();
  }
  return (
    <div className="dark-cover">
      <div className="max-w-md border p-8 border-bg-border bg-bg-main rounded-xl mt-[20vh]">
        <div className="text-2xl font-semibold mb-4 text-center">{title}</div>
        <div className="text-xl mb-6 text-center font-semibold">{message}</div>

        <div className="flex justify-center space-x-2">
          <button
            onClick={onClose}
            className="flex-1 text-lg rounded-xl bg-bg-lighter p-3 font-semibold hover:bg-transparent border border-bg-border hover:border-primary"
          >
            No
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 text-lg rounded-xl bg-bg-lighter p-3 font-semibold hover:bg-transparent border border-bg-border hover:border-primary"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}
