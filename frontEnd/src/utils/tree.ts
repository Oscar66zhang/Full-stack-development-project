import type { Key } from 'react';

type TreeItem<T> = {
  _id: string;
  parentId?: string;
  children?: T[];
};

export const buildTree = <T extends TreeItem<T>>(list: T[]) => {
  const map = new Map<string, T>();
  const tree: T[] = [];

  const loop = (items: T[]) => {
    items.forEach(item => {
      map.set(item._id, {
        ...item,
        children: [],
      });

      if (item.children?.length) {
        loop(item.children);
      }
    });
  };

  loop(list);

  map.forEach(item => {
    if (item.parentId && item.parentId !== '0' && map.has(item.parentId)) {
      map.get(item.parentId)?.children?.push(item);
    } else {
      tree.push(item);
    }
  });

  return tree;
};

export const getAllTreeKeys = <T extends TreeItem<T>>(list: T[]) => {
  const keys: Key[] = [];
  const loop = (items: T[]) => {
    items.forEach(item => {
      keys.push(item._id);
      if (item.children?.length) {
        loop(item.children);
      }
    });
  };
  loop(list);

  return keys;
};
