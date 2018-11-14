import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Badge, Table, Divider } from 'antd';
import DescriptionList from 'components/DescriptionList';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './TeilProfile.less';
import moment from 'moment';
import { momentTime, momentDate } from '../../utils/utils';
import { Link } from 'react-router-dom';

const { Description } = DescriptionList;
const UrlHead = 'http://104.207.153.132:18080/myapi/download/';
const bezugsart = ['CKD', 'LC'];
const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['询价阶段', 'BMG认可中', 'BMG完成', '异常'];

@connect(({ modell }) => ({
  modell,
}))
export default class ModellProfile extends Component {
  componentDidMount() {
    const { dispatch, match } = this.props;
    const id = parseInt(match.params.id, 10);
    dispatch({
      type: 'modell/getById',
      payload: {
        id,
      },
    });
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, match } = this.props;
    const id = parseInt(nextProps.match.params.id, 10);
    if (nextProps.match.params.id && match.params.id !== nextProps.match.params.id) {
      dispatch({
        type: 'modell/getById',
        payload: {
          id,
        },
      });
    }
  }

  render() {
    const { modell: { profile } } = this.props;

    const teilColumns = [
      {
        title: 'Teil Nr.',
        dataIndex: 'number',
        sorter: true,
      },
      {
        title: 'Benennung',
        dataIndex: 'name',
        sorter: true,
        render: (row, item) => <Link to={`/teil/teil-profile/${item.id}`}>{item.name}</Link>,
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
          return <Badge status={statusMap[val]} text={status[val]} />;
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

    if (!profile || JSON.stringify(profile) === '{}') {
      return null;
    } else {
      //动力总成类型
      let aggregatesResult = '';
      if (profile.modell.aggregates && profile.modell.aggregates.length > 0) {
        for (let i = 0; i < profile.modell.aggregates.length; i++) {
          aggregatesResult += profile.modell.aggregates[i].name + ', ';
        }
        aggregatesResult = aggregatesResult.substr(0, aggregatesResult.length - 2);
      }

      //跑车计划，文件
      let runPlan = [];
      if (profile.modell.runPlan && profile.modell.runPlan.length > 0) {
        const list = profile.modell.runPlan;
        for (let i = 0; i < list.length; i++) {
          const url = `${UrlHead}${list[i].id}`;
          runPlan.push(<a href={url}>{list[i].name}</a>);
          if (i !== list.length - 1) {
            runPlan.push(<Divider type="vertical" />);
          }
        }
      }

      return (
        <PageHeaderLayout title="车型详情">
          <Card bordered={false}>
            <DescriptionList size="large" title="基础信息" style={{ marginBottom: 32 }}>
              <Description term="车型名称">{profile.modell.name}</Description>
              <Description term="所属平台">{profile.modell.platform.name}</Description>
              <Description term="动力总成类型">{aggregatesResult}</Description>
              <Description term="VFF时间">{momentDate(profile.modell.vffTime)}</Description>
              <Description term="PVS时间">{momentDate(profile.modell.pvsTime)}</Description>
              <Description term="0S TBT时间">{momentDate(profile.modell.osTbtTime)}</Description>
              <Description term="0S时间">{momentDate(profile.modell.osTime)}</Description>
              <Description term="SOP TBT时间">{momentDate(profile.modell.sopTbtTime)}</Description>
              <Description term="SOP时间">{momentDate(profile.modell.sopTime)}</Description>
              <Description term="跑车数量（SWP/SVP/SPH/4KZ）">
                {profile.modell.runCount}
              </Description>
              <Description term="跑车计划">{runPlan}</Description>
              <Description term="描述">{profile.modell.description}</Description>
              <Description term="录入人员">
                {profile.modell.inUser ? profile.modell.inUser.name : null}
              </Description>
              <Description term="录入时间">
                {moment(profile.modell.inTime).format('YYYY-MM-DD HH:mm:ss')}
              </Description>
              <Description term="更新时间">
                {moment(profile.modell.updateTime).format('YYYY-MM-DD HH:mm:ss')}
              </Description>
            </DescriptionList>
            <Divider style={{ marginBottom: 32 }} />
            <DescriptionList size="large" title="车型零件信息" style={{ marginBottom: 32 }}>
              <Table
                columns={teilColumns}
                dataSource={profile.teils}
                pagination={false}
                rowKey={item => item.id}
                scroll={{ x: 2000 }}
              />
            </DescriptionList>
          </Card>
        </PageHeaderLayout>
      );
    }
  }
}
