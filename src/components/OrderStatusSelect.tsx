"use client"

import { useRef } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function OrderStatusSelect({ orderId, currentStatus, updateAction }: {
  orderId: string
  currentStatus: string
  updateAction: (formData: FormData) => Promise<void>
}) {
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <form ref={formRef} action={updateAction}>
      <input type="hidden" name="id" value={orderId} />
      <Select
        name="status"
        defaultValue={currentStatus}
        onValueChange={() => formRef.current?.requestSubmit()}
      >
        <SelectTrigger className="w-[110px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pending">pending</SelectItem>
          <SelectItem value="paid">paid</SelectItem>
          <SelectItem value="shipped">shipped</SelectItem>
          <SelectItem value="delivered">delivered</SelectItem>
          <SelectItem value="cancelled">cancelled</SelectItem>
        </SelectContent>
      </Select>
    </form>
  )
}
