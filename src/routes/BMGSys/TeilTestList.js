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
  Radio, Upload,
} from 'antd';
import MyTable from 'components/MyTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './TeilTestList.less';

const {MonthPicker, RangePicker, WeekPicker} = DatePicker;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const {Option} = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const UrlHead = 'http://localhost:18080/download/';

const CreateForm = Form.create({
  mapPropsToFields(props) {
    return {
      teilList: Form.createFormField({
        ...props.teilList,
      }),
    };
  },
})(props => {
  const {modalVisible, form, handleAdd, handleModalVisible, teilList, isEdit, editRecord, beforeUpload,} = props;
  const teilChildren = [];
  const sizeTestReport = [];//尺寸实验报告
  const materialTestReport = [];//材料实验报告
  const supplierTestReport = [];//供应商自检实验报告
  const wobTestReport = [];//WOB实验报告

  let formTitle = '添加试验信息';
  if (isEdit) {
    formTitle = '编辑试验信息';
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

    //尺寸实验报告
    if (editRecord.sizeTestReport) {
      const listLength = editRecord.sizeTestReport.length;
      if (listLength > 0) {
        for (let i = 0; i < listLength; i += 1) {
          let file = {};
          file.uid = editRecord.sizeTestReport[i].id;
          file.name = editRecord.sizeTestReport[i].name;
          file.status = 'done';
          sizeTestReport.push(file);
        }
      }
    }

    //材料实验报告
    if (editRecord.materialTestReport) {
      const listLength = editRecord.materialTestReport.length;
      if (listLength > 0) {
        for (let i = 0; i < listLength; i += 1) {
          let file = {};
          file.uid = editRecord.materialTestReport[i].id;
          file.name = editRecord.materialTestReport[i].name;
          file.status = 'done';
          materialTestReport.push(file);
        }
      }
    }

    //供应商自检实验报告
    if (editRecord.supplierTestReport) {
      const listLength = editRecord.supplierTestReport.length;
      if (listLength > 0) {
        for (let i = 0; i < listLength; i += 1) {
          let file = {};
          file.uid = editRecord.supplierTestReport[i].id;
          file.name = editRecord.supplierTestReport[i].name;
          file.status = 'done';
          supplierTestReport.push(file);
        }
      }
    }

    //WOB实验报告
    if (editRecord.wobTestReport) {
      const listLength = editRecord.wobTestReport.length;
      if (listLength > 0) {
        for (let i = 0; i < listLength; i += 1) {
          let file = {};
          file.uid = editRecord.wobTestReport[i].id;
          file.name = editRecord.wobTestReport[i].name;
          file.status = 'done';
          wobTestReport.push(file);
        }
      }
    }
  }

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

  const fileProps = {
    name: 'file',
    action: '/myapi/upload/',
    beforeUpload: beforeUpload,
    onChange(info) {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} 上传成功`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 上传失败`);
      }
    },
  };

  return (
    <Modal
      title={formTitle}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{span: 8}} wrapperCol={{span: 15}} label="零件编号">
        {form.getFieldDecorator('teil', {
          initialValue: isEdit ? (editRecord.teil ? editRecord.teil.number : null) : null,
          rules: [{required: true, message: '请选择零件'}],
        })(
          <Select
            showSearch
            style={{width: 150}}
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
      <FormItem labelCol={{span: 8}} wrapperCol={{span: 15}} label="尺寸计划送样时间">
        {form.getFieldDecorator('sizeSollTime', {
          initialValue: isEdit
            ? editRecord.sizeSollTime
              ? moment(editRecord.sizeSollTime, 'YYYY-MM-DD HH:mm:ss')
              : ''
            : null,
        })(<WeekPicker placeholder="请输入" format="YYYY-MM-DD"/>)}
      </FormItem>
      <FormItem labelCol={{span: 8}} wrapperCol={{span: 15}} label="尺寸实际送样时间">
        {form.getFieldDecorator('sizeIstTime', {
          initialValue: isEdit
            ? editRecord.sizeIstTime ? moment(editRecord.sizeIstTime, 'YYYY-MM-DD HH:mm:ss') : ''
            : null,
        })(<WeekPicker placeholder="请输入" format="YYYY-MM-DD"/>)}
      </FormItem>
      <FormItem labelCol={{span: 8}} wrapperCol={{span: 15}} label="尺寸实验实际完成时间">
        {form.getFieldDecorator('sizeTestIstTime', {
          initialValue: isEdit
            ? editRecord.sizeTestIstTime ? moment(editRecord.sizeTestIstTime, 'YYYY-MM-DD HH:mm:ss') : ''
            : null,
        })(<WeekPicker placeholder="请输入" format="YYYY-MM-DD"/>)}
      </FormItem>
      <FormItem labelCol={{span: 8}} wrapperCol={{span: 15}} label="尺寸实验报告">
        {form.getFieldDecorator('sizeTestReport', {
          initialValue: isEdit ? {fileList: sizeTestReport} : null,
        })(
          <Upload {...fileProps} defaultFileList={sizeTestReport}>
            <Button>
              <Icon type="upload"/> 选择文件
            </Button>
          </Upload>
        )}
      </FormItem>
      <FormItem labelCol={{span: 8}} wrapperCol={{span: 15}} label="材料计划送样时间">
        {form.getFieldDecorator('materialSollTime', {
          initialValue: isEdit
            ? editRecord.materialSollTime ? moment(editRecord.materialSollTime, 'YYYY-MM-DD HH:mm:ss') : ''
            : null,
        })(<WeekPicker placeholder="请输入" format="YYYY-MM-DD"/>)}
      </FormItem>
      <FormItem labelCol={{span: 8}} wrapperCol={{span: 15}} label="材料实际送样时间">
        {form.getFieldDecorator('materialIstTime', {
          initialValue: isEdit
            ? editRecord.materialIstTime ? moment(editRecord.materialIstTime, 'YYYY-MM-DD HH:mm:ss') : ''
            : null,
        })(<WeekPicker placeholder="请输入" format="YYYY-MM-DD"/>)}
      </FormItem>
      <FormItem labelCol={{span: 8}} wrapperCol={{span: 15}} label="材料实验实际完成时间">
        {form.getFieldDecorator('materialTestIstTime', {
          initialValue: isEdit
            ? editRecord.materialTestIstTime ? moment(editRecord.materialTestIstTime, 'YYYY-MM-DD HH:mm:ss') : ''
            : null,
        })(<WeekPicker placeholder="请输入" format="YYYY-MM-DD"/>)}
      </FormItem>
      <FormItem labelCol={{span: 8}} wrapperCol={{span: 15}} label="材料实验报告">
        {form.getFieldDecorator('materialTestReport', {
          initialValue: isEdit ? {fileList: materialTestReport} : null,
        })(
          <Upload {...fileProps} defaultFileList={materialTestReport}>
            <Button>
              <Icon type="upload"/> 选择文件
            </Button>
          </Upload>
        )}
      </FormItem>
      <FormItem labelCol={{span: 8}} wrapperCol={{span: 15}} label="供应商自检实验完成时间">
        {form.getFieldDecorator('supplierTestIstTime', {
          initialValue: isEdit
            ? editRecord.supplierTestIstTime
              ? moment(editRecord.supplierTestIstTime, 'YYYY-MM-DD HH:mm:ss')
              : ''
            : null,
        })(<WeekPicker placeholder="请输入" format="YYYY-MM-DD"/>)}
      </FormItem>
      <FormItem labelCol={{span: 8}} wrapperCol={{span: 15}} label="供应商自检实验报告">
        {form.getFieldDecorator('supplierTestReport', {
          initialValue: isEdit ? {fileList: supplierTestReport} : null,
        })(
          <Upload {...fileProps} defaultFileList={supplierTestReport}>
            <Button>
              <Icon type="upload"/> 选择文件
            </Button>
          </Upload>
        )}
      </FormItem>
      <FormItem labelCol={{span: 8}} wrapperCol={{span: 15}} label="零件寄WOB做性能时间">
        {form.getFieldDecorator('sendWobTime', {
          initialValue: isEdit
            ? editRecord.sendWobTime ? moment(editRecord.sendWobTime, 'YYYY-MM-DD HH:mm:ss') : ''
            : null,
        })(<WeekPicker placeholder="请输入" format="YYYY-MM-DD"/>)}
      </FormItem>
      <FormItem labelCol={{span: 8}} wrapperCol={{span: 15}} label="WOB实验完成时间">
        {form.getFieldDecorator('wobTestCompleteTime', {
          initialValue: isEdit
            ? editRecord.wobTestCompleteTime ? moment(editRecord.wobTestCompleteTime, 'YYYY-MM-DD HH:mm:ss') : ''
            : null,
        })(<WeekPicker placeholder="请输入" format="YYYY-MM-DD"/>)}
      </FormItem>
      <FormItem labelCol={{span: 8}} wrapperCol={{span: 15}} label="WOB实验报告">
        {form.getFieldDecorator('wobTestReport', {
          initialValue: isEdit ? {fileList: wobTestReport} : null,
        })(
          <Upload {...fileProps} defaultFileList={wobTestReport}>
            <Button>
              <Icon type="upload"/> 选择文件
            </Button>
          </Upload>
        )}
      </FormItem>
      <FormItem labelCol={{span: 8}} wrapperCol={{span: 15}} label="耐久实验搭载车辆信息">
        {form.getFieldDecorator('endureTestCarInfo', {
          initialValue: isEdit ? editRecord.endureTestCarInfo : null,
        })(<Input placeholder="请输入"/>)}
      </FormItem>
      <FormItem labelCol={{span: 8}} wrapperCol={{span: 15}} label="备注">
        {form.getFieldDecorator('remark', {
          initialValue: isEdit ? editRecord.remark : null,
        })(<Input placeholder="请输入"/>)}
      </FormItem>
      <FormItem labelCol={{span: 8}} wrapperCol={{span: 15}} label="是否沿用">
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

@connect(({teiltest, loading}) => ({
  teiltest,
  loading: loading.models.teiltest,
}))
@Form.create()
export default class TeilTestList extends PureComponent {
  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    isEdit: false, // MODAL框判断，是添加还是修改
    editRecord: {}, // 要编辑的内容
    teilList: [], // 所有的零件，为绑定select用的
  };

  componentDidMount() {
    const {dispatch} = this.props;

    const params = {
      // currentPage: 1,
      // pageSize: 10,
    };

    dispatch({
      type: 'teiltest/init',
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
      type: 'teiltest/fetch',
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
      type: 'teiltest/fetch',
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
        type: 'teiltest/fetch',
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
          type: 'teiltest/update',
          payload: {
            ...fields,
            sizeSollTime:
              !fields['sizeSollTime'] || fields['sizeSollTime'] === null
                ? null
                : fields['sizeSollTime'].format('YYYY-MM-DD 00:00:01'),
            sizeIstTime:
              !fields['sizeIstTime'] || fields['sizeIstTime'] === null
                ? null
                : fields['sizeIstTime'].format('YYYY-MM-DD 00:00:01'),
            sizeTestIstTime:
              !fields['sizeTestIstTime'] || fields['sizeTestIstTime'] === null
                ? null
                : fields['sizeTestIstTime'].format('YYYY-MM-DD 00:00:01'),
            sizeTestReport: (fields['sizeTestReport']) ? this.getFileListFileId(fields['sizeTestReport'].fileList) : null,
            materialSollTime:
              !fields['materialSollTime'] || fields['materialSollTime'] === null
                ? null
                : fields['materialSollTime'].format('YYYY-MM-DD 00:00:01'),
            materialIstTime:
              !fields['materialIstTime'] || fields['materialIstTime'] === null
                ? null
                : fields['materialIstTime'].format('YYYY-MM-DD 00:00:01'),
            materialTestIstTime:
              !fields['materialTestIstTime'] || fields['materialTestIstTime'] === null
                ? null
                : fields['materialTestIstTime'].format('YYYY-MM-DD 00:00:01'),
            materialTestReport: (fields['materialTestReport']) ? this.getFileListFileId(fields['materialTestReport'].fileList) : null,
            supplierTestIstTime:
              !fields['supplierTestIstTime'] || fields['supplierTestIstTime'] === null
                ? null
                : fields['supplierTestIstTime'].format('YYYY-MM-DD 00:00:01'),
            supplierTestReport: (fields['supplierTestReport']) ? this.getFileListFileId(fields['supplierTestReport'].fileList) : null,
            sendWobTime:
              !fields['sendWobTime'] || fields['sendWobTime'] === null
                ? null
                : fields['sendWobTime'].format('YYYY-MM-DD 00:00:01'),
            wobTestCompleteTime:
              !fields['wobTestCompleteTime'] || fields['wobTestCompleteTime'] === null
                ? null
                : fields['wobTestCompleteTime'].format('YYYY-MM-DD 00:00:01'),
            wobTestReport: (fields['wobTestReport']) ? this.getFileListFileId(fields['wobTestReport'].fileList) : null,
          },
        })
        .then(() => {
          this.props.dispatch({
            type: 'teiltest/fetch',
            payload: {},
          });
          message.success('编辑成功');
        });
    } else {
      this.props
        .dispatch({
          type: 'teiltest/add',
          payload: {
            ...fields,
            sizeSollTime:
              fields['sizeSollTime'] === null
                ? null
                : fields['sizeSollTime'].format('YYYY-MM-DD 00:00:01'),
            sizeIstTime:
              fields['sizeIstTime'] === null
                ? null
                : fields['sizeIstTime'].format('YYYY-MM-DD 00:00:01'),
            sizeTestIstTime:
              fields['sizeTestIstTime'] === null
                ? null
                : fields['sizeTestIstTime'].format('YYYY-MM-DD 00:00:01'),
            sizeTestReport: (fields['sizeTestReport']) ? this.getFileListFileId(fields['sizeTestReport'].fileList) : null,
            materialSollTime:
              fields['materialSollTime'] === null
                ? null
                : fields['materialSollTime'].format('YYYY-MM-DD 00:00:01'),
            materialIstTime:
              fields['materialIstTime'] === null
                ? null
                : fields['materialIstTime'].format('YYYY-MM-DD 00:00:01'),
            materialTestIstTime:
              fields['materialTestIstTime'] === null
                ? null
                : fields['materialTestIstTime'].format('YYYY-MM-DD 00:00:01'),
            materialTestReport: (fields['materialTestReport']) ? this.getFileListFileId(fields['materialTestReport'].fileList) : null,
            supplierTestIstTime:
              fields['supplierTestIstTime'] === null
                ? null
                : fields['supplierTestIstTime'].format('YYYY-MM-DD 00:00:01'),
            supplierTestReport: (fields['supplierTestReport']) ? this.getFileListFileId(fields['supplierTestReport'].fileList) : null,
            sendWobTime:
              fields['sendWobTime'] === null
                ? null
                : fields['sendWobTime'].format('YYYY-MM-DD 00:00:01'),
            wobTestCompleteTime:
              fields['wobTestCompleteTime'] === null
                ? null
                : fields['wobTestCompleteTime'].format('YYYY-MM-DD 00:00:01'),
            wobTestReport: (fields['wobTestReport']) ? this.getFileListFileId(fields['wobTestReport'].fileList) : null,
          },
        })
        .then(() => {
          this.props.dispatch({
            type: 'teiltest/fetch',
            payload: {},
          });
          message.success('添加成功');
        });
    }

    this.setState({
      modalVisible: false,
    });
  };

  getFileListFileId = fileList => {
    if (fileList && fileList.length > 0) {
      const idList = [];
      for (let i = 0; i < fileList.length; i++) {
        //文件是新上传的
        if (fileList[i].response) {
          idList.push(fileList[i].response.fileId);
        } else {
          //文件本来就有的
          idList.push(fileList[i].uid);
        }
      }
      return idList;
    }
    else
      return null;
  };

  beforeUpload = file => {
    const isLt20M = file.size / 1024 / 1024 < 20;
    if (!isLt20M) {
      message.error('文件必须小于20MB!');
    }
    return isLt20M;
  };

  renderSimpleForm() {
    const {getFieldDecorator} = this.props.form;
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

  remove = record => {
    const {dispatch} = this.props;
    dispatch({
      type: 'teiltest/remove',
      payload: {
        id: `${record.id}`,
      },
    }).then(() => {
      dispatch({
        type: 'teiltest/fetch',
      });
      message.success('删除成功');
    });
  };

  render() {
    const {teiltest: {data}, loading} = this.props;
    const {modalVisible, teilList, isEdit, editRecord} = this.state;

    const columns = [
      {
        title: 'Teil Nr.',
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
        title: 'Benennung',
        dataIndex: 'teil.name',
        fixed: 'left',
        render: (row, item) => <Link to={`/teil/teil-profile/${item.teil.id}`}>{item.teil.name}</Link>,
      },
      {
        title: 'FOP',
        dataIndex: 'teil.fop.name',
        fixed: 'left',
      },
      {
        title: '尺寸计划送样时间',
        dataIndex: 'sizeSollTime',
        render: val => <span>{val ? moment(val).format('YYYY-MM-DD') : ''}</span>,
      },
      {
        title: '尺寸实际送样时间',
        dataIndex: 'sizeIstTime',
        render: val => <span>{val ? moment(val).format('YYYY-MM-DD') : ''}</span>,
      },
      {
        title: '尺寸实验实际完成时间',
        dataIndex: 'sizeTestIstTime',
        render: val => <span>{val ? moment(val).format('YYYY-MM-DD') : ''}</span>,
      },
      {
        title: '尺寸实验报告',
        dataIndex: 'sizeTestReport',
        render: (val, row, index) => {
          const list = row.sizeTestReport;
          let result = [];
          if (list && list.length > 0) {
            for (let i = 0; i < list.length; i++) {
              const url = `${UrlHead}${list[i].id}`;
              result.push(<a href={url}>{list[i].name}</a>);
              if (i !== list.length - 1) {
                result.push(<Divider type="vertical"/>);
              }
            }
          }
          return result;
        },
      },
      {
        title: '材料计划送样时间',
        dataIndex: 'materialSollTime',
        render: val => <span>{val ? moment(val).format('YYYY-MM-DD') : ''}</span>,
      },
      {
        title: '材料实际送样时间',
        dataIndex: 'materialIstTime',
        render: val => <span>{val ? moment(val).format('YYYY-MM-DD') : ''}</span>,
      },
      {
        title: '材料实验实际完成时间',
        dataIndex: 'materialTestIstTime',
        render: val => <span>{val ? moment(val).format('YYYY-MM-DD') : ''}</span>,
      },
      {
        title: '材料实验报告',
        dataIndex: 'materialTestReport',
        render: (val, row, index) => {
          const list = row.materialTestReport;
          let result = [];
          if (list && list.length > 0) {
            for (let i = 0; i < list.length; i++) {
              const url = `${UrlHead}${list[i].id}`;
              result.push(<a href={url}>{list[i].name}</a>);
              if (i !== list.length - 1) {
                result.push(<Divider type="vertical"/>);
              }
            }
          }
          return result;
        },
      },
      {
        title: '供应商自检实验完成时间',
        dataIndex: 'supplierTestIstTime',
        render: val => <span>{val ? moment(val).format('YYYY-MM-DD') : ''}</span>,
      },
      {
        title: '供应商自检实验报告',
        dataIndex: 'supplierTestReport',
        render: (val, row, index) => {
          const list = row.supplierTestReport;
          let result = [];
          if (list && list.length > 0) {
            for (let i = 0; i < list.length; i++) {
              const url = `${UrlHead}${list[i].id}`;
              result.push(<a href={url}>{list[i].name}</a>);
              if (i !== list.length - 1) {
                result.push(<Divider type="vertical"/>);
              }
            }
          }
          return result;
        },
      },
      {
        title: '零件寄WOB做性能时间',
        dataIndex: 'sendWobTime',
        render: val => <span>{val ? moment(val).format('YYYY-MM-DD') : ''}</span>,
      },
      {
        title: 'WOB实验完成时间',
        dataIndex: 'wobTestCompleteTime',
        render: val => <span>{val ? moment(val).format('YYYY-MM-DD') : ''}</span>,
      },
      {
        title: 'WOB实验报告',
        dataIndex: 'wobTestReport',
        render: (val, row, index) => {
          const list = row.wobTestReport;
          let result = [];
          if (list && list.length > 0) {
            for (let i = 0; i < list.length; i++) {
              const url = `${UrlHead}${list[i].id}`;
              result.push(<a href={url}>{list[i].name}</a>);
              if (i !== list.length - 1) {
                result.push(<Divider type="vertical"/>);
              }
            }
          }
          return result;
        },
      },
      {
        title: '耐久实验搭载车辆信息',
        dataIndex: 'endureTestCarInfo',
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
            <Divider type="vertical"/>
            <Popconfirm
              title="删除该零件试验信息？"
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
      beforeUpload: this.beforeUpload,
    };

    return (
      <PageHeaderLayout title="试验信息">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                添加试验信息
              </Button>
            </div>
            <MyTable
              rowKey={record => record.id}
              loading={loading}
              data={data}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              scroll={{x: 3000}}
            />
          </div>
        </Card>

        <CreateForm {...parentMethods} {...parentFields} modalVisible={modalVisible}/>
      </PageHeaderLayout>
    );
  }
}
