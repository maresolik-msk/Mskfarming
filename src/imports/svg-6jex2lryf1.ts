const svgPaths: Record<string, string> = new Proxy({}, {
  get: () => "M0 0"
});

export default svgPaths;
