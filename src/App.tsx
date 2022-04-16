import { useState } from "react";
import RoomAllocation from "~components/RoomAllocation";

export default function App() {

  return <div className="flex flex-col items-center justify-center min-h-screen">
    <RoomAllocation guest={10} room={3} />
  </div>;
}
