export function calculateSquareCrop(width, height, zoom, position) {
  const longestSide = Math.max(width, height);
  const boundedZoom = Math.max(0.5, Math.min(3, zoom));
  const side = longestSide / boundedZoom;
  const minimumX = Math.min(0, width - side);
  const maximumX = Math.max(0, width - side);
  const minimumY = Math.min(0, height - side);
  const maximumY = Math.max(0, height - side);

  return {
    x: Math.max(minimumX, Math.min(maximumX, position.x)),
    y: Math.max(minimumY, Math.min(maximumY, position.y)),
    width: side,
    height: side,
  };
}
