import type { Key } from 'react';

type TreeItem<T> = {
  _id: string;
  parentId?: string;
  children?: T[];
};

export const buildTree = <T extends TreeItem<T>>(list: T[]) => {
  // 用 Map 保存所有节点
  // key 是节点 _id，value 是节点本身
  // 这样后面可以通过 parentId 快速找到父节点
  const map = new Map<string, T>();

  // 最终返回的树形结构
  // 一级节点会放到这里
  const tree: T[] = [];

  // 递归遍历原始数据
  // 因为传进来的 list 可能本身已经带 children
  // 所以这里不只遍历第一层，也会把 children 里的节点全部放进 map
  const loop = (items: T[]) => {
    items.forEach(item => {
      // 把每个节点存入 map
      // 同时重置 children，避免原来的 children 影响重新组装树结构
      map.set(item._id, {
        ...item,
        children: [],
      });

      // 如果当前节点还有 children，继续递归处理子节点
      if (item.children?.length) {
        loop(item.children);
      }
    });
  };

  // 第一步：把所有节点，不管是一层还是多层，全部扁平化存入 map
  loop(list);

  // 第二步：根据 parentId，把子节点挂到父节点的 children 里
  map.forEach(item => {
    // 如果当前节点有 parentId
    // 并且 parentId 不是 '0'
    // 并且 map 里能找到对应的父节点
    // 说明当前节点是子节点
    if (item.parentId && item.parentId !== '0' && map.has(item.parentId)) {
      // 找到父节点，把当前节点放进父节点的 children 数组
      map.get(item.parentId)?.children?.push(item);
    } else {
      // 如果没有 parentId，或者 parentId 是 '0'
      // 或者找不到父节点，就认为它是一级节点
      tree.push(item);
    }
  });

  // 返回最终整理好的树形结构
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
