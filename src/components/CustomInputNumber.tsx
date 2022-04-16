import { useState } from "react"
import Icon from "~components/Icon"

export interface Values {
  value: number
  name: string
}
interface Props {
  min: number
  max: number
  step?: number
  name: string
  value: number
  disabled?: boolean
  onChange: (val: Values) => void
  onBlur: (val: Values) => void
}

let time: NodeJS.Timeout;

const CustomInputNumber = ({
  min, max, step = 1, name, value, disabled = false, onChange, onBlur
}: Props) => {

  const handleChange = (e: any) => {
    if (disabled) return;
    let changeValue = parseInt(e.target.value) || 0;
    changeValue > max && (changeValue = max)
    changeValue < min && (changeValue = min)

    onChange({ value: changeValue, name: e.target.name })
  }
  const handleBlur = (e: any) => {
    onBlur({ value: parseInt(e.target.value), name: e.target.name })
  }

  const handleMinusHoldDown = () => {
    let changeValue = value;
    const handleMinus = () => {
      if (changeValue - step >= min) {
        changeValue = changeValue - step
        onChange({ value: changeValue, name })
      }
    }
    handleMinus()
    time = setInterval(handleMinus, 200)
  }

  const handlePlusHoldDown = () => {
    let changeValue = value;
    const handlePlus = () => {
      if (changeValue + step <= max && !disabled) {
        changeValue = changeValue + step
        onChange({ value: changeValue, name })
      }
    }
    handlePlus()
    time = setInterval(handlePlus, 200)
  }

  const handleHoldUp = () => {
    clearInterval(time)
  }

  return (
    <div className="flex gap-2 h-12">
      <div
        className={
          `flex items-center justify-center w-12 rounded border border-blue-300 fill-blue-500 ${value <= min
            ? 'cursor-not-allowed border-gray-200 bg-gray-200 fill-gray-600'
            : 'cursor-pointer hover:border-2 hover:fill-blue-700 active:bg-blue-400'
          }`
        }
        onMouseDown={handleMinusHoldDown}
        onMouseUp={handleHoldUp}
      >
        <Icon name="minus-svgo" width={16} height={16} />
      </div>
      <input
        className={`p-3 w-12 h-full rounded text-center border border-gray-300 outline-none focus:border-2 focus:border-blue-300 ${disabled ? 'cursor-not-allowed border-gray-200 bg-gray-200 text-gray-600' : ''}`}
        type="number"
        id={'test'}
        min={min}
        max={max}
        step={step}
        name={name}
        value={value}
        disabled={disabled}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      <div
        className={
          `flex items-center justify-center w-12 rounded border border-blue-300 fill-blue-500 ${value >= max || disabled
            ? 'cursor-not-allowed border-gray-200 bg-gray-200 fill-gray-600'
            : 'cursor-pointer hover:border-2 hover:fill-blue-700 active:bg-blue-400'
          }`
        }
        onMouseDown={handlePlusHoldDown}
        onMouseUp={handleHoldUp}
      >
        <Icon name="plus-svgo" width={16} height={16} />
      </div>
    </div>
  )
}

export default CustomInputNumber;