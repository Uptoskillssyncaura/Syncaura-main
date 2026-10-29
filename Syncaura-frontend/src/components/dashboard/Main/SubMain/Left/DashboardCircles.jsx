import CircularProgress from "./CircularProgress";
import useMediaQuery from "./hook/useMediaQuery";

const DashboardCircles = () => {
  const is2xl = useMediaQuery("(min-width: 1280px)");

  return (
    <CircularProgress
      value={80}
      radius={is2xl ? 120 : 100}
      strokeWidth={3}
      color="#3361FF"
      startAngle={150}
      badgeAngle={-50}
    >
      <CircularProgress
        value={60}
        radius={is2xl ? 85 : 70}
        strokeWidth={2}
        color="#FF6633"
        startAngle={40}
        badgeAngle={130}
        trackColor="#FFE0D6"
      >
        <CircularProgress
          value={40}
          radius={is2xl ? 40 : 32}
          strokeWidth={1.5}
          color="#2EC938"
          startAngle={50}
          badgeAngle={-30}
          trackColor="#D4F5D7"
        />
      </CircularProgress>
    </CircularProgress>
  );
};
export default DashboardCircles