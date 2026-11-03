import { useRef, useState, useEffect } from "react";

const MeetingTime = ({ meetingCode }) => {
  const [time, setTime] = useState("");
  const lastMinuteRef = useRef(null);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const currentMinute = now.getMinutes();

      // Only update UI if minute changed
      if (lastMinuteRef.current !== currentMinute) {
        lastMinuteRef.current = currentMinute;

        const formattedTime = now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });

        setTime(formattedTime);
      }
    };

    updateClock(); // run immediately

    const interval = setInterval(updateClock, 1000); // check every second

    return () => clearInterval(interval);
  }, []);

  return (
    <span className="text-sm font-medium text-gray-600 dark:text-white">
      {time} | {meetingCode}
    </span>
  );
};

export default MeetingTime;