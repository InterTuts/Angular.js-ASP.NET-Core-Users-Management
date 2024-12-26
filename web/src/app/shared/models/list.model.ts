export default interface List<T> {
  items: T | null;
  page: number;
  total: number;
}
