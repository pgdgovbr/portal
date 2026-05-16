import { vi } from 'vitest';

// Mock minimal de `$app/forms` para o ambiente de testes (happy-dom).
// `enhance` aqui não interage com a página — é uma action do Svelte equivalente
// a `(node) => {}`, suficiente para que o componente compile e renderize.
export const enhance = vi.fn(() => ({ destroy: vi.fn() }));
export const applyAction = vi.fn();
export const deserialize = vi.fn();
