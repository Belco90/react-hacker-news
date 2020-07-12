export const getTimeDisplay = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toUTCString();
};
