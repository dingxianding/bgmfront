import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Link } from 'dva/router';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
  Popconfirm,
  Radio,
} from 'antd';
import MyTable from 'components/MyTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import Ellipsis from 'components/Ellipsis';

import styles from './TeilScheduleList.less';

const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const CreateForm = Form.create({
  mapPropsToFields(props) {
    return {
      teilList: Form.createFormField({
        ...props.teilList,
      }),
    };
  },
})(props => {
  const { modalVisible, form, handleAdd, handleModalVisible, teilList, isEdit, editRecord } = props;
  const teilChildren = [];
  let formTitle = '添加零件进度';
  if (isEdit) {
    formTitle = '编辑零件进度';
  }

  if (teilList && teilList.length > 0) {
    // 零件
    for (let i = 0; i < teilList.length; i += 1) {
      teilChildren.push(
        <Option key={teilList[i].id} value={teilList[i].number}>
          {teilList[i].number}
        </Option>
      );
    }
  }

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      let params = { ...fieldsValue };
      if (isEdit) {
        params = {
          isEdit,
          id: editRecord.id,
          ...fieldsValue,
        };
      }
      handleAdd(params);
    });
  };
  return (
    <Modal
      title={formTitle}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="零件编号">
        {form.getFieldDecorator('teil', {
          initialValue: isEdit ? (editRecord.teil ? editRecord.teil.number : null) : null,
        })(
          <Select
            showSearch
            style={{ width: 150 }}
            placeholder="请选择"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {teilChildren}
          </Select>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="询价资料时间">
        {form.getFieldDecorator('anfragedatenTime', {
          initialValue: isEdit
            ? editRecord.anfragedatenTime
              ? moment(editRecord.anfragedatenTime, 'YYYY-MM-DD HH:mm:ss')
              : ''
            : null,
        })(<WeekPicker placeholder="请输入" format="YYYY-MM-DD" />)}
      </FormItem>
      <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="采购定点计划时间">
        {form.getFieldDecorator('cscSollTime', {
          initialValue: isEdit
            ? editRecord.cscSollTime ? moment(editRecord.cscSollTime, 'YYYY-MM-DD HH:mm:ss') : ''
            : null,
        })(<WeekPicker placeholder="请输入" format="YYYY-MM-DD" />)}
      </FormItem>
      <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="采购定点实际时间">
        {form.getFieldDecorator('cscIstTime', {
          initialValue: isEdit
            ? editRecord.cscIstTime ? moment(editRecord.cscIstTime, 'YYYY-MM-DD HH:mm:ss') : ''
            : null,
        })(<WeekPicker placeholder="请输入" format="YYYY-MM-DD" />)}
      </FormItem>
      <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="项目启动会计划时间">
        {form.getFieldDecorator('kickoffSollTime', {
          initialValue: isEdit
            ? editRecord.kickoffSollTime
              ? moment(editRecord.kickoffSollTime, 'YYYY-MM-DD HH:mm:ss')
              : ''
            : null,
        })(<WeekPicker placeholder="请输入" format="YYYY-MM-DD" />)}
      </FormItem>
      <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="项目启动会实际时间">
        {form.getFieldDecorator('kickoffIstTime', {
          initialValue: isEdit
            ? editRecord.kickoffIstTime
              ? moment(editRecord.kickoffIstTime, 'YYYY-MM-DD HH:mm:ss')
              : ''
            : null,
        })(<WeekPicker placeholder="请输入" format="YYYY-MM-DD" />)}
      </FormItem>
      <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="PAB编辑发送时间">
        {form.getFieldDecorator('pabEditSendTime', {
          initialValue: isEdit
            ? editRecord.pabEditSendTime
              ? moment(editRecord.pabEditSendTime, 'YYYY-MM-DD HH:mm:ss')
              : ''
            : null,
        })(<WeekPicker placeholder="请输入" format="YYYY-MM-DD" />)}
      </FormItem>
      <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="PAB系统流转完成时间">
        {form.getFieldDecorator('pabFlowFinishTime', {
          initialValue: isEdit
            ? editRecord.pabFlowFinishTime
              ? moment(editRecord.pabFlowFinishTime, 'YYYY-MM-DD HH:mm:ss')
              : ''
            : null,
        })(<WeekPicker placeholder="请输入" format="YYYY-MM-DD" />)}
      </FormItem>
      <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="PAB费用反馈的时间">
        {form.getFieldDecorator('pabCostFeedbackTime', {
          initialValue: isEdit
            ? editRecord.pabCostFeedbackTime
              ? moment(editRecord.pabCostFeedbackTime, 'YYYY-MM-DD HH:mm:ss')
              : ''
            : null,
        })(<WeekPicker placeholder="请输入" format="YYYY-MM-DD" />)}
      </FormItem>
      <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="B-F计划时间">
        {form.getFieldDecorator('bfSollTime', {
          initialValue: isEdit
            ? editRecord.bfSollTime ? moment(editRecord.bfSollTime, 'YYYY-MM-DD HH:mm:ss') : ''
            : null,
        })(<WeekPicker placeholder="请输入" format="YYYY-MM-DD" />)}
      </FormItem>
      <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="B-F实际时间">
        {form.getFieldDecorator('bfIstTime', {
          initialValue: isEdit
            ? editRecord.bfIstTime ? moment(editRecord.bfIstTime, 'YYYY-MM-DD HH:mm:ss') : ''
            : null,
        })(<WeekPicker placeholder="请输入" format="YYYY-MM-DD" />)}
      </FormItem>
      <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="首模件实际时间">
        {form.getFieldDecorator('firstTryoutIstTime', {
          initialValue: isEdit
            ? editRecord.firstTryoutIstTime
              ? moment(editRecord.firstTryoutIstTime, 'YYYY-MM-DD HH:mm:ss')
              : ''
            : null,
        })(<WeekPicker placeholder="请输入" format="YYYY-MM-DD" />)}
      </FormItem>
      <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="批量件计划时间">
        {form.getFieldDecorator('otsSollTime', {
          initialValue: isEdit
            ? editRecord.otsSollTime ? moment(editRecord.otsSollTime, 'YYYY-MM-DD HH:mm:ss') : ''
            : null,
        })(<WeekPicker placeholder="请输入" format="YYYY-MM-DD" />)}
      </FormItem>
      <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="批量件实际时间">
        {form.getFieldDecorator('otsIstTime', {
          initialValue: isEdit
            ? editRecord.otsIstTime ? moment(editRecord.otsIstTime, 'YYYY-MM-DD HH:mm:ss') : ''
            : null,
        })(<WeekPicker placeholder="请输入" format="YYYY-MM-DD" />)}
      </FormItem>
      <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="Aeko/AeA发生编号">
        {form.getFieldDecorator('einsatzNum', {
          initialValue: isEdit ? editRecord.einsatzNum : null,
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="Aeko/AeA取消编号">
        {form.getFieldDecorator('entfallNum', {
          initialValue: isEdit ? editRecord.entfallNum : null,
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="BMG计划时间">
        {form.getFieldDecorator('bmgSollTime', {
          initialValue: isEdit
            ? editRecord.bmgSollTime ? moment(editRecord.bmgSollTime, 'YYYY-MM-DD HH:mm:ss') : ''
            : null,
        })(<WeekPicker placeholder="请输入" format="YYYY-MM-DD" />)}
      </FormItem>
      <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="BMG实际时间">
        {form.getFieldDecorator('bmgIstTime', {
          initialValue: isEdit
            ? editRecord.bmgIstTime ? moment(editRecord.bmgIstTime, 'YYYY-MM-DD HH:mm:ss') : ''
            : null,
        })(<WeekPicker placeholder="请输入" format="YYYY-MM-DD" />)}
      </FormItem>
      <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="BMG-EMP计划时间">
        {form.getFieldDecorator('bmgEmpSollTime', {
          initialValue: isEdit
            ? editRecord.bmgEmpSollTime
              ? moment(editRecord.bmgEmpSollTime, 'YYYY-MM-DD HH:mm:ss')
              : ''
            : null,
        })(<WeekPicker placeholder="请输入" format="YYYY-MM-DD" />)}
      </FormItem>
      <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="BMG-EMP实际时间">
        {form.getFieldDecorator('bmgEmpIstTime', {
          initialValue: isEdit
            ? editRecord.bmgEmpIstTime
              ? moment(editRecord.bmgEmpIstTime, 'YYYY-MM-DD HH:mm:ss')
              : ''
            : null,
        })(<WeekPicker placeholder="请输入" format="YYYY-MM-DD" />)}
      </FormItem>
      <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="BMG-ONLINE编号">
        {form.getFieldDecorator('bmgOnlineNum', {
          initialValue: isEdit ? editRecord.bmgOnlineNum : null,
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="FE54计划时间">
        {form.getFieldDecorator('fe54SollTime', {
          initialValue: isEdit
            ? editRecord.fe54SollTime ? moment(editRecord.fe54SollTime, 'YYYY-MM-DD HH:mm:ss') : ''
            : null,
        })(<WeekPicker placeholder="请输入" format="YYYY-MM-DD" />)}
      </FormItem>
      <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="FE54实际时间">
        {form.getFieldDecorator('fe54IstTime', {
          initialValue: isEdit
            ? editRecord.fe54IstTime ? moment(editRecord.fe54IstTime, 'YYYY-MM-DD HH:mm:ss') : ''
            : null,
        })(<WeekPicker placeholder="请输入" format="YYYY-MM-DD" />)}
      </FormItem>
      <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="备注">
        {form.getFieldDecorator('remark', {
          initialValue: isEdit ? editRecord.remark : null,
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="是否沿用">
        {form.getFieldDecorator('ifCop', {
          initialValue: isEdit ? editRecord.ifCop : true,
        })(
          <RadioGroup>
            <Radio value={true}>是</Radio>
            <Radio value={false}>否</Radio>
          </RadioGroup>
        )}
      </FormItem>
    </Modal>
  );
});

@connect(({ teilschedule, loading }) => ({
  teilschedule,
  loading: loading.models.teilschedule,
}))
@Form.create()
export default class TeilScheduleList extends PureComponent {
  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    isEdit: false, // MODAL框判断，是添加还是修改
    editRecord: {}, // 要编辑的内容
    teilList: [], // 所有的排放阶段，为绑定select用的
  };

  componentDidMount() {
    const { dispatch } = this.props;

    const params = {
      // currentPage: 1,
      // pageSize: 10,
    };

    dispatch({
      type: 'teilschedule/init',
      payload: params,
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'teilschedule/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'teilschedule/fetch',
      payload: {},
    });
  };

  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'teilschedule/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      isEdit: false,
      modalVisible: !!flag,
    });
  };

  handleEditModalVisible = (record, flag) => {
    this.setState({
      editRecord: record,
      isEdit: true,
      modalVisible: !!flag,
    });
  };

  // 添加或者更新
  handleAdd = fields => {
    if (fields.isEdit) {
      this.props
        .dispatch({
          type: 'teilschedule/update',
          payload: {
            ...fields,
            anfragedatenTime:
              !fields['anfragedatenTime'] || fields['anfragedatenTime'] === null
                ? null
                : fields['anfragedatenTime'].format('YYYY-MM-DD 00:00:01'),
            cscSollTime:
              !fields['cscSollTime'] || fields['cscSollTime'] === null
                ? null
                : fields['cscSollTime'].format('YYYY-MM-DD 00:00:01'),
            cscIstTime:
              !fields['cscIstTime'] || fields['cscIstTime'] === null
                ? null
                : fields['cscIstTime'].format('YYYY-MM-DD 00:00:01'),
            kickoffSollTime:
              !fields['kickoffSollTime'] || fields['kickoffSollTime'] === null
                ? null
                : fields['kickoffSollTime'].format('YYYY-MM-DD 00:00:01'),
            kickoffIstTime:
              !fields['kickoffIstTime'] || fields['kickoffIstTime'] === null
                ? null
                : fields['kickoffIstTime'].format('YYYY-MM-DD 00:00:01'),
            pabEditSendTime:
              !fields['pabEditSendTime'] || fields['pabEditSendTime'] === null
                ? null
                : fields['pabEditSendTime'].format('YYYY-MM-DD 00:00:01'),
            pabFlowFinishTime:
              !fields['pabFlowFinishTime'] || fields['pabFlowFinishTime'] === null
                ? null
                : fields['pabFlowFinishTime'].format('YYYY-MM-DD 00:00:01'),
            pabCostFeedbackTime:
              !fields['pabCostFeedbackTime'] || fields['pabCostFeedbackTime'] === null
                ? null
                : fields['pabCostFeedbackTime'].format('YYYY-MM-DD 00:00:01'),
            bfSollTime:
              !fields['bfSollTime'] || fields['bfSollTime'] === null
                ? null
                : fields['bfSollTime'].format('YYYY-MM-DD 00:00:01'),
            bfIstTime:
              !fields['bfIstTime'] || fields['bfIstTime'] === null
                ? null
                : fields['bfIstTime'].format('YYYY-MM-DD 00:00:01'),
            firstTryoutIstTime:
              !fields['firstTryoutIstTime'] || fields['firstTryoutIstTime'] === null
                ? null
                : fields['firstTryoutIstTime'].format('YYYY-MM-DD 00:00:01'),
            otsSollTime:
              !fields['otsSollTime'] || fields['otsSollTime'] === null
                ? null
                : fields['otsSollTime'].format('YYYY-MM-DD 00:00:01'),
            otsIstTime:
              !fields['otsIstTime'] || fields['otsIstTime'] === null
                ? null
                : fields['otsIstTime'].format('YYYY-MM-DD 00:00:01'),
            bmgSollTime:
              !fields['bmgSollTime'] || fields['bmgSollTime'] === null
                ? null
                : fields['bmgSollTime'].format('YYYY-MM-DD 00:00:01'),
            bmgIstTime:
              !fields['bmgIstTime'] || fields['bmgIstTime'] === null
                ? null
                : fields['bmgIstTime'].format('YYYY-MM-DD 00:00:01'),
            bmgEmpSollTime:
              !fields['bmgEmpSollTime'] || fields['bmgEmpSollTime'] === null
                ? null
                : fields['bmgEmpSollTime'].format('YYYY-MM-DD 00:00:01'),
            bmgEmpIstTime:
              !fields['bmgEmpIstTime'] || fields['bmgEmpIstTime'] === null
                ? null
                : fields['bmgEmpIstTime'].format('YYYY-MM-DD 00:00:01'),
            fe54SollTime:
              !fields['fe54SollTime'] || fields['fe54SollTime'] === null
                ? null
                : fields['fe54SollTime'].format('YYYY-MM-DD 00:00:01'),
            fe54IstTime:
              !fields['fe54IstTime'] || fields['fe54IstTime'] === null
                ? null
                : fields['fe54IstTime'].format('YYYY-MM-DD 00:00:01'),
          },
        })
        .then(() => {
          this.props.dispatch({
            type: 'teilschedule/fetch',
            payload: {},
          });
          message.success('编辑成功');
        });
    } else {
      this.props
        .dispatch({
          type: 'teilschedule/add',
          payload: {
            ...fields,
            anfragedatenTime:
              fields['anfragedatenTime'] === null
                ? null
                : fields['anfragedatenTime'].format('YYYY-MM-DD 00:00:01'),
            cscSollTime:
              fields['cscSollTime'] === null
                ? null
                : fields['cscSollTime'].format('YYYY-MM-DD 00:00:01'),
            cscIstTime:
              fields['cscIstTime'] === null
                ? null
                : fields['cscIstTime'].format('YYYY-MM-DD 00:00:01'),
            kickoffSollTime:
              fields['kickoffSollTime'] === null
                ? null
                : fields['kickoffSollTime'].format('YYYY-MM-DD 00:00:01'),
            kickoffIstTime:
              fields['kickoffIstTime'] === null
                ? null
                : fields['kickoffIstTime'].format('YYYY-MM-DD 00:00:01'),
            pabEditSendTime:
              fields['pabEditSendTime'] === null
                ? null
                : fields['pabEditSendTime'].format('YYYY-MM-DD 00:00:01'),
            pabFlowFinishTime:
              fields['pabFlowFinishTime'] === null
                ? null
                : fields['pabFlowFinishTime'].format('YYYY-MM-DD 00:00:01'),
            pabCostFeedbackTime:
              fields['pabCostFeedbackTime'] === null
                ? null
                : fields['pabCostFeedbackTime'].format('YYYY-MM-DD 00:00:01'),
            bfSollTime:
              fields['bfSollTime'] === null
                ? null
                : fields['bfSollTime'].format('YYYY-MM-DD 00:00:01'),
            bfIstTime:
              fields['bfIstTime'] === null
                ? null
                : fields['bfIstTime'].format('YYYY-MM-DD 00:00:01'),
            firstTryoutIstTime:
              fields['firstTryoutIstTime'] === null
                ? null
                : fields['firstTryoutIstTime'].format('YYYY-MM-DD 00:00:01'),
            otsSollTime:
              fields['otsSollTime'] === null
                ? null
                : fields['otsSollTime'].format('YYYY-MM-DD 00:00:01'),
            otsIstTime:
              fields['otsIstTime'] === null
                ? null
                : fields['otsIstTime'].format('YYYY-MM-DD 00:00:01'),
            bmgSollTime:
              fields['bmgSollTime'] === null
                ? null
                : fields['bmgSollTime'].format('YYYY-MM-DD 00:00:01'),
            bmgIstTime:
              fields['bmgIstTime'] === null
                ? null
                : fields['bmgIstTime'].format('YYYY-MM-DD 00:00:01'),
            bmgEmpSollTime:
              fields['bmgEmpSollTime'] === null
                ? null
                : fields['bmgEmpSollTime'].format('YYYY-MM-DD 00:00:01'),
            bmgEmpIstTime:
              fields['bmgEmpIstTime'] === null
                ? null
                : fields['bmgEmpIstTime'].format('YYYY-MM-DD 00:00:01'),
            fe54SollTime:
              fields['fe54SollTime'] === null
                ? null
                : fields['fe54SollTime'].format('YYYY-MM-DD 00:00:01'),
            fe54IstTime:
              fields['fe54IstTime'] === null
                ? null
                : fields['fe54IstTime'].format('YYYY-MM-DD 00:00:01'),
          },
        })
        .then(() => {
          this.props.dispatch({
            type: 'teilschedule/fetch',
            payload: {},
          });
          message.success('添加成功');
        });
    }

    this.setState({
      modalVisible: false,
    });
  };

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="Teil Nr.">
              {getFieldDecorator('number')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="Benennung">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <a style={{ marginLeft: 8, display: 'none' }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="规则编号">
              {getFieldDecorator('no')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="调用次数">
              {getFieldDecorator('number')(<InputNumber style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="更新日期">
              {getFieldDecorator('date')(
                <DatePicker style={{ width: '100%' }} placeholder="请输入更新日期" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status3')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status4')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <span style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </span>
        </div>
      </Form>
    );
  }

  renderForm() {
    return this.state.expandForm ? this.renderSimpleForm() : this.renderSimpleForm();
  }

  remove = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'teilschedule/remove',
      payload: {
        id: `${record.id}`,
      },
    }).then(() => {
      dispatch({
        type: 'teilschedule/fetch',
      });
      message.success('删除成功');
    });
  };

  render() {
    const { teilschedule: { data }, loading } = this.props;
    const { modalVisible, teilList, isEdit, editRecord } = this.state;

    const columns = [
      {
        title: '零件号',
        dataIndex: 'teil.number',
        // render: val => (
        //   <span>
        //     <Ellipsis length={100} lines={1} tooltip>
        //       {val}
        //     </Ellipsis>
        //   </span>
        // ),
        fixed: 'left',
      },
      {
        title: '零件名称',
        dataIndex: 'teil.name',
        fixed: 'left',
      },
      {
        title: 'FOP',
        dataIndex: 'teil.fop.name',
        fixed: 'left',
      },
      {
        title: '询价资料时间',
        dataIndex: 'anfragedatenTime',
        render: val => <span>{val ? moment(val).format('YYYY-MM-DD') : ''}</span>,
      },
      {
        title: '采购定点计划时间',
        dataIndex: 'cscSollTime',
        render: val => <span>{val ? moment(val).format('YYYY-MM-DD') : ''}</span>,
      },
      {
        title: '采购定点实际时间',
        dataIndex: 'cscIstTime',
        render: val => <span>{val ? moment(val).format('YYYY-MM-DD') : ''}</span>,
      },
      {
        title: '项目启动会计划时间',
        dataIndex: 'kickoffSollTime',
        render: val => <span>{val ? moment(val).format('YYYY-MM-DD') : ''}</span>,
      },
      {
        title: '项目启动会实际时间',
        dataIndex: 'kickoffIstTime',
        render: val => <span>{val ? moment(val).format('YYYY-MM-DD') : ''}</span>,
      },
      {
        title: 'PAB编辑发送时间',
        dataIndex: 'pabEditSendTime',
        render: val => <span>{val ? moment(val).format('YYYY-MM-DD') : ''}</span>,
      },
      {
        title: 'PAB系统流转完成时间',
        dataIndex: 'pabFlowFinishTime',
        render: val => <span>{val ? moment(val).format('YYYY-MM-DD') : ''}</span>,
      },
      {
        title: 'PAB费用反馈的时间',
        dataIndex: 'pabCostFeedbackTime',
        render: val => <span>{val ? moment(val).format('YYYY-MM-DD') : ''}</span>,
      },
      {
        title: 'B-F计划时间',
        dataIndex: 'bfSollTime',
        render: val => <span>{val ? moment(val).format('YYYY-MM-DD') : ''}</span>,
      },
      {
        title: 'B-F实际时间',
        dataIndex: 'bfIstTime',
        render: val => <span>{val ? moment(val).format('YYYY-MM-DD') : ''}</span>,
      },
      {
        title: '首模件实际时间',
        dataIndex: 'firstTryoutIstTime',
        render: val => <span>{val ? moment(val).format('YYYY-MM-DD') : ''}</span>,
      },
      {
        title: '批量件计划时间',
        dataIndex: 'otsSollTime',
        render: val => <span>{val ? moment(val).format('YYYY-MM-DD') : ''}</span>,
      },
      {
        title: '批量件实际时间',
        dataIndex: 'otsIstTime',
        render: val => <span>{val ? moment(val).format('YYYY-MM-DD') : ''}</span>,
      },
      {
        title: 'Aeko/AeA发生编号',
        dataIndex: 'einsatzNum',
      },
      {
        title: 'Aeko/AeA取消编号',
        dataIndex: 'entfallNum',
      },
      {
        title: 'BMG计划时间',
        dataIndex: 'bmgSollTime',
        render: val => <span>{val ? moment(val).format('YYYY-MM-DD') : ''}</span>,
      },
      {
        title: 'BMG实际时间',
        dataIndex: 'bmgIstTime',
        render: val => <span>{val ? moment(val).format('YYYY-MM-DD') : ''}</span>,
      },
      {
        title: 'BMG-EMP计划时间',
        dataIndex: 'bmgEmpSollTime',
        render: val => <span>{val ? moment(val).format('YYYY-MM-DD') : ''}</span>,
      },
      {
        title: 'BMG-EMP实际时间',
        dataIndex: 'bmgEmpIstTime',
        render: val => <span>{val ? moment(val).format('YYYY-MM-DD') : ''}</span>,
      },
      {
        title: 'BMG-ONLINE编号',
        dataIndex: 'bmgOnlineNum',
      },
      {
        title: 'FE54计划时间',
        dataIndex: 'fe54SollTime',
        render: val => <span>{val ? moment(val).format('YYYY-MM-DD') : ''}</span>,
      },
      {
        title: 'FE54实际时间',
        dataIndex: 'fe54IstTime',
        render: val => <span>{val ? moment(val).format('YYYY-MM-DD') : ''}</span>,
      },
      {
        title: '备注',
        dataIndex: 'remark',
      },
      {
        title: '是否沿用',
        dataIndex: 'ifCop',
        render: val => <span>{val ? '是' : '否'}</span>,
      },

      {
        title: '录入时间',
        dataIndex: 'inTime',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '更新时间',
        dataIndex: 'updateTime',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '操作',
        render: record => (
          <Fragment>
            <a onClick={() => this.handleEditModalVisible(record, true)}>编辑</a>
            <Divider type="vertical" />
            <Popconfirm
              title="删除该零件进度信息？"
              okText="是"
              cancelText="否"
              onConfirm={() => this.remove(record)}
            >
              <a>删除</a>
            </Popconfirm>
          </Fragment>
        ),
      },
    ];

    // createForm所需的数据和方法
    //三个选择框
    let parentFields = {};
    if (data && data.teilList && data.teilList.length > 0) {
      this.setState({
        teilList: data.teilList,
      });
    }
    parentFields.teilList = teilList;
    parentFields.isEdit = isEdit;
    parentFields.editRecord = editRecord;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };

    return (
      <PageHeaderLayout title="过程信息管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                添加零件进度
              </Button>
            </div>
            <MyTable
              rowKey={record => record.id}
              loading={loading}
              data={data}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              scroll={{ x: 3600 }}
            />
          </div>
        </Card>

        <CreateForm {...parentMethods} {...parentFields} modalVisible={modalVisible} />
      </PageHeaderLayout>
    );
  }
}
