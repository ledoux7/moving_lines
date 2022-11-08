import React from 'react';

import {
  PieChart, Pie, Label, Cell,
} from 'recharts';

const testData = [
  { name: 'Bubble Tea Sold', value: 10 },
  { name: 'Bubble Tea Left', value: 4 },
];

const nth = d => {
  if (d > 3 && d < 21) return d + 'th';
  switch (d % 10) {
    case 1: return d + 'st';
    case 2: return d + 'nd';
    case 3: return d + 'rd';
    default: return d + 'th';
  }
};

const CustomLabel = ({
  viewBox, rank = 0, label = 'Label', value = 0,
}) => {
  const { cx, cy } = viewBox;
  return (
    <>
      {/* <text x={cx - 30} y={cy - 35}>
        <tspan
          style={{
            fontSize: '2em',
            fill: '#FFF',
            fontFamily: 'Roboto',
          }}
        >
          {label}
        </tspan>
      </text> */}
      <text x={cx - 40} y={cy + 0}>
        <tspan
          style={{
            fontWeight: 700,
            fontSize: '2.5em',
            fill: '#ef6c00',
            fontFamily: 'Roboto',
          }}
        >
          {value}
        </tspan>
      </text>

      <text x={cx - 40} y={cy + 45}>
        <tspan
          style={{
            fontWeight: 500,
            fontSize: '2.5em',
            fill: '#FFF',
            fontFamily: 'Roboto',
          }}
        >
          {nth(rank)}
        </tspan>
      </text>
    </>
  );
};

const TwoLineLabelPieChart = ({ data }) => {
  console.log('chart', data);
  return (
    <div>
      <PieChart width={800} height={300}>
        {/* <Pie
          data={data}
          cx='50%'
          cy='50%'
          dataKey='value'
          innerRadius={80}
          outerRadius={110}
        /> */}
        <Pie
          data={data}
          cx='50%'
          cy='50%'
          dataKey='value'
          innerRadius={100}
          outerRadius={140}
          startAngle={90}
          endAngle={90 + 360}
          isAnimationActive={false}

        >
          {testData.map((entry, index) => {
            if (index === 1) {
              return <Cell key={`cell-${index}`} fill='#f3f6f9' />;
            }
            return <Cell key={`cell-${index}`} fill='#ef6c00' />;
          })}
          <Label
            content={<CustomLabel value={data[0].raw} label={data[0].name} rank={data[0].rank} />}
            position='center'
          />
        </Pie>
      </PieChart>
    </div>
  );
};

export default TwoLineLabelPieChart;
