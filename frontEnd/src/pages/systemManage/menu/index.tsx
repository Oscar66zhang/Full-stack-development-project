import React, { useEffect, useRef, useState, type Key } from 'react';
import {
  message,
  Form,
  Input,
  Space,
  Table,
  Tag,
  Button,
  Select,
  Modal,
} from 'antd';
import type { TableProps } from 'antd';
import type { MenuItem } from '@/types/systemManage/menu';
import { menuApi } from '@/api';
import type { IModalRef } from '@/types/modal';
import CreateMenu from './CreateMenu';

const MenuList = () => {
  const [form] = Form.useForm();
  const [menuData, setMenuData] = useState<MenuItem[]>([]);
  const menuModalRef = useRef<IModalRef<MenuItem>>(null);

  //展开所有节点
  const [expandedRowKeys, setExpandedRowKeys] = useState<Key[]>([]);

  //获取菜单数据
  const fetchMenuData = async () => {
    try {
      const res = await menuApi.getMenuList();
      setMenuData(buildMenuTree(res.data));
    } catch (error) {
      console.error('Failed to fetch menu data:', error);
    }
  };

  useEffect(() => {
    fetchMenuData();
  }, []);

  //==========================================处理搜索函数=====================================================
  //构造树形结构
  const buildMenuTree = (list: MenuItem[]) => {
    // 创建一个 Map，用来临时保存所有菜单
    // key 是菜单的 _id，value 是菜单对象
    // 这样后面可以快速通过 parentId 找到对应的父菜单
    const menuMap = new Map<string, MenuItem>();
    // 最终要返回的树形菜单数组
    // 一级菜单会放到这里
    const tree: MenuItem[] = [];

    // 第一步：先把所有菜单都放进 menuMap 里
    list.forEach(item => {
      menuMap.set(item._id, {
        ...item,
        // 给每一个菜单都初始化一个 children
        // 这样后面如果它有子菜单，就可以直接往 children 里面 push
        children: [],
      });
    });

    // 第二步：遍历 menuMap，把子菜单挂到父菜单的 children 里
    menuMap.forEach(item => {
      // 如果当前菜单有 parentId，
      // 并且 menuMap 里能找到这个 parentId 对应的父菜单
      // 说明当前 item 是一个子菜单
      if (item.parentId && menuMap.has(item.parentId)) {
        // 找到父菜单，然后把当前菜单放进父菜单的 children 里
        menuMap.get(item.parentId)?.children?.push(item);
      } else {
        // 如果没有 parentId，或者找不到父菜单
        // 说明它是一级菜单，直接放进 tree 数组
        tree.push(item);
      }
    });

    // 返回整理好的树形结构
    return tree;
  };

  //展示搜索的内容
  const getAllMenuKeys = (list: MenuItem[]) => {
    const keys: Key[] = [];
    const loop = (menus: MenuItem[]) => {
      menus.forEach(item => {
        keys.push(item._id);
        if (item.children?.length) {
          loop(item.children);
        }
      });
    };
    loop(list);
    return keys;
  };

  //搜索函数
  const searchMenuData = async () => {
    try {
      const values = form.getFieldsValue();
      const res = await menuApi.searchMenu(values);
      const treeData = buildMenuTree(res.data);
      setMenuData(treeData);
      setExpandedRowKeys(getAllMenuKeys(treeData));
    } catch (error) {
      console.error('获取搜索结果失败:', error);
    }
  };

  //===============================================表格列配置========================================
  const columns: TableProps<MenuItem>['columns'] = [
    {
      title: '菜单名称',
      dataIndex: 'menuName',
      key: 'menuName',
    },
    {
      title: '菜单图标',
      dataIndex: 'icon',
      key: 'icon',
    },
    {
      title: '菜单类型',
      dataIndex: 'menuType',
      key: 'menuType',
      render: (menuType: number) => {
        const menuTypeMap: Record<number, React.ReactNode> = {
          1: <Tag color="blue">菜单</Tag>,
          2: <Tag color="green">按钮</Tag>,
          3: <Tag color="orange">页面</Tag>,
        };

        return menuTypeMap[menuType] || '-';
      },
    },
    {
      title: '权限标识',
      dataIndex: 'menuCode',
      key: 'menuCode',
    },
    {
      title: '路由地址',
      dataIndex: 'path',
      key: 'path',
    },
    {
      title: '组件名称',
      dataIndex: 'component',
      key: 'component',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size={30}>
          <a
            onClick={() => handleCreate()}
            style={{ marginRight: 12, color: '#000' }}
          >
            新增
          </a>
          <a
            onClick={() => handleEdit(record)}
            style={{ marginRight: 12, color: '#000' }}
          >
            编辑
          </a>
          <a onClick={() => handleDelete(record)} style={{ color: '#f5222d' }}>
            删除
          </a>
        </Space>
      ),
    },
  ];

  //===============================================处理操作的按钮========================================
  // 新增
  const handleCreate = () => {
    menuModalRef.current?.open('create');
  };

  // 编辑
  const handleEdit = (record: MenuItem) => {
    menuModalRef.current?.open('edit', record);
  };

  // 删除
  const handleDelete = (record: MenuItem) => {
    Modal.confirm({
      title: '删除菜单',
      content: '确认要删除该菜单吗?',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        const res = await menuApi.deleteMenu({ _id: record._id });
        message.success(res.message || '删除成功');
        fetchMenuData();
      },
    });
  };

  //重置数据
  const handleReset = async () => {
    form.resetFields();
    const res = await menuApi.getMenuList();
    setMenuData(buildMenuTree(res.data));
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="search-form">
        <Form layout="inline" form={form} initialValues={{ menuState: 1 }}>
          <Form.Item label="菜单名称" name="menuName">
            <Input type="text" placeholder="请输入菜单名称" />
          </Form.Item>

          <Form.Item label="菜单状态" name="menuState" style={{ width: 200 }}>
            <Select
              options={[
                { label: '正常', value: 1 },
                { label: '停用', value: 0 },
              ]}
            />
          </Form.Item>

          <Form.Item>
            <Space size={10}>
              <Button type="primary" onClick={searchMenuData}>
                搜索
              </Button>
              <Button onClick={handleReset}>重置</Button>
            </Space>
          </Form.Item>
        </Form>
      </div>

      <div className="base-table">
        <div className="header-wrapper">
          <div className="title text-lg font-medium">菜单列表</div>
          <div className="action flex items-center gap-3">
            <Button type="primary" onClick={handleCreate}>
              新增
            </Button>
          </div>
        </div>
        <Table<MenuItem>
          bordered
          rowKey="_id"
          columns={columns}
          dataSource={menuData}
          expandable={{
            expandedRowKeys,
            onExpandedRowsChange: keys => setExpandedRowKeys([...keys]),
          }}
        />
      </div>

      <CreateMenu
        ref={menuModalRef}
        update={fetchMenuData}
        menuList={menuData}
      />
    </div>
  );
};

export default MenuList;
