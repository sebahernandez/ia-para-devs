// Picks the AI model logo for a post in the "modelos" category from its title.
// Logos are SVGs downloaded from https://svgl.app/ into public/logos/.
// To support a new model: add an entry here and its SVG file(s). Nothing else.

export type ModelLogo = {
  name: string;
  /** Logo for light backgrounds. */
  light: string;
  /** Logo for dark backgrounds (same as `light` when there is a single variant). */
  dark: string;
};

type Entry = ModelLogo & { aliases: string[] };

const logo = (name: string, aliases: string[], light: string, dark = light): Entry => ({
  name,
  aliases,
  light: `/logos/${light}`,
  dark: `/logos/${dark}`,
});

// "meta" is not an alias: it is a common Spanish word ("la meta").
const MODELS: Entry[] = [
  logo('Claude', ['claude', 'fable', 'opus', 'sonnet', 'haiku', 'mythos'], 'claude-ai-icon.svg'),
  logo('Gemini', ['gemini'], 'gemini.svg'),
  // svgl has no Gemma logo: use the company logo instead.
  logo('Google', ['gemma'], 'google.svg'),
  logo('OpenAI', ['gpt', 'chatgpt', 'openai'], 'openai.svg', 'openai_dark.svg'),
  logo('Mistral', ['mistral'], 'mistral-ai_logo.svg'),
  logo('DeepSeek', ['deepseek'], 'deepseek.svg'),
  logo('Grok', ['grok'], 'grok-light.svg', 'grok-dark.svg'),
  logo('Meta', ['llama'], 'meta.svg'),
  logo('Qwen', ['qwen'], 'qwen_light.svg', 'qwen_dark.svg'),
];

const MODELS_CATEGORY = 'modelos';

// Whole word, case-insensitive. A hyphen or digit may follow ("GPT-6", "GPT4").
const pattern = (alias: string) => new RegExp(`(?<![\\p{L}\\p{N}])${alias}(?![\\p{L}])`, 'iu');

const MATCHERS = MODELS.flatMap(({ aliases, ...model }) =>
  aliases.map((alias) => ({ re: pattern(alias), model })),
);

/** Returns the logo of the first model named in the title, or null. */
export function getModelLogo(post: { title: string; category: { slug: string } }): ModelLogo | null {
  if (post.category.slug !== MODELS_CATEGORY) return null;

  let best: { index: number; model: ModelLogo } | null = null;
  for (const { re, model } of MATCHERS) {
    const index = post.title.search(re);
    if (index !== -1 && (!best || index < best.index)) best = { index, model };
  }
  return best?.model ?? null;
}
