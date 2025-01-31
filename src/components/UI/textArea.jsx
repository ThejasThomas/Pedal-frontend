import React from "react"

const Textarea = React.forwardRef((props, ref) => {
  const { className, ...otherProps } = props

  const baseClasses = `
    min-h-[80px] 
    w-full 
    rounded-md 
    border 
    border-gray-300 
    bg-white 
    px-3 
    py-2 
    text-sm 
    placeholder-gray-400
    focus:outline-none 
    focus:ring-2 
    focus:ring-blue-500 
    focus:border-transparent
    disabled:cursor-not-allowed 
    disabled:opacity-50
  `

  const combinedClasses = className ? `${baseClasses} ${className}` : baseClasses

  return <textarea className={combinedClasses} ref={ref} {...otherProps} />
})

Textarea.displayName = "Textarea"

export default Textarea

