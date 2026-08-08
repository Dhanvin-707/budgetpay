export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`relative overflow-hidden inline-block ${className}`} style={{ aspectRatio: "38.86 / 57" }}>
      <img
        src="/logo.png"
        alt="BudgetPay Logo"
        className="absolute h-full max-w-none"
        style={{
          width: "288.2%",
          left: "-60.9%",
          top: 0
        }}
      />
    </span>
  )
}