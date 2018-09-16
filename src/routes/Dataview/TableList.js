import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
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
} from 'antd';
import { MyTimelineChart } from 'components/Charts';
import MyTable from 'components/MyTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './TableList.less';

/**
 * 表格数据来自mock/rules.js中，tableListDataSource.push
 *
 */
const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

/**
 * connect是dva的用法，将rule.js这个model中的state映射到本组件的props
 * props一旦修改，会自动渲染组件
 *
 */
@connect(({ dataview, loading }) => ({
  dataview,
  loading: loading.models.dataview,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    modalVisible: false, // 新建数据的模态框是否显示
    expandForm: true, // 复杂查询框是否展开
    selectedRows: [],
    formValues: {}, // 查询表单的value
    currentTabKey: '',
  };

  componentDidMount() {
    const { dispatch } = this.props;

    const params = {
      dataId: 1,
      dataName: 'telemetry_attitude',
    };

    dispatch({
      type: 'dataview/fetchHeaderData',
      payload: params,
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataview/clear',
    });
  }

  handleTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      dataId: 1,
      dataName: 'telemetry_attitude',
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'dataview/fetchData',
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
      type: 'dataview/fetchData',
      payload: {
        dataId: 1,
        dataName: 'telemetry_attitude',
      },
    });
  };

  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
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
        dataId: 1,
        dataName: 'telemetry_attitude',
      };
      // 时间有可能没有选择
      if (fieldsValue.fromTime) {
        // values.fromTime = fieldsValue.fromTime.format('YYYY-MM-DD HH:mm:ss');
        values.fromTime = fieldsValue.fromTime.format('YYYY-MM-DD 00:00:00');
      }
      if (fieldsValue.toTime) {
        // values.toTime = fieldsValue.toTime.format('YYYY-MM-DD HH:mm:ss');
        values.toTime = fieldsValue.toTime.format('YYYY-MM-DD 23:59:59');
      }

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'dataview/fetchData',
        payload: values,
      });
    });
  };

  // 渲染简单的查询表单
  renderSimpleForm() {
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
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  // 渲染复杂的查询表单
  renderAdvancedForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
            <FormItem label="入库时间">
              {getFieldDecorator('fromTime')(
                <DatePicker style={{ width: '45%' }} placeholder="开始时间" />
              )}
              {getFieldDecorator('toTime')(
                <DatePicker style={{ width: '45%', marginLeft: 10 }} placeholder="结束时间" />
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 10 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <Button style={{ marginLeft: 10 }} type="primary" htmlType="submit">
                画图
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderForm() {
    return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  handleSelectChange = value => {
    // console.log(`selected ${value}`);
    // value=head2,secondInteger,mileSecondInteger
    // 获取选中列对应的数据
    // TODO 还要传搜索条件
    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        column: value.toString(),
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
        dataId: 1,
        dataName: 'telemetry_attitude',
      };

      // 时间有可能没有选择
      if (fieldsValue.fromTime) {
        // values.fromTime = fieldsValue.fromTime.format('YYYY-MM-DD HH:mm:ss');
        values.fromTime = fieldsValue.fromTime.format('YYYY-MM-DD 00:00:00');
      }
      if (fieldsValue.toTime) {
        // values.toTime = fieldsValue.toTime.format('YYYY-MM-DD HH:mm:ss');
        values.toTime = fieldsValue.toTime.format('YYYY-MM-DD 23:59:59');
      }

      dispatch({
        type: 'dataview/fetchChartData',
        payload: values,
      });
    });
  };

  renderChartForm() {
    const { getFieldDecorator } = this.props.form;
    const { dataview: { header, chartData } } = this.props;
    const Option = Select.Option;

    const children = [];
    if (header) {
      for (let i = 1; i < header.length; i++) {
        children.push(<Option key={header[i].dataIndex}>{header[i].title}</Option>);
      }
      // header.forEach((v, i, a) => {
      //   children.push(<Option key={v.dataIndex}>{v.title}</Option>);
      // });
    }

    // const chartData = [];
    // for (let i = 0; i < 20; i += 1) {
    //   chartData.push({
    //     x: new Date().getTime() + 1000 * 60 * 30 * i,
    //     y1: Math.floor(Math.random() * 100) + 10,
    //     y2: Math.floor(Math.random() * 100) + 10,
    //     y3: Math.floor(Math.random() * 100) + 10,
    //     y4: Math.floor(Math.random() * 100) + 10,
    //     y5: Math.floor(Math.random() * 100) + 10,
    //   });
    // }

    console.log(chartData);

    return (
      <Form layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <FormItem label="选择画图列">
            {getFieldDecorator('selectColumn')(
              <Select
                mode="multiple"
                style={{ width: '500px' }}
                placeholder="请选择"
                onChange={this.handleSelectChange}
              >
                {children}
              </Select>
            )}
          </FormItem>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <MyTimelineChart
            height={400}
            data={chartData}
            titleMap={{ y1: 'Y轴1', y2: 'Y轴2', y3: 'Y轴3', y4: 'Y轴4', y5: 'Y轴5' }}
          />
        </Row>
      </Form>
    );
  }

  render() {
    const { dataview: { data, header }, loading } = this.props;
    const { selectedRows } = this.state;
    let columns = [];
    let scroll;
    if (!header) {
      columns = [
        {
          title: '空的',
          dataIndex: 'no',
        },
      ];
      scroll = { x: true };
    } else {
      columns = header;
      // scroll应当根据列数计算得到
      // scroll={{x:16000}}当有99列的时候，差不多
      scroll = { x: header.length * 160 };
    }

    return (
      <PageHeaderLayout title="查询表格">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <MyTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleTableChange}
              scroll={scroll}
            />
          </div>
        </Card>
        <Card
          loading={loading}
          className={styles.offlineCard}
          bordered={false}
          bodyStyle={{ padding: '0 0 32px 0' }}
          style={{ marginTop: 32 }}
        >
          <div style={{ padding: '0 24px' }}>{this.renderChartForm()}</div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
