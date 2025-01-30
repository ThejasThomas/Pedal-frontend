import React, { useState } from 'react';

const Calendar = () => {
  const [date, setDate] = useState(new Date());

  return (
    <div className="p-4 border rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-2">Calendar</h2>
      <input
        type="date"
        value={date.toISOString().split('T')[0]}
        onChange={(e) => setDate(new Date(e.target.value))}
        className="p-2 border rounded"
      />
    </div>
  );
};

export default Calendar;
