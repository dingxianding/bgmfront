import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva/index';
import { Link } from 'dva/router';
import { Card, List, Table, Divider, Popconfirm, message } from 'antd';
import DescriptionList from 'components/DescriptionList';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './TeilProfile.less';
import MyTable from 'components/MyTable';

const { Description } = DescriptionList;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ teil, loading }) => ({
  teil,
  loading: loading.models.teil,
}))
export default class TeilProfile extends PureComponent {
  componentDidMount() {
    const { dispatch, match } = this.props;
    const id = parseInt(match.params.id, 10);

    //TODO 角色判断
    //const currentPageRole = stringRole(userInfo.role);
    const currentPageRole = 'admin';

    dispatch({
      type: 'teil/getOne',
      payload: {
        id,
      },
    });
    // 如果当前页面的角色为admin和master,获取子用户,user和guest没有子用户表
    // if (currentPageRole === 'admin' || currentPageRole === 'master') {
    //   dispatch({
    //     type: 'listUser/listUser',
    //     payload: {
    //       id,
    //     },
    //   });
    // }
    // 获取用户创建的群组（只能管理自己创建的群组）
    // dispatch({
    //   type: 'userInfo/listGroup',
    //   payload: {
    //     userId: id,
    //   },
    // });
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, match } = this.props;
    const id = parseInt(nextProps.match.params.id, 10);
    if (nextProps.match.params.id && match.params.id !== nextProps.match.params.id) {
      dispatch({
        type: 'teil/getOne',
        payload: {
          id,
        },
      });
      // 获取用户创建的群组（只能管理自己创建的群组）
      // dispatch({
      //   type: 'userInfo/listGroup',
      //   payload: {
      //     userId: id,
      //   },
      // });
    }
  }

  updateUser = ({ values }) => {
    const { dispatch, userInfo: { userInfo } } = this.props;
    const { id } = userInfo;

    dispatch({
      type: 'userInfo/updateUser',
      payload: {
        id,
        ...values,
      },
    }).then(() => {
      dispatch({
        type: 'userInfo/getUser',
        payload: {
          id,
        },
      });
    });
  };

  createUser = values => {
    const { dispatch, match } = this.props;
    const userId = parseInt(match.params.id, 10);
    const { name, password, email, mobile, remark } = values;

    dispatch({
      type: 'listUser/createUser',
      payload: {
        name,
        password: md5(password),
        email,
        mobile,
        remark,
        role: 3,
        user_id: userId,
      },
    }).then(() => {
      dispatch({
        type: 'listUser/listUser',
        payload: {
          id: userId,
        },
      });
    });
  };

  createGroup = values => {
    const { dispatch, userInfo: { userInfo } } = this.props;
    const { id } = userInfo.id;
    const { name, remark } = values;
    dispatch({
      type: 'listGroup/createGroup',
      payload: {
        name,
        remark,
        user_id: id,
      },
    }).then(() => {
      dispatch({
        type: 'userInfo/listUserGroup',
        payload: {
          id,
        },
      });
    });
  };

  handleUserTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch, match } = this.props;
    const userId = parseInt(match.params.id, 10);

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      id: userId,
      page: pagination.current,
      limit: pagination.pageSize,
      ...filters,
    };

    if (sorter.field) {
      params.sort = sorter.field;
      params.order = sorter.order === 'descend' ? 'desc' : 'asc';
    }

    dispatch({
      type: 'listUser/listUser',
      payload: params,
    });
  };

  handleGroupTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch, match } = this.props;
    const userId = parseInt(match.params.id, 10);

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      id: userId,
      page: pagination.current,
      limit: pagination.pageSize,
      ...filters,
    };

    if (sorter.field) {
      params.sort = sorter.field;
      params.order = sorter.order === 'descend' ? 'desc' : 'asc';
    }

    dispatch({
      type: 'userInfo/listGroup',
      payload: params,
    });
  };

  confirmGroupChange = () => {
    const { dispatch, userInfo: { userInfo, targetGroup } } = this.props;
    const { id } = userInfo;
    dispatch({
      type: 'userInfo/updateUserGroup',
      payload: {
        targetGroup,
        id,
      },
    }).then(() => {
      dispatch({
        type: 'userInfo/listUserGroup',
        payload: {
          id,
        },
      });
    });
  };

  removeUser = item => {
    const { dispatch, match } = this.props;
    const userId = parseInt(match.params.id, 10);
    dispatch({
      type: 'listUser/removeUser',
      payload: {
        id: `${item.id}`,
      },
    }).then(() => {
      dispatch({
        type: 'listUser/listUser',
        payload: {
          id: userId,
        },
      });
      message.success('删除成功');
    });
  };

  render() {
    const {
      teil: { userInfo, listGroup },
      listUser: { listUser },
      userInfoLoading,
      userListLoading,
    } = this.props;

    const currentPageRole = stringRole(userInfo.role);

    const breadcrumbList =
      getAuthority() === 'admin'
        ? [
            {
              title: '首页',
              href: '/',
            },
            {
              title: '用户管理',
              href: '/indexUser',
            },
            {
              title: '用户详情',
            },
          ]
        : [
            {
              title: '首页',
              href: '/',
            },
            {
              title: '用户管理',
              href: '/listUser',
            },
            {
              title: '用户详情',
            },
          ];

    const myGroupColums = [
      {
        title: '组名称',
        dataIndex: 'name',
      },
      {
        title: '备注',
        dataIndex: 'remark',
      },
      {
        title: '创建时间',
        sorter: true,
        dataIndex: 'created_at',
        render: val => <span>{momentTime(val)}</span>,
      },
      {
        title: '操作',
        dataIndex: 'createDate',
        render: (row, item) => (
          <Fragment>
            <Link to={`/groupInfo/${item.id}`}>管理</Link>
            <Divider type="vertical" />
            <a href="">授权</a>
            <Divider type="vertical" />
            <Popconfirm
              title="确认删除该群组吗？"
              okText="Yes"
              cancelText="No"
              onConfirm={() => this.removeGroup(item)}
            >
              <a>删除</a>
            </Popconfirm>
          </Fragment>
        ),
      },
    ];

    return (
      <div>
        <PageHeaderLayout title="用户详情" breadcrumbList={breadcrumbList} />
        <Card style={{ marginTop: 24 }}>
          <List
            header={<div>基本信息</div>}
            bordered
            className={styles.list}
            dataSource={[userInfo]}
            loading={userInfoLoading}
            renderItem={item => (
              <List.Item>
                <DescriptionList size="large" style={{ marginTop: 12 }}>
                  <Description term="用户名">{item.name}</Description>
                  <Description term="手机">{item.mobile}</Description>
                  <Description term="邮箱">{item.email}</Description>
                  <Description term="创建时间">{momentTime(item.created_at)}</Description>
                  <Description term="备注">{item.remark}</Description>
                </DescriptionList>
              </List.Item>
            )}
          />
          {currentPageRole === 'admin' || currentPageRole === 'master' ? (
            <List
              header={
                <div>
                  我创建的群组
                  <CreateGroup title="新建群组" onOk={values => this.createGroup(values)}>
                    <button type="button" className={styles.operate}>
                      新建群组
                    </button>
                  </CreateGroup>
                </div>
              }
              bordered
              className={styles.mySubuser}
              dataSource={[1]}
              loading={userListLoading}
              renderItem={() => (
                <List.Item>
                  <StandardTable
                    columns={myGroupColums}
                    data={listGroup}
                    rowKey={record => record.id}
                    loading={userListLoading}
                    onChange={this.handleGroupTableChange}
                  />
                </List.Item>
              )}
            />
          ) : (
            ''
          )}
        </Card>
      </div>
    );
  }
}
