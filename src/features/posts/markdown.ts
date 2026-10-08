import { createMarkdownProcessor, type MarkdownRenderer } from '@astrojs/markdown-remark';

let processor: MarkdownRenderer | undefined;

async function getProcessor() {
  if (!processor) {
    processor = await createMarkdownProcessor({
      shikiConfig: { theme: 'github-dark-default', wrap: true },
    });
  }
  return processor;
}

export async function renderMarkdown(md: string): Promise<string> {
  const p = await getProcessor();
  return (await p.render(md)).code;
}
