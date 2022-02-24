/* eslint-disable react/require-default-props */
/* eslint-disable react/static-property-placement */
/* eslint-disable react/sort-comp */
import React from 'react';
import * as d3 from 'd3';
import { hexbin } from 'd3-hexbin';
import PropTypes from 'prop-types';
import court from './court';
import shots from './shots';

// import sc from '../../../css/ShotChart.css';
import sc from '../../../css/ShotChartLight.css';

window.d3_hexbin = { hexbin }; // workaround library problem

class ShotChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      charttype: '',
      total: 0,
    };
  }

  static propTypes = {
    minCount: PropTypes.number,
    chartType: PropTypes.string,
    displayToolTips: PropTypes.bool,
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.charttype !== nextProps.chartType) {
      this.setState({
        charttype: nextProps.chartType,
      });

      return true;
    }
    else if (nextProps.data.length !== this.state.total) {
      return true;
    }
    else {
      return false;
    }
  }

  componentDidUpdate() {
    const shotlog = this.props.data;
    const { namee } = this.props;

    const courtSelection = d3.select('#shot-chart' + namee);
    // without this line, all updates on court would be ineffect only after changing chartType
    courtSelection.html('');
    const chartCourt = court().width(this.props.width);
    const chartShots = shots(this.props.callback)
      .shotRenderThreshold(this.props.minCount)
      .displayToolTips(this.props.displayToolTips)
      .displayType(this.props.chartType);
    // selection.call always return the selection and not the return value of function passed in
    courtSelection.call(chartCourt);
    courtSelection.datum(shotlog).call(chartShots);

    if (this.state.total !== shotlog.length) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        total: shotlog.length,
        charttype: this.props.chartType,
      });
    }
  }

  render() {
    return <div id={'shot-chart' + this.props.namee} className='sc' />;
  }
}
export default ShotChart;
