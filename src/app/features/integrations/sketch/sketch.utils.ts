import { Integration } from '../../../core/models/integration.model';

export const SKETCH_ROOT_URL = 'https://www.sketch.com';

export const isSketchUrl = (url: string): boolean => {
  const sketchRegex = new RegExp(`^${SKETCH_ROOT_URL}`);
  return sketchRegex.test(url);
};

export const getSketchIntegration = (): Integration => {
  return {
    type: 'sketch',
    label: 'Sketch',
    group: 'design',
    baseUrl: SKETCH_ROOT_URL,
    enabled: true,
  };
};
