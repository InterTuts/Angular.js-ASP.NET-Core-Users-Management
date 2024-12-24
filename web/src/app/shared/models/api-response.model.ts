export default interface ApiResponse<T> {
  content: T | null;
  success: boolean;
  message: string
}
