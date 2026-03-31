import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

interface ActionDialogProps {
  open: boolean
  title: string
  description?: string
  label: string
  placeholder?: string
  confirmLabel: string
  confirmVariant?: "default" | "destructive"
  onConfirm: (value: string) => void
  onClose: () => void
}

export function ActionDialog({
  open,
  title,
  description,
  label,
  placeholder,
  confirmLabel,
  confirmVariant = "default",
  onConfirm,
  onClose
}: ActionDialogProps) {

  const [value, setValue] = useState("")

  function handleConfirm() {
    onConfirm(value)
    setValue("")
    onClose()
  }

  function handleClose() {
    setValue("")
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">

        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">

          {description && (
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
          )}

          <div>
            <Label>{label}</Label>

            <Textarea
              className="mt-3"
              placeholder={placeholder}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">

            <Button variant="outline" onClick={handleClose}>
              Voltar
            </Button>

            <Button
              variant={confirmVariant}
              onClick={handleConfirm}
            >
              {confirmLabel}
            </Button>

          </div>

        </div>

      </DialogContent>
    </Dialog>
  )
}