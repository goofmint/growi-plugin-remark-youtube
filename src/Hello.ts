import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';

interface GrowiNode extends Node {
  name: string;
  type: string;
  attributes: {[key: string]: string}
  children: GrowiNode[];
  value: string;
}

export const plugin: Plugin = function() {
  return (tree) => {
    visit(tree, (node) => {
      const n = node as unknown as GrowiNode;
      try {
        if (n.type === 'leafGrowiPluginDirective' && n.name === 'youtube') {
          const id = Object.keys(n.attributes)[0];
          const { width, height } = n.attributes;
          n.type = 'html';
          n.value = `<div style="width: 100%; aspect-ratio: 16/9">
            <iframe
              width="${width || '560'}"
              height="${height || '315'}"
              src="https://www.youtube.com/embed/${id}"
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerpolicy="strict-origin-when-cross-origin" allowfullscreen>
            </iframe>
          </div>
          `;
        }
      }
      catch (e) {
        n.type = 'html';
        n.value = `<div style="color: red;">Error: ${(e as Error).message}</div>`;
      }
    });
  };
};
