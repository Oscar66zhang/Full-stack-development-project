import { createRoot } from 'react-dom/client';
import { Loading } from './loading';
import type { Root } from 'react-dom/client';

let count = 0;
let root: Root | null = null;
let container: HTMLElement | null = null;

export const showLoading = () => {
  if (count === 0) {
    container = document.createElement('div');
    container?.setAttribute('id', 'loading');
    document.body.appendChild(container);
    root = createRoot(container);
    root.render(<Loading />);
  }
  count++;
};

export const hideLoading = () => {
  if (count <= 0) return;
  count--;
  if (count === 0 && root && container) {
    root.unmount();
    document.body.removeChild(container);
    root = null;
    container = null;
  }
};
