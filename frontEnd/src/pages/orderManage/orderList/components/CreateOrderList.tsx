import { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import {
  Form,
  Input,
  Row,
  Col,
  message,
  Modal,
  Select,
  DatePicker,
  InputNumber,
} from 'antd';
import type { IModalProp, IAction, IModalRef } from '@/types/modal';
import { orderListApi } from '@/api';
import type { OrderItem } from '@/types/orderManage/orderList';
import dayjs from 'dayjs';

type CreateOrderListProps = IModalProp;

//=======================================下拉选项=====================================
// 城市选项
const cityOptions = [
  { label: '北京', value: '北京' },
  { label: '上海', value: '上海' },
  { label: '广州', value: '广州' },
  { label: '深圳', value: '深圳' },
];

// 车型选项
const vehicleOptions = [
  { label: '经济型', value: '经济型' },
  { label: '舒适型', value: '舒适型' },
  { label: '商务型', value: '商务型' },
  { label: '豪华型', value: '豪华型' },
];

// 支付方式选项
const payTypeOptions = [
  { label: '微信', value: 1 },
  { label: '支付宝', value: 2 },
];

// 订单状态选项
const orderStateOptions = [
  { label: '进行中', value: 1 },
  { label: '已完成', value: 2 },
  { label: '超时', value: 3 },
  { label: '取消', value: 4 },
];

const CreateOrderList = forwardRef<IModalRef<OrderItem>, CreateOrderListProps>(
  ({ update }, ref) => {
    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);
    const [action, setAction] = useState<IAction>('create');

    // 打开弹窗
    const open = useCallback(
      (type: IAction, data?: OrderItem) => {
        setVisible(true);
        setAction(type);

        if (type === 'edit' && data) {
          form.setFieldsValue({
            ...data,
            useTime: data.useTime ? dayjs(data.useTime) : undefined,
            endTime: data.endTime ? dayjs(data.endTime) : undefined,
          });
        } else {
          form.resetFields();
        }
      },
      [form]
    );

    // 暴露 open 方法给父组件调用
    useImperativeHandle(ref, () => {
      return {
        open,
      };
    }, [open]);

    //====================================操作函数=====================================

    // 创建函数
    const handleOk = async () => {
      try {
        const valid = await form.validateFields();
        if (valid) {
          if (action === 'create') {
            const res = await orderListApi.createOrderList(
              form.getFieldsValue()
            );
            message.success(res.message);
          }
        }

        handleCancel();
        // 刷新父组件列表
        update?.();
      } catch (err) {
        console.error('Create Order Error:', err);
      }
    };

    // 点击取消
    const handleCancel = () => {
      setVisible(false);
      form.resetFields();
    };

    return (
      <Modal
        title={action === 'create' ? '创建订单' : '编辑订单'}
        width={800}
        open={visible}
        okText="确定"
        cancelText="取消"
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          initialValues={{
            cityName: cityOptions[0]?.value,
            vehicleName: vehicleOptions[0]?.value,
            payType: payTypeOptions[0]?.value,
            state: orderStateOptions[0]?.value,
          }}
          form={form}
          layout="horizontal"
          labelAlign="right"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
        >
          <Row>
            <Col span={12}>
              <Form.Item
                name="cityName"
                label="城市名称"
                rules={[{ required: true, message: '请选择城市名称' }]}
              >
                <Select placeholder="请选择城市名称" options={cityOptions} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="vehicleName"
                label="车型"
                rules={[{ required: true, message: '请选择车型' }]}
              >
                <Select placeholder="请选择车型名称" options={vehicleOptions} />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Form.Item
                name="userName"
                label="用户名称"
                rules={[{ required: true, message: '请输入用户名称' }]}
              >
                <Input placeholder="请输入用户名称" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="mobile"
                label="手机号"
                rules={[
                  {
                    pattern: /^1[3-9]\d{9}$/,
                    message: '请输入正确的手机号',
                  },
                ]}
              >
                <Input placeholder="请输入下单手机号" />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Form.Item name="startAddress" label="起始地址">
                <Input placeholder="请输入起始地址" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="endAddress" label="结束地址">
                <Input placeholder="请输入结束地址" />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Form.Item name="orderAmount" label="下单金额">
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  placeholder="请输入下单金额"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="userPayAmount" label="支付金额">
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  placeholder="请输入支付金额"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Form.Item
                name="driverName"
                label="司机名称"
                rules={[{ required: true, message: '请输入司机名称' }]}
              >
                <Input placeholder="请输入司机名称" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="driverAmount"
                label="司机金额"
                rules={[{ required: true, message: '请输入司机金额' }]}
              >
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  placeholder="请输入司机金额"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Form.Item name="payType" label="支付方式">
                <Select placeholder="请选择支付方式" options={payTypeOptions} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="state" label="订单状态">
                <Select
                  placeholder="请选择订单状态"
                  options={orderStateOptions}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Form.Item name="useTime" label="用车时间">
                <DatePicker
                  style={{ width: '100%' }}
                  showTime
                  placeholder="请选择用车时间"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="endTime" label="结束时间">
                <DatePicker
                  style={{ width: '100%' }}
                  showTime
                  placeholder="请选择结束时间"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
);

export default CreateOrderList;
