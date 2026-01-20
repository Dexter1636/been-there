'use client';

interface AddTripButtonProps {
  onClick?: () => void;
  disabled?: boolean;
}

export function AddTripButton({
  onClick = () => console.log('添加一次旅程'),
  disabled = false,
}: AddTripButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="
        fixed bottom-8 right-8 z-10
        bg-orange-600 hover:bg-orange-700
        text-white font-medium
        px-6 py-3 rounded-lg
        shadow-lg
        transition-all duration-300
        hover:shadow-xl
        disabled:opacity-50 disabled:cursor-not-allowed
      "
    >
      添加一次旅程
    </button>
  );
}
