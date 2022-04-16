import { useEffect, useState } from 'react'
import CustomInputNumber, { Values } from '~components/CustomInputNumber'

interface Props {
  guest: number
  room: number
}

const RoomAllocation = ({ guest, room }: Props) => {

  const [roomSetting, setRoomSetting] = useState(Array(room).fill(null).reduce((result, data, index) => {
    result[index] = {
      adult: 1,
      child: 0
    }
    return result;
  }, {}));

  const handleChangeInput = ({ value, name }: Values) => {
    console.log(value, name)
    const roomIndex: number = parseInt(name.split("-")[1]);
    const guestType: string = name.split("-")[2];
    setRoomSetting({
      ...roomSetting,
      [roomIndex]: {
        ...roomSetting[roomIndex],
        [guestType]: value
      }
    })
  }
  const handleBlurInput = ({ value, name }: Values) => {
    console.log(value, name)
  }

  const lastGuestCount = guest - Object.keys(roomSetting).reduce((result, roomIndex) => {
    result += roomSetting[roomIndex].adult + roomSetting[roomIndex].child
    return result
  }, 0)

  return (
    <>
      <div className='w-1/5 p-3 rounded border border-gray-300 bg-white'>
        <p className='text-lg font-bold mb-3'>住客人數：{guest} 人／{room} 房</p>
        <p className='rounded p-3 text-sm text-gray-500 border border-cyan-200 bg-cyan-50'>尚未分配人數：{lastGuestCount} 人</p>
        {Object.keys(roomSetting).map(roomIndex => {
          const { adult, child } = roomSetting[roomIndex];
          const guestCount = adult + child;
          return (
            <div key={roomIndex} className="py-3 border-b border-gray-300 last:pb-0 last:border-b-0">
              <p className='text-lg mb-3'>房間：{guestCount} 人</p>
              {Object.keys(roomSetting[roomIndex]).map((guestType, index) => (
                <div key={index} className="flex mb-3 last:mb-0">
                  <div className='flex-1'>
                    <p>{guestType === 'adult' ? '大人' : '小孩'}</p>
                    {guestType === 'adult' && <p className="text-sm text-gray-400">年齡 20+</p>}
                  </div>
                  <CustomInputNumber
                    min={guestType === 'adult' ? 1 : 0}
                    max={Math.min(4 - (guestType === 'adult' ? child : adult),
                      4 - roomSetting[roomIndex][guestType] > lastGuestCount
                        ? roomSetting[roomIndex][guestType] + lastGuestCount
                        : 4)
                    }
                    name={`room-${roomIndex}-${guestType}`}
                    value={roomSetting[roomIndex][guestType]}
                    disabled={!lastGuestCount || guestCount === 4}
                    onChange={handleChangeInput}
                    onBlur={handleBlurInput}
                  />
                </div>
              ))}
            </div>
          )
        })}
      </div>
      <pre className='mt-5'>
        <code>{JSON.stringify(Object.keys(roomSetting).map(roomIndex => roomSetting[roomIndex]))}</code>
      </pre>
    </>
  )
}

export default RoomAllocation;