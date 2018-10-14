import React, {Component} from 'react';
import {connect} from 'dva';
import {Card, Badge, Table, Divider} from 'antd';
import DescriptionList from 'components/DescriptionList';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './TeilProfile.less';
import moment from "moment";
import {momentTime, momentDate} from '../../utils/utils';

const {Description} = DescriptionList;
const bezugsart = ['CKD', 'LC'];
const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['询价阶段', 'BMG认可中', 'BMG完成', '异常'];
const UrlHead = 'http://localhost:18080/download/';

@connect(({teil}) => ({
  teil,
}))
export default class TeilProfile extends Component {
  componentDidMount() {
    const {dispatch, match} = this.props;
    const id = parseInt(match.params.id, 10);
    dispatch({
      type: 'teil/getById',
      payload: {
        id,
      },
    });
  }

  componentWillReceiveProps(nextProps) {
    const {dispatch, match} = this.props;
    const id = parseInt(nextProps.match.params.id, 10);
    if (nextProps.match.params.id && match.params.id !== nextProps.match.params.id) {
      dispatch({
        type: 'teil/getById',
        payload: {
          id,
        },
      });
    }
  }

  render() {
    const {teil: {profile}} = this.props;

    if (!profile || JSON.stringify(profile) === '{}') {
      return null;
    } else {
      let modellsResult = '';
      if (profile.teil.modells && profile.teil.modells.length > 0) {
        for (let i = 0; i < profile.teil.modells.length; i++) {
          modellsResult += profile.teil.modells[i].name + ', ';
        }
        modellsResult = modellsResult.substr(0, modellsResult.length - 2);
      }

      let aggregatesResult = '';
      if (profile.teil.aggregates && profile.teil.aggregates.length > 0) {
        for (let i = 0; i < profile.teil.aggregates.length; i++) {
          aggregatesResult += profile.teil.aggregates[i].name + ', ';
        }
        aggregatesResult = aggregatesResult.substr(0, aggregatesResult.length - 2);
      }

      let sizeTestReport = [];
      if (profile.teilTest.sizeTestReport && profile.teilTest.sizeTestReport.length > 0) {
        const list = profile.teilTest.sizeTestReport;
        for (let i = 0; i < list.length; i++) {
          const url = `${UrlHead}${list[i].id}`;
          sizeTestReport.push(<a href={url}>{list[i].name}</a>);
          if (i !== list.length - 1) {
            sizeTestReport.push(<Divider type="vertical"/>);
          }
        }
      }

      let materialTestReport = [];
      if (profile.teilTest.materialTestReport && profile.teilTest.materialTestReport.length > 0) {
        const list = profile.teilTest.materialTestReport;
        for (let i = 0; i < list.length; i++) {
          const url = `${UrlHead}${list[i].id}`;
          materialTestReport.push(<a href={url}>{list[i].name}</a>);
          if (i !== list.length - 1) {
            materialTestReport.push(<Divider type="vertical"/>);
          }
        }
      }

      let supplierTestReport = [];
      if (profile.teilTest.supplierTestReport && profile.teilTest.supplierTestReport.length > 0) {
        const list = profile.teilTest.supplierTestReport;
        for (let i = 0; i < list.length; i++) {
          const url = `${UrlHead}${list[i].id}`;
          supplierTestReport.push(<a href={url}>{list[i].name}</a>);
          if (i !== list.length - 1) {
            supplierTestReport.push(<Divider type="vertical"/>);
          }
        }
      }

      let wobTestReport = [];
      if (profile.teilTest.wobTestReport && profile.teilTest.wobTestReport.length > 0) {
        const list = profile.teilTest.wobTestReport;
        for (let i = 0; i < list.length; i++) {
          const url = `${UrlHead}${list[i].id}`;
          wobTestReport.push(<a href={url}>{list[i].name}</a>);
          if (i !== list.length - 1) {
            wobTestReport.push(<Divider type="vertical"/>);
          }
        }
      }

      return (
        <PageHeaderLayout title="零部件详情">
          <Card bordered={false}>
            <DescriptionList size="large" title="基础信息" style={{marginBottom: 32}}>
              <Description term="Teil Nr.">{profile.teil.number}</Description>
              <Description term="Benennung">{profile.teil.name}</Description>
              <Description term="状态"><Badge status={statusMap[profile.teil.status]}
                                            text={status[profile.teil.status]}/></Description>
              <Description term="Lieferant">{profile.teil.lieferant}</Description>
              <Description term="Bezugsart">{bezugsart[profile.teil.bezugsart]}</Description>
              <Description
                term="Abgasstufe">{profile.teil.abgasstufe ? profile.teil.abgasstufe.name : null}</Description>
              <Description
                term="Ersteinsatz Modell">{profile.teil.erstModell ? profile.teil.erstModell.name : null}</Description>
              <Description
                term="Ersteinsatz Aggregate">{profile.teil.erstAggregate ? profile.teil.erstAggregate.name : null}</Description>
              <Description term="Fzg. Modell">{modellsResult}</Description>
              <Description term="Fzg. Aggregate">{aggregatesResult}</Description>
              <Description term="FOP/MOP">{profile.teil.fop ? profile.teil.fop.name : null}</Description>
              <Description term="录入时间">{moment(profile.teil.inTime).format('YYYY-MM-DD HH:mm:ss')}</Description>
              <Description term="更新时间">{moment(profile.teil.updateTime).format('YYYY-MM-DD HH:mm:ss')}</Description>
            </DescriptionList>
            <Divider style={{marginBottom: 32}}/>
            <DescriptionList size="large" title="研发信息" style={{marginBottom: 32}}>
              <Description
                term="询价资料时间">{momentDate(profile.teilSchedule.anfragedatenTime)}</Description>
              <Description term="采购定点计划时间">{momentDate(profile.teilSchedule.cscSollTime)}</Description>
              <Description term="采购定点实际时间">{momentDate(profile.teilSchedule.cscIstTime)}</Description>
              <Description
                term="项目启动会计划时间">{momentDate(profile.teilSchedule.kickoffSollTime)}</Description>
              <Description
                term="项目启动会实际时间">{momentDate(profile.teilSchedule.kickoffIstTime)}</Description>
              <Description
                term="PAB编辑发送时间">{momentDate(profile.teilSchedule.pabEditSendTime)}</Description>
              <Description
                term="PAB系统流转完成时间">{momentDate(profile.teilSchedule.pabFlowFinishTime)}</Description>
              <Description
                term="PAB费用反馈的时间">{momentDate(profile.teilSchedule.pabCostFeedbackTime)}</Description>
              <Description term="B-F计划时间">{momentDate(profile.teilSchedule.bfSollTime)}</Description>
              <Description term="B-F实际时间">{momentDate(profile.teilSchedule.bfIstTime)}</Description>
              <Description
                term="首模件实际时间">{momentDate(profile.teilSchedule.firstTryoutIstTime)}</Description>
              <Description term="批量件计划时间">{momentDate(profile.teilSchedule.otsSollTime)}</Description>
              <Description term="批量件实际时间">{momentDate(profile.teilSchedule.otsIstTime)}</Description>
              <Description term="Aeko/AeA发生编号">{profile.teilSchedule.einsatzNum}</Description>
              <Description term="Aeko/AeA取消编号">{profile.teilSchedule.entfallNum}</Description>
              <Description term="BMG计划时间">{momentDate(profile.teilSchedule.bmgSollTime)}</Description>
              <Description term="BMG实际时间">{momentDate(profile.teilSchedule.bmgIstTime)}</Description>
              <Description
                term="BMG-EMP计划时间">{momentDate(profile.teilSchedule.bmgEmpSollTime)}</Description>
              <Description
                term="BMG-EMP实际时间">{momentDate(profile.teilSchedule.bmgEmpIstTime)}</Description>
              <Description term="BMG-ONLINE编号">{profile.teilSchedule.bmgOnlineNum}</Description>
              <Description
                term="FE54计划时间">{momentDate(profile.teilSchedule.fe54SollTime)}</Description>
              <Description term="FE54实际时间">{momentDate(profile.teilSchedule.fe54IstTime)}</Description>
              <Description term="备注">{profile.teilSchedule.remark}</Description>
              <Description term="是否沿用">{profile.teilSchedule.ifCop ? '是' : '否'}</Description>
              <Description term="录入时间">{momentTime(profile.teilSchedule.inTime)}</Description>
              <Description term="更新时间">{momentTime(profile.teilSchedule.updateTime)}</Description>
            </DescriptionList>
            <Divider style={{marginBottom: 32}}/>
            <DescriptionList size="large" title="试验信息" style={{marginBottom: 32}}>
              <Description
                term="尺寸计划送样时间">{momentDate(profile.teilTest.sizeSollTime)}</Description>
              <Description term="尺寸实际送样时间">{momentDate(profile.teilTest.sizeIstTime)}</Description>
              <Description term="尺寸实验实际完成时间">{momentDate(profile.teilTest.sizeTestIstTime)}</Description>
              <Description term="尺寸实验报告">{sizeTestReport}</Description>
              <Description
                term="材料计划送样时间">{momentDate(profile.teilTest.materialSollTime)}</Description>
              <Description
                term="材料实际送样时间">{momentDate(profile.teilTest.materialIstTime)}</Description>
              <Description
                term="材料实验实际完成时间">{momentDate(profile.teilTest.materialTestIstTime)}</Description>
              <Description term="材料实验报告">{materialTestReport}</Description>
              <Description term="供应商自检实验完成时间">{momentDate(profile.teilTest.supplierTestIstTime)}</Description>
              <Description term="供应商自检实验报告">{supplierTestReport}</Description>
              <Description
                term="零件寄WOB做性能时间">{momentDate(profile.teilTest.sendWobTime)}</Description>
              <Description term="WOB实验完成时间">{momentDate(profile.teilTest.wobTestCompleteTime)}</Description>
              <Description term="WOB实验报告">{wobTestReport}</Description>
              <Description term="跑车耐久实验搭载车辆信息">{profile.teilTest.endureTestCarInfo}</Description>
              <Description term="备注">{profile.teilTest.remark}</Description>
              <Description term="是否沿用">{profile.teilTest.ifCop ? '是' : '否'}</Description>
              <Description term="录入时间">{momentTime(profile.teilTest.inTime)}</Description>
              <Description term="更新时间">{momentTime(profile.teilTest.updateTime)}</Description>
            </DescriptionList>
          </Card>
        </PageHeaderLayout>
      );
    }


  }
}
