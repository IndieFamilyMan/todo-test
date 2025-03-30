"use client";

const PlusIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 4v16m8-8H4"
    />
  </svg>
);

export default function FloatingButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 right-8 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer z-50"
      style={{
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
      }}
    >
      <PlusIcon />
    </button>
  );
}
