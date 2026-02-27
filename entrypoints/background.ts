import { charBackground } from '@char-ai/extension-core';
import { getConfig } from '../config';

export default defineBackground(() => {
  charBackground(getConfig());
  // Add your custom logic here
});
