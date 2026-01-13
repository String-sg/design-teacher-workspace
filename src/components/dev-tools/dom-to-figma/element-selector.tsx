import * as React from 'react'
import { createPortal } from 'react-dom'

interface ElementSelectorProps {
  isActive: boolean
  onSelect: (element: Element) => void
  onCancel: () => void
}

export function ElementSelector({
  isActive,
  onSelect,
  onCancel,
}: ElementSelectorProps) {
  const [hoveredElement, setHoveredElement] = React.useState<Element | null>(
    null,
  )
  const overlayRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!isActive) {
      setHoveredElement(null)
      return
    }

    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as Element

      // Ignore our own overlay elements
      if (target.closest('[data-figma-selector]')) return

      setHoveredElement(target)
    }

    const handleClick = (e: MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()

      const target = e.target as Element

      // Ignore our own overlay elements
      if (target.closest('[data-figma-selector]')) return

      onSelect(target)
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel()
      }
    }

    document.addEventListener('mousemove', handleMouseMove, true)
    document.addEventListener('click', handleClick, true)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove, true)
      document.removeEventListener('click', handleClick, true)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isActive, onSelect, onCancel])

  if (!isActive) return null

  const bounds = hoveredElement?.getBoundingClientRect()

  return createPortal(
    <div
      data-figma-selector="overlay"
      ref={overlayRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        pointerEvents: 'none',
      }}
    >
      {/* Highlight overlay */}
      {bounds && (
        <div
          data-figma-selector="highlight"
          style={{
            position: 'fixed',
            top: bounds.top,
            left: bounds.left,
            width: bounds.width,
            height: bounds.height,
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            border: '2px solid rgb(59, 130, 246)',
            borderRadius: '2px',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Label */}
      {bounds && hoveredElement && (
        <div
          data-figma-selector="label"
          style={{
            position: 'fixed',
            top: Math.max(0, bounds.top - 28),
            left: bounds.left,
            padding: '4px 8px',
            backgroundColor: 'rgb(59, 130, 246)',
            color: 'white',
            fontSize: '12px',
            fontFamily: 'monospace',
            borderRadius: '4px',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            maxWidth: '300px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {getElementLabel(hoveredElement)}
        </div>
      )}

      {/* Instructions */}
      <div
        data-figma-selector="instructions"
        style={{
          position: 'fixed',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '12px 20px',
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          color: 'white',
          fontSize: '14px',
          borderRadius: '8px',
          pointerEvents: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <span>Click an element to select it</span>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onCancel()
          }}
          style={{
            padding: '4px 12px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            borderRadius: '4px',
            color: 'white',
            cursor: 'pointer',
            fontSize: '12px',
          }}
        >
          Cancel (Esc)
        </button>
      </div>
    </div>,
    document.body,
  )
}

function getElementLabel(element: Element): string {
  const tag = element.tagName.toLowerCase()
  const id = element.id ? `#${element.id}` : ''
  const classes = Array.from(element.classList).slice(0, 2).join('.')

  let label = tag
  if (id) label += id
  else if (classes) label += `.${classes}`

  // Add dimensions
  const bounds = element.getBoundingClientRect()
  label += ` (${Math.round(bounds.width)}x${Math.round(bounds.height)})`

  return label
}
