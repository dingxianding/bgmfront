import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import moment from 'moment';
import {Link} from 'dva/router';
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
} from 'antd';
import MyTable from 'components/MyTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './TeilList.less';

const FormItem = Form.Item;
const {Option} = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const bezugsart = ['CKD', 'LC'];
const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['询价阶段', 'BMG认可中', 'BMG完成', '异常'];


@connect(({teil, loading}) => ({
  teil,
  loading: loading.models.teil,
}))
@Form.create()
export default class TeilSearchList extends PureComponent {
  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    abgasstufeList: [], // 所有的排放阶段，为绑定select用的
    modellList: [], // 所有的车型，为绑定select用的
    aggregateList: [], // 所有的动力总成，为绑定select用的
  };

  componentDidMount() {
    const {dispatch} = this.props;

    const params = {
      // currentPage: 1,
      // pageSize: 10,
    };

    dispatch({
      type: 'teil/init',
      payload: params,
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const {dispatch} = this.props;
    const {formValues} = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = {...obj};
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
      type: 'teil/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const {form, dispatch} = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'teil/fetch',
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

    const {dispatch, form} = this.props;

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
        type: 'teil/fetch',
        payload: values,
      });
    });
  };

  renderSimpleForm() {
    const {getFieldDecorator} = this.props.form;
    const {
      modellList,
      aggregateList,
    } = this.state;

    const modellChildren = [];// 车型
    const aggregateChildren = [];// 动力总成

    if (modellList && modellList.length > 0) {
      // 车型
      for (let i = 0; i < modellList.length; i += 1) {
        modellChildren.push(
          <Option key={modellList[i].id} value={modellList[i].name}>
            {modellList[i].name}
          </Option>
        );
      }

      // 动力总成
      for (let i = 0; i < aggregateList.length; i += 1) {
        aggregateChildren.push(
          <Option key={aggregateList[i].id} value={aggregateList[i].name}>
            {aggregateList[i].name}
          </Option>
        );
      }
    }

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={8} sm={24}>
            <FormItem label="Teil Nr.">
              {getFieldDecorator('number')(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="Benennung">
              {getFieldDecorator('name')(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="Fzg. Modell">
              {getFieldDecorator('modell')(
                <Select
                  showSearch
                  style={{width: 150}}
                  placeholder="请选择"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {modellChildren}
                </Select>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={8} sm={24}>
            <FormItem label="Fzg. Aggregate">
              {getFieldDecorator('aggregate')(
                <Select
                  showSearch
                  style={{width: 150}}
                  placeholder="请选择"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {aggregateChildren}
                </Select>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="FOP/MOP">
              {getFieldDecorator('fop')(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>
                重置
              </Button>
              <a style={{marginLeft: 8, display: 'none'}} onClick={this.toggleForm}>
                展开 <Icon type="down"/>
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const {getFieldDecorator} = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={8} sm={24}>
            <FormItem label="规则编号">
              {getFieldDecorator('no')(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{width: '100%'}}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="调用次数">
              {getFieldDecorator('number')(<InputNumber style={{width: '100%'}}/>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={8} sm={24}>
            <FormItem label="更新日期">
              {getFieldDecorator('date')(
                <DatePicker style={{width: '100%'}} placeholder="请输入更新日期"/>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status3')(
                <Select placeholder="请选择" style={{width: '100%'}}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status4')(
                <Select placeholder="请选择" style={{width: '100%'}}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{overflow: 'hidden'}}>
          <span style={{float: 'right', marginBottom: 24}}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>
              重置
            </Button>
            <a style={{marginLeft: 8}} onClick={this.toggleForm}>
              收起 <Icon type="up"/>
            </a>
          </span>
        </div>
      </Form>
    );
  }

  renderForm() {
    return this.state.expandForm ? this.renderSimpleForm() : this.renderSimpleForm();
  }

  render() {
    const {teil: {data}, loading} = this.props;
    const {
      abgasstufeList,
      modellList,
      aggregateList,
    } = this.state;

    const columns = [
      {
        title: 'Teil Nr.',
        dataIndex: 'number',
        sorter: true,
      },
      {
        title: 'Benennung',
        dataIndex: 'name',
        sorter: true,
        render: (row, item) => (
          <Link to={`/teil/teil-profile/${item.id}`} style={{color: 'rgba(0, 0, 0, 0.65)'}}>
            {item.name}
          </Link>
        ),
      },
      {
        title: '状态',
        dataIndex: 'status',
        filters: [
          {
            text: status[0],
            value: 0,
          },
          {
            text: status[1],
            value: 1,
          },
          {
            text: status[2],
            value: 2,
          },
          {
            text: status[3],
            value: 3,
          },
        ],
        onFilter: (value, record) => record.status.toString() === value,
        render(val) {
          return <Badge status={statusMap[val]} text={status[val]}/>;
        },
      },
      {
        title: 'Lieferant',
        dataIndex: 'lieferant',
      },
      {
        title: 'Bezugsart',
        dataIndex: 'bezugsart',
        filters: [
          {
            text: bezugsart[0],
            value: 0,
          },
          {
            text: bezugsart[1],
            value: 1,
          },
        ],
        onFilter: (value, record) => record.bezugsart.toString() === value,
        render(val) {
          return bezugsart[val];
        },
      },
      {
        title: 'Abgasstufe',
        dataIndex: 'abgasstufe.name',
        filters: [
          {
            text: 'C5II', //TODO 应当从数据库读取
            value: 1,
          },
          {
            text: 'C6b mit RDE',
            value: 2,
          },
          {
            text: 'C6b ohne RDE',
            value: 3,
          },
        ],
        onFilter: (value, record) => record.abgasstufe.id.toString() === value,
      },
      {
        title: 'Ersteinsatz Modell',
        dataIndex: 'erstModell.name',
      },
      {
        title: 'Ersteinsatz Aggregate',
        dataIndex: 'erstAggregate.name',
      },
      {
        title: 'Fzg. Modell',
        dataIndex: 'modells.name',
        render: (val, row, index) => {
          const modells = row.modells;

          let result = '';
          if (modells && modells.length > 0) {
            for (let i = 0; i < modells.length; i++) {
              result += modells[i].name + ', ';
            }
            result = result.substr(0, result.length - 2);
          }
          return result;
        },
      },
      {
        title: 'Fzg. Aggregate',
        dataIndex: 'aggregates.name',
        render: (val, row, index) => {
          const aggregates = row.aggregates;

          let result = '';
          if (aggregates && aggregates.length > 0) {
            for (let i = 0; i < aggregates.length; i++) {
              result += aggregates[i].name + ', ';
            }
            result = result.substr(0, result.length - 2);
          }
          return result;
        },
      },
      {
        title: 'FOP/MOP',
        dataIndex: 'fop.name',
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
    ];

    if (data && data.modellList && data.modellList.length > 0) {
      this.setState({
        abgasstufeList: data.abgasstufeList,
        modellList: data.modellList,
        aggregateList: data.aggregateList,
      });
    }

    return (
      <PageHeaderLayout title="零部件查询">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <MyTable
              rowKey={record => record.id}
              loading={loading}
              data={data}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              scroll={{x: 2000}}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
