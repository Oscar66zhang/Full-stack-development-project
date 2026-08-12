import { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import {
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Select,
  Switch,
  DatePicker,
} from 'antd';
import type { IAction, IModalProp, IModalRef } from '@/types/modal';
import type { DriverItem, DriverStatus } from '@/types/orderManage/driverList';
import { driverListApi } from '@/api';
import dayjs from 'dayjs';

const cityOptions = [
  { label: '北京', value: '北京' },
  { label: '上海', value: '上海' },
  { label: '广州', value: '广州' },
  { label: '深圳', value: '深圳' },
];

const vehicleBrandOptions = [
  { label: '大众', value: '大众' },
  { label: '丰田', value: '丰田' },
  { label: '本田', value: '本田' },
  { label: '比亚迪', value: '比亚迪' },
  { label: '特斯拉', value: '特斯拉' },
];

const vehicleNameOptions = [
  { label: '经济型', value: '经济型' },
  { label: '舒适型', value: '舒适型' },
  { label: '商务型', value: '商务型' },
  { label: '豪华型', value: '豪华型' },
];

const driverStatusOptions: Array<{ label: string; value: DriverStatus }> = [
  { label: '待认证', value: 0 },
  { label: '正常', value: 1 },
  { label: '暂时拉黑', value: 2 },
  { label: '永久拉黑', value: 3 },
  { label: '停止推送', value: 4 },
];

const CreateDriverList = forwardRef<IModalRef<DriverItem>, IModalProp>(
  ({ update }, ref) => {
    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);
    const [action, setAction] = useState<IAction>('create');
    const [loading, setLoading] = useState(false);

    const open = useCallback(
      (type: IAction, data?: DriverItem) => {
        setVisible(true);
        setAction(type);
        if (type === 'edit' && data) {
          form.setFieldsValue({
            driverId: data.driverId,
            driverName: data.driverName,
            driverPhone: data.driverPhone,
            cityName: data.cityName,
            grade: data.grade,
            driverLevel: data.driverLevel,
            accountStatus: data.accountStatus,
            carNo: data.carNo,
            vehicleBrand: data.vehicleBrand,
            vehicleName: data.vehicleName,
            onlineTime: data.onlineTime,
            driverAmount: data.driverAmount,
            rating: data.rating,
            driverScore: data.driverScore,
            pushOrderCount: data.pushOrderCount,
            orderCompleteCount: data.orderCompleteCount,
            age: data.age,
            createTime: dayjs(data.createTime),
          });
        } else {
          form.resetFields();
        }
      },
      [form]
    );

    useImperativeHandle(ref, () => ({ open }), [open]);

    //处理提交函数
    const handleOk = async () => {
      try {
        const values = await form.validateFields();

        setLoading(true);
        if (action === 'create') {
          const res = await driverListApi.createDriverList(values);
          message.success(res.message);
        } else if (action === 'edit') {
          const res = await driverListApi.updateDriver(values.driverId, values);
          message.success(res.message);
        }
        handleCancel();
        update?.();
      } catch (err) {
        console.error('Create Driver Error:', err);
      } finally {
        setLoading(false);
      }
    };

    //重置函数
    const handleCancel = () => {
      setVisible(false);
      form.resetFields();
    };

    return (
      <Modal
        title={action === 'create' ? '新增司机' : '编辑司机'}
        width={800}
        open={visible}
        okText="确定"
        cancelText="取消"
        confirmLoading={loading}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          form={form}
          layout="horizontal"
          labelAlign="right"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{
            cityName: cityOptions[0].value,
            vehicleBrand: vehicleBrandOptions[0].value,
            vehicleName: vehicleNameOptions[0].value,
            grade: false,
            driverLevel: 1,
            accountStatus: 0,
            onlineTime: 0,
            driverAmount: 0,
            rating: 5,
            driverScore: 100,
            pushOrderCount: 0,
            orderCompleteCount: 0,
            age: 30,
          }}
        >
          <Row>
            <Col span={12}>
              <Form.Item
                label="司机名称"
                name="driverName"
                rules={[{ required: true, message: '请输入司机名称' }]}
              >
                <Input placeholder="请输入司机名称" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="司机ID"
                name="driverId"
                rules={[{ required: true, message: '请输入司机ID' }]}
              >
                <InputNumber
                  min={1}
                  precision={0}
                  style={{ width: '100%' }}
                  placeholder="请输入司机ID"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Form.Item
                label="司机手机号"
                name="driverPhone"
                rules={[
                  { required: true, message: '请输入司机手机号' },
                  {
                    pattern: /^1[3-9]\d{9}$/,
                    message: '请输入正确的手机号',
                  },
                ]}
              >
                <Input placeholder="请输入司机手机号" maxLength={11} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="城市名称"
                name="cityName"
                rules={[{ required: true, message: '请选择城市名称' }]}
              >
                <Select placeholder="请选择城市名称" options={cityOptions} />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Form.Item
                label="司机等级"
                name="driverLevel"
                rules={[{ required: true, message: '请输入司机等级' }]}
              >
                <InputNumber
                  min={1}
                  max={5}
                  style={{ width: '100%' }}
                  placeholder="请输入司机等级"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="是否会员" name="grade" valuePropName="checked">
                <Switch checkedChildren="会员" unCheckedChildren="普通" />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Form.Item
                label="司机状态"
                name="accountStatus"
                rules={[{ required: true, message: '请选择司机状态' }]}
              >
                <Select
                  placeholder="请选择司机状态"
                  options={driverStatusOptions}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="车牌号"
                name="carNo"
                rules={[{ required: true, message: '请输入车牌号' }]}
              >
                <Input placeholder="请输入车牌号" />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Form.Item
                label="车辆品牌"
                name="vehicleBrand"
                rules={[{ required: true, message: '请选择车辆品牌' }]}
              >
                <Select
                  placeholder="请选择车辆品牌"
                  options={vehicleBrandOptions}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="车辆名称"
                name="vehicleName"
                rules={[{ required: true, message: '请选择车辆名称' }]}
              >
                <Select
                  placeholder="请选择车辆名称"
                  options={vehicleNameOptions}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Form.Item
                label="昨日在线时长"
                name="onlineTime"
                rules={[{ required: true, message: '请输入昨日在线时长' }]}
              >
                <InputNumber
                  min={0}
                  precision={1}
                  addonAfter="小时"
                  style={{ width: '100%' }}
                  placeholder="请输入昨日在线时长"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="昨日司机流水"
                name="driverAmount"
                rules={[{ required: true, message: '请输入昨日司机流水' }]}
              >
                <InputNumber
                  min={0}
                  precision={2}
                  addonBefore="￥"
                  style={{ width: '100%' }}
                  placeholder="请输入昨日司机流水"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Form.Item
                label="司机评分"
                name="rating"
                rules={[{ required: true, message: '请输入司机评分' }]}
              >
                <InputNumber
                  min={0}
                  max={5}
                  precision={1}
                  style={{ width: '100%' }}
                  placeholder="请输入司机评分"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="行为分"
                name="driverScore"
                rules={[{ required: true, message: '请输入行为分' }]}
              >
                <InputNumber
                  min={0}
                  max={100}
                  precision={0}
                  style={{ width: '100%' }}
                  placeholder="请输入行为分"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Form.Item
                label="昨日推单数"
                name="pushOrderCount"
                rules={[{ required: true, message: '请输入昨日推单数' }]}
              >
                <InputNumber
                  min={0}
                  precision={0}
                  style={{ width: '100%' }}
                  placeholder="请输入昨日推单数"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="昨日完单数"
                name="orderCompleteCount"
                rules={[{ required: true, message: '请输入昨日完单数' }]}
              >
                <InputNumber
                  min={0}
                  precision={0}
                  style={{ width: '100%' }}
                  placeholder="请输入昨日完单数"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Form.Item
                label="司机年龄"
                name="age"
                rules={[{ required: true, message: '请输入司机年龄' }]}
              >
                <InputNumber
                  min={18}
                  max={70}
                  precision={0}
                  style={{ width: '100%' }}
                  placeholder="请输入司机年龄"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="加入时间"
                name="createTime"
                rules={[{ required: true, message: '请输入加入时间' }]}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  showTime
                  placeholder="请选择用车时间"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
);

export default CreateDriverList;
