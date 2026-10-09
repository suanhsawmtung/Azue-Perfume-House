export const isAppleDevice = () => {
  if (typeof navigator === "undefined") return false;

  return /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent);
};
