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
import md5 from 'blueimp-md5';
import {stringRole, momentTime, chineseRole} from '../../utils/utils';
import {getMyId} from '../../utils/authority';

import styles from './UserList.less';

const FormItem = Form.Item;
const {Option} = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const CreateForm = Form.create({
  mapPropsToFields(props) {
    return {};
  },
})(props => {
  const {
    modalVisible,
    form,
    handleAdd,
    handleModalVisible,
    isEdit,
    editRecord,
  } = props;

  const roleChildren = [];// 供货状态
  let formTitle = '添加用户';
  if (isEdit) {
    formTitle = '编辑用户';
  }

  // 用户角色
  roleChildren.push(<Option value={2}> {'部门领导'} </Option>);
  roleChildren.push(<Option value={3}> {'普通用户'}</Option>);

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      let params = {...fieldsValue};
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
      <FormItem labelCol={{span: 8}} wrapperCol={{span: 15}} label="用户名">
        {form.getFieldDecorator('username', {
          initialValue: isEdit ? editRecord.username : null,
          rules: [{required: true, message: '请输入用户名'}],
        })(<Input placeholder="请输入"/>)}
      </FormItem>
      <FormItem labelCol={{span: 8}} wrapperCol={{span: 15}} label="工号">
        {form.getFieldDecorator('number', {
          initialValue: isEdit ? editRecord.number : null,
          rules: [{required: true, message: '请输入工号'}],
        })(<Input placeholder="请输入"/>)}
      </FormItem>
      <FormItem labelCol={{span: 8}} wrapperCol={{span: 15}} label="姓名">
        {form.getFieldDecorator('name', {
          initialValue: isEdit ? editRecord.name : null,
          rules: [{required: true, message: '请输入姓名'}],
        })(<Input placeholder="请输入"/>)}
      </FormItem>
      <FormItem labelCol={{span: 8}} wrapperCol={{span: 15}} label="用户角色">
        {form.getFieldDecorator('role', {
          initialValue: isEdit ? parseInt(editRecord.role) : null,
          rules: [{required: true, message: '请选择角色'}],
        })(
          <Select style={{width: 120}}>
            {roleChildren}
          </Select>
        )}
      </FormItem>
      <FormItem labelCol={{span: 8}} wrapperCol={{span: 15}} label="备注">
        {form.getFieldDecorator('remark', {
          initialValue: isEdit ? editRecord.remark : null,
        })(<Input placeholder="请输入"/>)}
      </FormItem>
    </Modal>
  );
});

@connect(({usermng, loading}) => ({
  usermng,
  loading: loading.models.usermng,
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
  };

  componentDidMount() {
    const {dispatch} = this.props;

    const params = {
      // currentPage: 1,
      // pageSize: 10,
    };

    dispatch({
      type: 'usermng/init',
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
      type: 'usermng/fetch',
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
      type: 'usermng/fetch',
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
        type: 'usermng/fetch',
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
          type: 'usermng/update',
          payload: {
            ...fields,
          },
        })
        .then(() => {
          this.props.dispatch({
            type: 'usermng/fetch',
            payload: {},
          });
          message.success('编辑成功');
        });
    } else {
      this.props
        .dispatch({
          type: 'usermng/add',
          payload: {
            ...fields,
          },
        })
        .then(() => {
          this.props.dispatch({
            type: 'usermng/fetch',
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
    const {getFieldDecorator} = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={8} sm={24}>
            <FormItem label="工号">
              {getFieldDecorator('number')(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="姓名">
              {getFieldDecorator('name')(<Input placeholder="请输入"/>)}
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

  renderForm() {
    return this.state.expandForm ? this.renderSimpleForm() : this.renderSimpleForm();
  }

  remove = record => {
    const {dispatch} = this.props;
    dispatch({
      type: 'usermng/remove',
      payload: {
        id: `${record.id}`,
      },
    }).then(() => {
      dispatch({
        type: 'usermng/fetch',
      });
      message.success('删除成功');
    });
  };

  render() {
    const {usermng: {data}, loading} = this.props;
    const {
      modalVisible,
      isEdit,
      editRecord,
    } = this.state;

    const columns = [
      {
        title: '用户名',
        dataIndex: 'username',
        sorter: true,
      },
      {
        title: '工号',
        dataIndex: 'number',
        sorter: true,
      },
      {
        title: '姓名',
        dataIndex: 'name',
        sorter: true,
      },
      {
        title: '用户角色',
        dataIndex: 'role',
        render: val => chineseRole(stringRole(val)),
        filters: [
          {
            text: '部门领导',
            value: 2,
          },
          {
            text: '普通用户',
            value: 3,
          },
        ],
        filterMultiple: false,
        onFilter: (value, record) => record.role.toString() === value,
      },
      {
        title: '备注',
        dataIndex: 'remark',
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
            <Divider type="vertical"/>
            <Popconfirm
              title="将删除该用户所有相关信息，确认删除？"
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
    let parentFields = {};
    parentFields.isEdit = isEdit;
    parentFields.editRecord = editRecord;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };

    return (
      <PageHeaderLayout title="用户管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                添加用户
              </Button>
            </div>
            <MyTable
              rowKey={record => record.id}
              loading={loading}
              data={data}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>

        <CreateForm {...parentMethods} {...parentFields} modalVisible={modalVisible}/>
      </PageHeaderLayout>
    );
  }
}

