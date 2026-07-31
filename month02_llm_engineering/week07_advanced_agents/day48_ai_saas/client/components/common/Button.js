"use client";

export default function Button({
  children,

  onClick,

  type = "button",

  variant = "primary",

  disabled = false,

  className = "",
}) {
  const styles = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",

    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",

    danger: "bg-red-600 hover:bg-red-700 text-white",

    success: "bg-green-600 hover:bg-green-700 text-white",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
px-6
py-3
rounded-xl
font-semibold
transition
duration-200
disabled:opacity-50
disabled:cursor-not-allowed

${styles[variant]}

${className}

`}
    >
      {children}
    </button>
  );
}
