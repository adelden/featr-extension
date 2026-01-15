export const SKETCH_ROOT_URL = 'https://www.sketch.com';

export const isSketchUrl = (url: string): boolean => {
  const sketchRegex = new RegExp(`^${SKETCH_ROOT_URL}`);
  return sketchRegex.test(url);
};
