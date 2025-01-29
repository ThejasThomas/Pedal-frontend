import React from "react"
import PropTypes from "prop-types"

// Dialog Component
export const Dialog = ({ children, open, onOpenChange }) => {
  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="dialog bg-white rounded-lg p-6">
        {children}
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={() => onOpenChange(false)}
        >
          ×
        </button>
      </div>
    </div>
  )
}

Dialog.propTypes = {
  children: PropTypes.node.isRequired,
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
}

// DialogContent Component
export const DialogContent = ({ children }) => {
  return <div className="dialog-content">{children}</div>
}

DialogContent.propTypes = {
  children: PropTypes.node.isRequired,
}

// DialogHeader Component
export const DialogHeader = ({ children }) => {
  return <div className="dialog-header mb-4">{children}</div>
}

DialogHeader.propTypes = {
  children: PropTypes.node.isRequired,
}

// DialogTitle Component
export const DialogTitle = ({ children }) => {
  return <h2 className="dialog-title text-xl font-bold">{children}</h2>
}

DialogTitle.propTypes = {
  children: PropTypes.node.isRequired,
}

// DialogDescription Component
export const DialogDescription = ({ children }) => {
  return <p className="dialog-description text-gray-600">{children}</p>
}

DialogDescription.propTypes = {
  children: PropTypes.node.isRequired,
}

// DialogFooter Component
export const DialogFooter = ({ children }) => {
  return <div className="dialog-footer mt-6 flex justify-end space-x-2">{children}</div>
}

DialogFooter.propTypes = {
  children: PropTypes.node.isRequired,
}

