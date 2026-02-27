import { charContent } from '@char-ai/extension-core';

export default defineContentScript({
  matches: ['<all_urls>'],
  runAt: 'document_idle',
  main() {
    charContent();
    // Add your custom logic here
  },
});
