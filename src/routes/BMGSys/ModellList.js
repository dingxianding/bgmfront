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

import styles from './ModellList.less';

const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const CreateForm = Form.create({
  mapPropsToFields(props) {
    return {
      plateformList: Form.createFormField({
        ...props.plateformList,
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
    platformList,
    aggregateList,
    isEdit,
    editRecord,
  } = props;
  const platformChildren = [];
  const aggregateChildren = [];
  let formTitle = '添加车型';
  const aggregates = [];
  if (isEdit) {
    formTitle = '编辑车型';
    if (editRecord.aggregates) {
      const aggregatesLength = editRecord.aggregates.length;
      if (aggregatesLength > 0) {
        for (let i = 0; i < aggregatesLength; i += 1) {
          aggregates.push(editRecord.aggregates[i].name);
        }
      }
    }
  }

  if (platformList && platformList.length > 0) {
    // 平台
    for (let i = 0; i < platformList.length; i += 1) {
      platformChildren.push(
        <Option key={platformList[i].id} value={platformList[i].name}>
          {platformList[i].name}
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
      <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="车型名称">
        {form.getFieldDecorator('name', {
          initialValue: isEdit ? editRecord.name : null,
          rules: [{ required: true, message: '请输入车型名称' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="所属平台">
        {form.getFieldDecorator('platform', {
          initialValue: isEdit ? (editRecord.platform ? editRecord.platform.name : null) : null,
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
            {platformChildren}
          </Select>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="动力总成类型">
        {form.getFieldDecorator('aggregates', { initialValue: isEdit ? aggregates : [] })(
          <Select mode="multiple" style={{ width: 300 }} placeholder="请选择">
            {aggregateChildren}
          </Select>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="VFF时间">
        {form.getFieldDecorator('vffTime', {
          initialValue: isEdit
            ? editRecord.vffTime ? moment(editRecord.vffTime, 'YYYY-MM-DD HH:mm:ss') : ''
            : null,
        })(<WeekPicker placeholder="请输入" format="YYYY-MM-DD" />)}
      </FormItem>
      <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="PVS时间">
        {form.getFieldDecorator('pvsTime', {
          initialValue: isEdit
            ? editRecord.pvsTime ? moment(editRecord.pvsTime, 'YYYY-MM-DD HH:mm:ss') : ''
            : null,
        })(<WeekPicker placeholder="请输入" format="YYYY-MM-DD" />)}
      </FormItem>
      <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="0S TBT时间">
        {form.getFieldDecorator('osTbtTime', {
          initialValue: isEdit
            ? editRecord.osTbtTime ? moment(editRecord.osTbtTime, 'YYYY-MM-DD HH:mm:ss') : ''
            : null,
        })(<WeekPicker placeholder="请输入" format="YYYY-MM-DD" />)}
      </FormItem>
      <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="0S时间">
        {form.getFieldDecorator('osTime', {
          initialValue: isEdit
            ? editRecord.osTime ? moment(editRecord.osTime, 'YYYY-MM-DD HH:mm:ss') : ''
            : null,
        })(<WeekPicker placeholder="请输入" format="YYYY-MM-DD" />)}
      </FormItem>
      <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="SOP TBT时间">
        {form.getFieldDecorator('sopTbtTime', {
          initialValue: isEdit
            ? editRecord.sopTbtTime ? moment(editRecord.sopTbtTime, 'YYYY-MM-DD HH:mm:ss') : ''
            : null,
        })(<WeekPicker placeholder="请输入" format="YYYY-MM-DD" />)}
      </FormItem>
      <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="SOP时间">
        {form.getFieldDecorator('sopTime', {
          initialValue: isEdit
            ? editRecord.sopTime ? moment(editRecord.sopTime, 'YYYY-MM-DD HH:mm:ss') : ''
            : null,
        })(<WeekPicker placeholder="请输入" format="YYYY-MM-DD" />)}
      </FormItem>
      <FormItem
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 15 }}
        label="跑车数量（SWP/SVP/SPH/4KZ）"
      >
        {form.getFieldDecorator('runCount', {
          initialValue: isEdit ? editRecord.runCount : null,
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="跑车计划">
        {form.getFieldDecorator('runPlan', {
          initialValue: isEdit ? editRecord.runPlan : null,
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="描述">
        {form.getFieldDecorator('description', {
          initialValue: isEdit ? editRecord.description : null,
        })(<Input placeholder="请输入" />)}
      </FormItem>
    </Modal>
  );
});

@connect(({ modell, loading }) => ({
  modell,
  loading: loading.models.modell,
}))
@Form.create()
export default class ModellList extends PureComponent {
  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    isEdit: false, // MODAL框判断，是添加还是修改
    editRecord: {}, // 要编辑的内容
    platformList: [], // 所有的平台，为绑定select用的
    aggregateList: [], // 所有的动力总成，为绑定select用的
  };

  componentDidMount() {
    const { dispatch } = this.props;

    const params = {
      // currentPage: 1,
      // pageSize: 10,
    };

    dispatch({
      type: 'modell/init',
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
      type: 'modell/fetch',
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
      type: 'modell/fetch',
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
        type: 'modell/fetch',
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
          type: 'modell/update',
          payload: {
            ...fields,
            vffTime:
              !fields['vffTime'] || fields['vffTime'] === null
                ? null
                : fields['vffTime'].format('YYYY-MM-DD 00:00:01'),
            pvsTime:
              !fields['pvsTime'] || fields['pvsTime'] === null
                ? null
                : fields['pvsTime'].format('YYYY-MM-DD 00:00:01'),
            osTbtTime:
              !fields['osTbtTime'] || fields['osTbtTime'] === null
                ? null
                : fields['osTbtTime'].format('YYYY-MM-DD 00:00:01'),
            osTime:
              !fields['osTime'] || fields['osTime'] === null
                ? null
                : fields['osTime'].format('YYYY-MM-DD 00:00:01'),
            sopTbtTime:
              !fields['sopTbtTime'] || fields['sopTbtTime'] === null
                ? null
                : fields['sopTbtTime'].format('YYYY-MM-DD 00:00:01'),
            sopTime:
              !fields['sopTime'] || fields['sopTime'] === null
                ? null
                : fields['sopTime'].format('YYYY-MM-DD 00:00:01'),
          },
        })
        .then(() => {
          this.props.dispatch({
            type: 'modell/fetch',
            payload: {},
          });
          message.success('编辑成功');
        });
    } else {
      this.props
        .dispatch({
          type: 'modell/add',
          payload: {
            ...fields,
            vffTime:
              fields['vffTime'] === null ? null : fields['vffTime'].format('YYYY-MM-DD 00:00:01'),
            pvsTime:
              fields['pvsTime'] === null ? null : fields['pvsTime'].format('YYYY-MM-DD 00:00:01'),
            osTbtTime:
              fields['osTbtTime'] === null
                ? null
                : fields['osTbtTime'].format('YYYY-MM-DD 00:00:01'),
            osTime:
              fields['osTime'] === null ? null : fields['osTime'].format('YYYY-MM-DD 00:00:01'),
            sopTbtTime:
              fields['sopTbtTime'] === null
                ? null
                : fields['sopTbtTime'].format('YYYY-MM-DD 00:00:01'),
            sopTime:
              fields['sopTime'] === null ? null : fields['sopTime'].format('YYYY-MM-DD 00:00:01'),
          },
        })
        .then(() => {
          this.props.dispatch({
            type: 'modell/fetch',
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
    const { platformList, aggregateList } = this.state;

    const platformChildren = [];
    const aggregateChildren = [];
    if (platformList && platformList.length > 0) {
      // 平台
      for (let i = 0; i < platformList.length; i += 1) {
        platformChildren.push(
          <Option key={platformList[i].id} value={platformList[i].name}>
            {platformList[i].name}
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
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="车型名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="平台">
              {getFieldDecorator('platform')(
                <Select
                  showSearch
                  style={{ width: 150 }}
                  placeholder="请选择"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {platformChildren}
                </Select>
              )}
            </FormItem>
          </Col>
          {/*<Col md={7} sm={24}>*/}
          {/*<FormItem label="动力总成">*/}
          {/*{getFieldDecorator('aggregates')(*/}
          {/*<Select mode="multiple" style={{width: 180}} placeholder="请选择">*/}
          {/*{aggregateChildren}*/}
          {/*</Select>*/}
          {/*)}*/}
          {/*</FormItem>*/}
          {/*</Col>*/}
          <Col md={5} sm={24}>
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
      type: 'modell/remove',
      payload: {
        id: `${record.id}`,
      },
    }).then(() => {
      dispatch({
        type: 'modell/fetch',
      });
      message.success('删除成功');
    });
  };

  render() {
    const { modell: { data }, loading } = this.props;
    const {
      modalVisible,
      platformList,
      modellList,
      aggregateList,
      isEdit,
      editRecord,
    } = this.state;

    const columns = [
      {
        title: '车型名称',
        dataIndex: 'name',
        sorter: true,
      },
      {
        title: '平台',
        dataIndex: 'platform.name',
      },
      {
        title: '动力总成类型',
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
        title: 'VFF时间',
        dataIndex: 'vffTime',
        render: val => <span>{val ? moment(val).format('YYYY-MM-DD') : ''}</span>,
      },
      {
        title: 'PVS时间',
        dataIndex: 'pvsTime',
        render: val => <span>{val ? moment(val).format('YYYY-MM-DD') : ''}</span>,
      },
      {
        title: '0S TBT时间',
        dataIndex: 'osTbtTime',
        render: val => <span>{val ? moment(val).format('YYYY-MM-DD') : ''}</span>,
      },
      {
        title: '0S时间',
        dataIndex: 'osTime',
        render: val => <span>{val ? moment(val).format('YYYY-MM-DD') : ''}</span>,
      },
      {
        title: 'SOP TBT时间',
        dataIndex: 'sopTbtTime',
        render: val => <span>{val ? moment(val).format('YYYY-MM-DD') : ''}</span>,
      },
      {
        title: 'SOP时间',
        dataIndex: 'sopTime',
        render: val => <span>{val ? moment(val).format('YYYY-MM-DD') : ''}</span>,
      },
      {
        title: '跑车数量（SWP/SVP/SPH/4KZ）',
        dataIndex: 'runCount',
      },
      {
        title: '跑车计划',
        dataIndex: 'runPlan',
      },
      {
        title: '描述',
        dataIndex: 'description',
      },
      {
        title: '录入人员',
        dataIndex: 'inUser.name',
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
        render: val => <span>{val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : ''}</span>,
      },
      {
        title: '操作',
        render: record => (
          <Fragment>
            <a onClick={() => this.handleEditModalVisible(record, true)}>编辑</a>
            <Divider type="vertical" />
            <Popconfirm
              title="将删除该车型所有相关信息，确认删除？"
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
    if (data && data.platformList && data.platformList.length > 0) {
      this.setState({
        platformList: data.platformList,
        aggregateList: data.aggregateList,
      });
    }
    parentFields.platformList = platformList;
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
                添加车型
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
