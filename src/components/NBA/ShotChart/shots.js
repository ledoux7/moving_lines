/* eslint-disable no-param-reassign */
/* eslint-disable func-names */
/* eslint-disable no-underscore-dangle */
import * as d3 from 'd3';
import { hexbin } from 'd3-hexbin';
// eslint-disable-next-line camelcase
import d3_tip from 'd3-tip';

window.d3_hexbin = { hexbin }; // workaround library problem
// import d3_hexbin from 'd3-hexbin';
// import {hexbin as d3_hexbin} from 'd3-hexbin'

let activeDisplay = 'scatter';
// let activeTheme = 'day';
let activeTheme = 'night';

// SCALES USED TO INVERT COURT Y COORDS AND MAP SHOOTING PERCENTAGES OF BINS TO A FILL COLOR
const yScale = d3.scaleLinear().domain([0, 47]).rangeRound([47, 0]);
const percentFormatter = d3.format('.2%');
const decFormatter = d3.format('.3n');

const tranTime = 100;

function createShots() {
  const hexRadiusValues = [0.8, 1.0, 1.2];
  let hexMinShotThreshold = 1;
  const heatScale = d3.scaleQuantize().domain([0.3, 1.5]).range(['#5458A2', '#6689BB', '#FADC97', '#F08460', '#B02B48']);
  const hexRadiusScale = d3.scaleQuantize().domain([0, 2]).range(hexRadiusValues);
  let toolTips = false;

  const hexbin1 = hexbin()
    .radius(1.2)
    .x(d => d.key[0]) // accessing the x, y coords from the nested json key
    .y(d => yScale(d.key[1]));

  const _nestShotsByLocation = function (data) {
    const nestedData = d3.nest()
      .key(d => [d.x, d.y])
      .rollup(v => ({
        'made': d3.sum(v, d => d.FGM),
        'points': d3.sum(v, d => d.SHOT_PTS),

        'attempts': v.length,
        'pps': d3.sum(v, d => d.SHOT_PTS) / v.length,
        'shootingPercentage': d3.sum(v, d => d.FGM) / v.length,

      }))
      .entries(data);
    // change to use a string split and force cast to int
    nestedData.forEach(a => {
      a.key = JSON.parse('[' + a.key + ']');
    });

    return nestedData;
  };

  const _getHexBinShootingStats = function (data, index) {
    const attempts = d3.sum(data, d => d.value.attempts);
    const makes = d3.sum(data, d => d.value.made);
    const points = d3.sum(data, d => d.value.points);

    const shootingPercentage = makes / attempts;

    const pps = points / attempts;
    data.shootingPercentage = shootingPercentage;
    data.pps = pps;

    data.attempts = attempts;
    data.makes = makes;
    return data;

    // ???
    // return {
    //   ...data,
    //   shootingPercentage,
    //   pps,
    //   makes,
    //   attempts,

    // };
  };

  function shotsFunc(selection) {
    selection.each(function (data) {
      const shotsGroup = d3.select(this).select('svg').select('.shots');
      const legends = d3.select(this).select('#legends');
      const nestedData = _nestShotsByLocation(data);
      const hexBinCoords = hexbin1(nestedData).map(_getHexBinShootingStats);

      let shots;
      let toolTip;

      if (activeDisplay === 'scatter') {
        if (legends.empty() === false) {
          legends.remove();
        }

        shots = shotsGroup.selectAll('.shot')
          .data(data, d => [d.x, d.y]);
        shots.exit()
          .transition().duration(tranTime)
          .attr('r', 0)
          .attr('d', hexbin1.hexagon(0))
          .remove();

        if (toolTips) {
          toolTip = d3_tip()
            .attr('class', 'd3-tip')
            .offset([-8, 0])
            .html(d => d.PLAYER_NAME + '<br><br/>' + d.SHOT_DIST + "' " + d.SHOT_TYPE);

          shotsGroup.call(toolTip);
        }

        shots.enter()
          .append('circle')
          .classed('shot', true)
          .classed('make', d => d.FGM === 1) // used to set fill color to green if it's a made shot
          .classed('miss', d => d.FGM === 0) // used to set fill color to red if it's a miss
          .attr('cx', d => d.x)
          .attr('cy', d => yScale(d.y))
          .attr('r', 0)
          .on('mouseover', function (d) { if (toolTips) { toolTip.show(d, this); } })
          .on('mouseout', function (d) { if (toolTips) { toolTip.hide(d, this); } })
          .transition()
          .duration(tranTime)
          .attr('r', 0.5);
      }
      else if (activeDisplay === 'hexbin') {
        shots = shotsGroup.selectAll('.shot')
          .data(hexBinCoords, d => [d.x, d.y]);

        shots.exit()
          .transition().duration(tranTime)
          .attr('r', 0)
          .attr('d', hexbin1.hexagon(0))
          .remove();

        if (toolTips) {
          toolTip = d3_tip()
            .attr('class', 'd3-tip')
            .offset([-8, 0])
            .html(
              // return d.makes + " / " + d.attempts + " ("+ d.shootingPercentage + ")";
              // eslint-disable-next-line no-useless-concat
              d => d.makes + ' / ' + d.attempts + ' (' + percentFormatter(d.shootingPercentage) + ')' + '<br><br/>PPS: ' + decFormatter(d.pps),
            );

          shotsGroup.call(toolTip);
        }

        shots.enter()
          .append('path')
          .classed('shot', true)
          .attr('transform', d => 'translate(' + d.x + ',' + d.y + ')')
          .attr('d', hexbin1.hexagon(0))
          .on('mouseover', function (d) { if (toolTips) { toolTip.show(d, this); } })
          .on('mouseout', function (d) { if (toolTips) { toolTip.hide(d, this); } })
          .transition()
          .duration(tranTime)
          .attr('d', d => {
            if (d.length >= hexMinShotThreshold) {
              if (d.length <= 4) {
                return hexbin1.hexagon(hexRadiusScale(0));
              }
              else if (d.length > 4 && d.length <= 10) {
                return hexbin1.hexagon(hexRadiusScale(1));
              }
              else {
                return hexbin1.hexagon(hexRadiusScale(2));
              }
            }
            return undefined;
          })
          .style('fill', d => heatScale(d.pps));

        // CHANGE TO USE SELECTION.EMPTY()
        if (legends.empty() === true) {
          const legendSVG = d3.select(this).append('svg').attr('viewBox', '0, 0, ' + 50 + ', ' + 10 + '').attr('id', 'legends');
          const efficiencyLegend = legendSVG.append('g').classed('legend', true);
          const frequencyLegend = legendSVG.append('g').classed('legend', true)
            .classed('frequency', true);
          let frequencyLegendXStart = 7;

          efficiencyLegend.append('text')
            .classed('legend-text', true)
            .attr('x', 40)
            .attr('y', 5)
            .attr('text-anchor', 'middle')
            .text('Efficiency (PPS)');
          efficiencyLegend.append('text')
            .classed('legend-text', true)
            .attr('x', 34.25)
            .attr('y', 2.5)
            .attr('text-anchor', 'end')
            .style('fill', 'white')
            .text('cold');
          efficiencyLegend.append('text')
            .classed('legend-text', true)
            .attr('x', 45.75)
            .attr('y', 2.5)
            .attr('text-anchor', 'start')
            .text('hot');
          efficiencyLegend.selectAll('path').data(heatScale.range())
            .enter()
            .append('path')
            .attr('transform', (d, i) => 'translate('
                                        + (35 + ((1 + i * 2) * 1)) + ', ' + 2 + ')')
            .attr('d', hexbin1.hexagon(0))
            .transition()
            .duration(tranTime)
            .attr('d', hexbin1.hexagon(1))
            .style('fill', d => d);
          efficiencyLegend.selectAll('text')
            .style('fill', () => {
              if (activeTheme === 'night') { return 'white'; }
              else if (activeTheme === 'day') { return 'black'; }
              return 'white';
            })
            .style('font-size', '2px');

          frequencyLegend.append('text')
            .classed('legend-text', true)
            .attr('x', 10.25)
            .attr('y', 5)
            .attr('text-anchor', 'middle')
            .text('Frequency');
          frequencyLegend.append('text')
            .classed('legend-text', true)
            .attr('x', 6.25)
            .attr('y', 2.5)
            .attr('text-anchor', 'end')
            .text('low');
          frequencyLegend.selectAll('path').data(hexRadiusValues)
            .enter()
            .append('path')
            .attr('transform', (d, i) => {
              frequencyLegendXStart += d * 2;
              return 'translate(' + (frequencyLegendXStart - d) + ', ' + 2 + ')';
            })
            .attr('d', hexbin1.hexagon(0))
            .transition()
            .duration(tranTime)
            .attr('d', d => hexbin1.hexagon(d));
          frequencyLegend.append('text')
            .classed('legend-text', true)
            .attr('x', 13.75)
            .attr('y', 2.5)
            .attr('text-anchor', 'start')
            .text('high');

          frequencyLegend.selectAll('text').style('fill', () => {
            if (activeTheme === 'night') { return 'white'; }
            else if (activeTheme === 'day') { return 'black'; }
            return 'white';
          })
            .style('font-size', '2px');
          frequencyLegend.selectAll('path').style('fill', () => {
            if (activeTheme === 'night') { return 'none'; }
            else if (activeTheme === 'day') { return 'grey'; }

            return 'none';
          });
        }
      }
    });
  }

  shotsFunc.displayType = function (_) {
    if (!arguments.length) return activeDisplay;
    activeDisplay = _;
    return shotsFunc;
  };

  shotsFunc.shotRenderThreshold = function (_) {
    if (!arguments.length) return hexMinShotThreshold;
    hexMinShotThreshold = _;
    return shotsFunc;
  };

  shotsFunc.displayToolTips = function (_) {
    if (!arguments.length) return toolTips;
    toolTips = _;
    return shotsFunc;
  };

  shotsFunc.theme = function (_) {
    if (!arguments.length) return activeTheme;
    activeTheme = _;
    return shotsFunc;
  };

  return shotsFunc;
}

export default createShots;
