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
} from 'antd';
import MyTable from 'components/MyTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './TeilList.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const bezugsart = ['CKD', 'LC'];

const CreateForm = Form.create({
  mapPropsToFields(props) {
    return {
      abgasstufeList: Form.createFormField({
        ...props.abgasstufeList,
      }),
      modellList: Form.createFormField({
        ...props.modellList,
      }),
      aggregateList: Form.createFormField({
        ...props.aggregateList,
      }),
    };
  },
})(props => {
  const {
    modalVisible,
    form,
    handleAdd,
    handleModalVisible,
    abgasstufeList,
    modellList,
    aggregateList,
    isEdit,
    editRecord,
  } = props;
  const abgasstufeChildren = [];
  const modellChildren = [];
  const aggregateChildren = [];
  let formTitle = '添加零件';
  const modells = [];
  const aggregates = [];
  if (isEdit) {
    formTitle = '编辑零件';
    const modellsLength = editRecord.modells.length;
    if (modellsLength > 0) {
      for (let i = 0; i < modellsLength; i += 1) {
        modells.push(editRecord.modells[i].name);
      }
    }
    const aggregatesLength = editRecord.aggregates.length;
    if (aggregatesLength > 0) {
      for (let i = 0; i < aggregatesLength; i += 1) {
        aggregates.push(editRecord.aggregates[i].name);
      }
    }
  }

  if (abgasstufeList && abgasstufeList.length > 0) {
    // 排放阶段
    for (let i = 0; i < abgasstufeList.length; i += 1) {
      abgasstufeChildren.push(
        <Option key={abgasstufeList[i].id} value={abgasstufeList[i].name}>
          {abgasstufeList[i].name}
        </Option>
      );
    }

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
      <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="Teil Nr.">
        {form.getFieldDecorator('number', {
          initialValue: isEdit ? editRecord.number : null,
          rules: [{ required: true, message: '请输入Teil Nr.' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="Benennung">
        {form.getFieldDecorator('name', {
          initialValue: isEdit ? editRecord.name : null,
          rules: [{ required: true, message: '请输入Benennung' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="Lieferant">
        {form.getFieldDecorator('lieferant', {
          initialValue: isEdit ? editRecord.lieferant : null,
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="Bezugsart">
        {form.getFieldDecorator('bezugsart', { initialValue: isEdit ? editRecord.bezugsart : '1' })(
          <Select style={{ width: 120 }}>
            <Option value="1">LC</Option>
            <Option value="0">CKD</Option>
          </Select>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="Abgasstufe">
        {form.getFieldDecorator('abgasstufe', {
          initialValue: isEdit ? (editRecord.abgasstufe ? editRecord.abgasstufe.name : null) : null,
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
            {abgasstufeChildren}
          </Select>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="Ersteinsatz Modell">
        {form.getFieldDecorator('erstModell', {
          initialValue: isEdit ? (editRecord.erstModell ? editRecord.erstModell.name : null) : null,
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
            {modellChildren}
          </Select>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="Ersteinsatz Aggregate">
        {form.getFieldDecorator('erstAggregate', {
          initialValue: isEdit
            ? editRecord.erstAggregate ? editRecord.erstAggregate.name : null
            : null,
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
            {aggregateChildren}
          </Select>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="Fzg. Modell">
        {form.getFieldDecorator('modells', { initialValue: isEdit ? modells : [] })(
          <Select mode="multiple" style={{ width: 300 }} placeholder="请选择">
            {modellChildren}
          </Select>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="Fzg. Aggregate">
        {form.getFieldDecorator('aggregates', { initialValue: isEdit ? aggregates : [] })(
          <Select mode="multiple" style={{ width: 300 }} placeholder="请选择">
            {aggregateChildren}
          </Select>
        )}
      </FormItem>
    </Modal>
  );
});

@connect(({ teil, loading }) => ({
  teil,
  loading: loading.models.teil,
}))
@Form.create()
export default class TeilList extends PureComponent {
  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    isEdit: false, // MODAL框判断，是添加还是修改
    editRecord: {}, // 要编辑的内容
    abgasstufeList: [], // 所有的排放阶段，为绑定select用的
    modellList: [], // 所有的车型，为绑定select用的
    aggregateList: [], // 所有的动力总成，为绑定select用的
  };

  componentDidMount() {
    const { dispatch } = this.props;

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
      type: 'teil/fetch',
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
        type: 'teil/fetch',
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
          type: 'teil/update',
          payload: {
            ...fields,
          },
        })
        .then(() => {
          this.props.dispatch({
            type: 'teil/fetch',
            payload: {},
          });
          message.success('编辑成功');
        });
    } else {
      this.props
        .dispatch({
          type: 'teil/add',
          payload: {
            ...fields,
          },
        })
        .then(() => {
          this.props.dispatch({
            type: 'teil/fetch',
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
      type: 'teil/remove',
      payload: {
        id: `${record.id}`,
      },
    }).then(() => {
      dispatch({
        type: 'teil/fetch',
      });
      message.success('删除成功');
    });
  };

  render() {
    const { teil: { data }, loading } = this.props;
    const {
      modalVisible,
      abgasstufeList,
      modellList,
      aggregateList,
      isEdit,
      editRecord,
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
            text: 'CKD',
            value: 0,
          },
          {
            text: 'LC',
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
      {
        title: '操作',
        render: record => (
          <Fragment>
            <a onClick={() => this.handleEditModalVisible(record, true)}>编辑</a>
            <Divider type="vertical" />
            <Popconfirm
              title="将删除该零件所有相关信息，确认删除？"
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
    if (data && data.abgasstufeList && data.abgasstufeList.length > 0) {
      this.setState({
        abgasstufeList: data.abgasstufeList,
        modellList: data.modellList,
        aggregateList: data.aggregateList,
      });
    }
    parentFields.abgasstufeList = abgasstufeList;
    parentFields.modellList = modellList;
    parentFields.aggregateList = aggregateList;
    parentFields.isEdit = isEdit;
    parentFields.editRecord = editRecord;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };

    return (
      <PageHeaderLayout title="查询表格">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                添加零件
              </Button>
            </div>
            <MyTable
              rowKey={record => record.id}
              loading={loading}
              data={data}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              scroll={{ x: 2000 }}
            />
          </div>
        </Card>

        <CreateForm {...parentMethods} {...parentFields} modalVisible={modalVisible} />
      </PageHeaderLayout>
    );
  }
}
