import React from 'react';
import { Chart, Tooltip, Geom, Legend, Axis } from 'bizcharts';
import DataSet from '@antv/data-set';
import Slider from 'bizcharts-plugin-slider';
import autoHeight from '../autoHeight';
import styles from './index.less';

@autoHeight()
export default class MyTimelineChart extends React.Component {
  render() {
    const {
      title,
      height = 400,
      padding = [60, 20, 40, 40],
      titleMap = {
        y1: 'y1',
        y2: 'y2',
        y3: 'y3',
        y4: 'y4',
        y5: 'y5',
      },
      borderWidth = 2,
      data = [
        {
          x: 0,
          y1: 0,
          y2: 0,
          y3: 0,
          y4: 0,
          y5: 0,
        },
      ],
    } = this.props;

    // 创建 dataset 指定状态量
    const ds = new DataSet();

    // 创建 DataView
    const dv = ds.createView();
    dv
      .source(data)
      .transform({
        type: 'map',
        callback(row) {
          const newRow = { ...row };
          newRow[titleMap.y1] = row.y1;
          newRow[titleMap.y2] = row.y2;
          newRow[titleMap.y3] = row.y3;
          newRow[titleMap.y4] = row.y4;
          newRow[titleMap.y5] = row.y5;
          return newRow;
        },
      })
      .transform({
        type: 'fold',
        fields: [titleMap.y1, titleMap.y2, titleMap.y3, titleMap.y4, titleMap.y5], // 展开字段集
        key: 'key', // key字段
        value: 'value', // value字段
      });

    const timeScale = {
      x: {
        range: [0, 1],
      },
    };

    const cols = {
      x: {
        range: [0, 1],
      },
      // value: {
      //   max,
      //   min: 0,
      // },
    };

    const SliderGen = () => (
      <Slider
        padding={[0, padding[1] + 20, 0, padding[3]]}
        width="auto"
        height={26}
        xAxis="x"
        yAxis="y1"
        scales={{ x: timeScale }}
        data={data}
        start={ds.state.start}
        end={ds.state.end}
        backgroundChart={{ type: 'line' }}
        onChange={({ startValue, endValue }) => {
          ds.setState('start', startValue);
          ds.setState('end', endValue);
        }}
      />
    );

    return (
      <div className={styles.timelineChart} style={{ height: height + 30 }}>
        <div>
          {title && <h4>{title}</h4>}
          <Chart height={height} padding={padding} data={dv} scale={cols} forceFit>
            <Axis name="x" />
            <Axis name="value" />
            <Tooltip />
            <Legend name="key" position="top" />
            <Geom type="line" position="x*value" size={borderWidth} color="key" />
            <Geom
              type="point"
              position="x*value"
              size={borderWidth * 2}
              shape="circle"
              color="key"
            />
          </Chart>
          <div style={{ marginRight: -20 }}>
            <SliderGen />
          </div>
        </div>
      </div>
    );
  }
}
