export default function CurrencySplitter(x: number): string {
  if (x === 0) return "0";
  if (!x) return "";
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
