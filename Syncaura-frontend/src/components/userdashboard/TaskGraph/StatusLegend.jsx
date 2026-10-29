import LegendItem from "./LegendItem";


export default function StatusLegend({ data }) {
  return (
    <div className="flex xsm:flex-col gap-1 flex-wrap gap-x-5  ">
      {data.map((item) => (
        <LegendItem key={item.id} item={item} />
      ))}
    </div>
  );
}
