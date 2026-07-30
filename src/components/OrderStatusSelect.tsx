"use client"

export default function OrderStatusSelect({ orderId, currentStatus, updateAction }: {
  orderId: string
  currentStatus: string
  updateAction: (formData: FormData) => Promise<void>
}) {
  return (
    <form action={updateAction}>
      <input type="hidden" name="id" value={orderId} />
      <select
        name="status"
        defaultValue={currentStatus}
        onChange={e => e.target.form?.requestSubmit()}
        className="rounded border border-border bg-surface px-2 py-1 text-xs"
      >
        <option value="pending">pending</option>
        <option value="paid">paid</option>
        <option value="shipped">shipped</option>
        <option value="delivered">delivered</option>
        <option value="cancelled">cancelled</option>
      </select>
    </form>
  )
}
