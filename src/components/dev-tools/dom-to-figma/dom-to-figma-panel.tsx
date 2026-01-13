import * as React from 'react'
import { copyToClipboard, exportToFigmaJSON } from './dom-traverser'
import { ElementSelector } from './element-selector'
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Status = 'idle' | 'copying' | 'success' | 'error'

export function DomToFigmaPanel() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isSelecting, setIsSelecting] = React.useState(false)
  const [selectedElement, setSelectedElement] = React.useState<Element | null>(
    null,
  )
  const [status, setStatus] = React.useState<Status>('idle')
  const [statusMessage, setStatusMessage] = React.useState('')

  const handleCopyPage = async () => {
    try {
      setStatus('copying')
      setStatusMessage('Copying page...')

      // Find the main content area (SidebarInset)
      const sidebarInset = document.querySelector('[data-slot="sidebar-inset"]')
      const rootElement = sidebarInset || document.body

      const json = exportToFigmaJSON(rootElement, {
        ignoreSelectors: ['[data-figma-selector]', '[data-slot="popover"]'],
      })

      await copyToClipboard(json)

      setStatus('success')
      setStatusMessage('Copied to clipboard!')

      // Reset status after delay
      setTimeout(() => {
        setStatus('idle')
        setStatusMessage('')
      }, 2000)
    } catch (error) {
      setStatus('error')
      setStatusMessage(
        error instanceof Error ? error.message : 'Failed to copy',
      )
    }
  }

  const handleCopySelection = async () => {
    if (!selectedElement) return

    try {
      setStatus('copying')
      setStatusMessage('Copying selection...')

      const json = exportToFigmaJSON(selectedElement, {
        ignoreSelectors: ['[data-figma-selector]', '[data-slot="popover"]'],
      })

      await copyToClipboard(json)

      setStatus('success')
      setStatusMessage('Copied to clipboard!')

      setTimeout(() => {
        setStatus('idle')
        setStatusMessage('')
      }, 2000)
    } catch (error) {
      setStatus('error')
      setStatusMessage(
        error instanceof Error ? error.message : 'Failed to copy',
      )
    }
  }

  const handleStartSelect = () => {
    setIsOpen(false)
    setIsSelecting(true)
  }

  const handleSelectElement = (element: Element) => {
    setSelectedElement(element)
    setIsSelecting(false)
    setIsOpen(true)
  }

  const handleCancelSelect = () => {
    setIsSelecting(false)
    setIsOpen(true)
  }

  const handleClearSelection = () => {
    setSelectedElement(null)
  }

  return (
    <>
      <div className="fixed bottom-4 left-4 z-[9999]" data-figma-ignore>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger
            className={cn(
              'flex size-12 items-center justify-center rounded-full bg-purple-600 text-white shadow-lg transition-all hover:bg-purple-700 hover:scale-105',
            )}
            title="DOM to Figma"
          >
            <FigmaIcon className="size-5" />
          </PopoverTrigger>
          <PopoverContent
            side="top"
            align="start"
            sideOffset={8}
            className="w-72"
          >
            <PopoverHeader>
              <PopoverTitle>DOM to Figma</PopoverTitle>
              <PopoverDescription>
                Export this page&apos;s design to Figma
              </PopoverDescription>
            </PopoverHeader>

            <div className="flex flex-col gap-3">
              {/* Selection indicator */}
              {selectedElement && (
                <div className="flex items-center justify-between rounded-lg bg-blue-50 dark:bg-blue-950/30 px-3 py-2 text-sm">
                  <span className="truncate text-blue-700 dark:text-blue-300">
                    {getElementLabel(selectedElement)}
                  </span>
                  <button
                    onClick={handleClearSelection}
                    className="ml-2 text-blue-500 hover:text-blue-700 dark:hover:text-blue-300"
                    title="Clear selection"
                  >
                    <XIcon className="size-4" />
                  </button>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleStartSelect}
                  className="justify-start"
                >
                  <CrosshairIcon className="size-4" data-icon="inline-start" />
                  Select Element
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleCopySelection}
                  disabled={!selectedElement || status === 'copying'}
                  className="justify-start"
                >
                  <CopyIcon className="size-4" data-icon="inline-start" />
                  Copy Selection
                </Button>

                <Button
                  variant="default"
                  size="sm"
                  onClick={handleCopyPage}
                  disabled={status === 'copying'}
                  className="justify-start"
                >
                  <LayoutIcon className="size-4" data-icon="inline-start" />
                  Copy Entire Page
                </Button>
              </div>

              {/* Status */}
              {statusMessage && (
                <div
                  className={cn(
                    'rounded-lg px-3 py-2 text-sm',
                    status === 'success' &&
                      'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-300',
                    status === 'error' &&
                      'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-300',
                    status === 'copying' &&
                      'bg-gray-50 text-gray-700 dark:bg-gray-950/30 dark:text-gray-300',
                  )}
                >
                  {statusMessage}
                </div>
              )}

              {/* Instructions */}
              <p className="text-xs text-muted-foreground">
                Paste the copied JSON into the Figma plugin to create editable
                layers.
              </p>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <ElementSelector
        isActive={isSelecting}
        onSelect={handleSelectElement}
        onCancel={handleCancelSelect}
      />
    </>
  )
}

function getElementLabel(element: Element): string {
  const tag = element.tagName.toLowerCase()
  const id = element.id ? `#${element.id}` : ''
  const classes = Array.from(element.classList).slice(0, 2).join('.')
  return id ? `${tag}${id}` : classes ? `${tag}.${classes}` : tag
}

// Icons
function FigmaIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 24C10.2091 24 12 22.2091 12 20V16H8C5.79086 16 4 17.7909 4 20C4 22.2091 5.79086 24 8 24Z"
        fill="currentColor"
      />
      <path
        d="M4 12C4 9.79086 5.79086 8 8 8H12V16H8C5.79086 16 4 14.2091 4 12Z"
        fill="currentColor"
      />
      <path
        d="M4 4C4 1.79086 5.79086 0 8 0H12V8H8C5.79086 8 4 6.20914 4 4Z"
        fill="currentColor"
      />
      <path
        d="M12 0H16C18.2091 0 20 1.79086 20 4C20 6.20914 18.2091 8 16 8H12V0Z"
        fill="currentColor"
      />
      <path
        d="M20 12C20 14.2091 18.2091 16 16 16C13.7909 16 12 14.2091 12 12C12 9.79086 13.7909 8 16 8C18.2091 8 20 9.79086 20 12Z"
        fill="currentColor"
      />
    </svg>
  )
}

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

function CrosshairIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="22" y1="12" x2="18" y2="12" />
      <line x1="6" y1="12" x2="2" y2="12" />
      <line x1="12" y1="6" x2="12" y2="2" />
      <line x1="12" y1="22" x2="12" y2="18" />
    </svg>
  )
}

function LayoutIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="9" y1="21" x2="9" y2="9" />
    </svg>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}
