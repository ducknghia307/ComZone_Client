export default function CurrencySplitter(x: number): string {
  if (!x) return;
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
