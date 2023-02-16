const _ = require('lodash/core')
const d3 = require('d3')
const { toRadian, center } = require('../../util/mathUtils')
const { graphConfig, getGraphSize } = require('../config')

const ANIMATION_DURATION = 1000
let svg

function renderQuadrantTables(quadrants) {
  const radarElement = d3.select('#radar')
  svg = radarElement.select('svg')
  _.each([0, 1, 2, 3], function (i) {
    addButton(radarElement, quadrants[i])
  })
}

function addButton(radarElement, quadrant) {
  radarElement.append('div').attr('class', 'quadrant-table ' + quadrant.order)
}

function selectQuadrant(order, startAngle) {
  const size = getGraphSize()
  d3.selectAll('.home-link').classed('selected', false)
  createHomeLink(d3.select('header'))

  d3.selectAll('.button').classed('selected', false).classed('full-view', false)
  d3.selectAll('.button.' + order).classed('selected', true)
  d3.selectAll('.quadrant-table').classed('selected', false)
  d3.selectAll('.quadrant-table.' + order).classed('selected', true)
  d3.selectAll('.blip-item-description').classed('expanded', false)

  var scale = 2

  var adjustX = Math.sin(toRadian(startAngle)) - Math.cos(toRadian(startAngle))
  var adjustY = Math.cos(toRadian(startAngle)) + Math.sin(toRadian(startAngle))

  var translateXAll = (((1 - adjustX) / 2) * size * scale) / 2 + ((1 - adjustX) / 2) * (1 - scale / 2) * size
  var translateYAll = (((1 + adjustY) / 2) * size * scale) / 2

  var moveRight = ((1 + adjustX) * (0.8 * window.innerWidth - size)) / 2
  var moveLeft = ((1 - adjustX) * (0.8 * window.innerWidth - size)) / 2

  svg.style('left', moveLeft + 'px').style('right', moveRight + 'px')

  d3.select('#radar-plot')
    .attr('width', center(size, graphConfig.quadrantsGap))
    .attr('height', center(size, graphConfig.quadrantsGap))
  d3.select('.quadrant-group-' + order)
    .transition()
    .duration(ANIMATION_DURATION)
    .attr('transform', 'translate(' + 0 + ',' + 0 + ')scale(' + 1 + ')')
  d3.selectAll('.quadrant-group-' + order + ' .blip-link text').each(function () {
    d3.select(this.parentNode).transition().duration(ANIMATION_DURATION)
  })

  d3.selectAll(`.quadrant-bg-images:not(#${order}-quadrant-bg-image)`).each(function () {
    this.classList.add('hidden')
  })
  d3.select(`.quadrants-container`).node().classList.add('quadrant-page-view')

  d3.selectAll('.quadrant-group').style('pointer-events', 'auto')

  d3.selectAll('.quadrant-group:not(.quadrant-group-' + order + ')')
    .transition()
    .duration(ANIMATION_DURATION)
    .style('pointer-events', 'none')
    .attr('transform', 'translate(' + translateXAll + ',' + translateYAll + ')scale(0)')

  // if (d3.select('.legend.legend-' + order).empty()) {
  //   drawLegend(order)
  // }

  d3.select('#radar').style('display', 'block') // shows the table
  d3.select('.all-quadrants-mobile.show-all-quadrants-mobile').style('display', 'none') // hides the quadrants
}

function createHomeLink(pageElement) {
  if (pageElement.select('.home-link').empty()) {
    pageElement
      .insert('div', 'div#alternative-buttons')
      .html('&#171; Back to Radar home')
      .classed('home-link', true)
      .classed('selected', true)
      .on('click', redrawFullRadar)
      .append('g')
      .attr('fill', '#626F87')
      .append('path')
      .attr(
        'd',
        'M27.6904224,13.939279 C27.6904224,13.7179572 27.6039633,13.5456925 27.4314224,13.4230122 L18.9285959,6.85547454 C18.6819796,6.65886965 18.410898,6.65886965 18.115049,6.85547454 L9.90776939,13.4230122 C9.75999592,13.5456925 9.68592041,13.7179572 9.68592041,13.939279 L9.68592041,25.7825947 C9.68592041,25.979501 9.74761224,26.1391059 9.87092041,26.2620876 C9.99415306,26.3851446 10.1419265,26.4467108 10.3145429,26.4467108 L15.1946918,26.4467108 C15.391698,26.4467108 15.5518551,26.3851446 15.6751633,26.2620876 C15.7984714,26.1391059 15.8600878,25.979501 15.8600878,25.7825947 L15.8600878,18.5142424 L21.4794061,18.5142424 L21.4794061,25.7822933 C21.4794061,25.9792749 21.5410224,26.1391059 21.6643306,26.2620876 C21.7876388,26.3851446 21.9477959,26.4467108 22.1448776,26.4467108 L27.024951,26.4467108 C27.2220327,26.4467108 27.3821898,26.3851446 27.505498,26.2620876 C27.6288061,26.1391059 27.6904224,25.9792749 27.6904224,25.7822933 L27.6904224,13.939279 Z M18.4849735,0.0301425662 C21.0234,0.0301425662 23.4202449,0.515814664 25.6755082,1.48753564 C27.9308469,2.45887984 29.8899592,3.77497963 31.5538265,5.43523218 C33.2173918,7.09540937 34.5358755,9.05083299 35.5095796,11.3015031 C36.4829061,13.5518717 36.9699469,15.9439104 36.9699469,18.4774684 C36.9699469,20.1744196 36.748098,21.8101813 36.3044755,23.3844521 C35.860551,24.9584216 35.238498,26.4281731 34.4373347,27.7934053 C33.6362469,29.158336 32.6753041,30.4005112 31.5538265,31.5197047 C30.432349,32.6388982 29.1876388,33.5981853 27.8199224,34.3973401 C26.4519041,35.1968717 24.9791531,35.8176578 23.4016694,36.2606782 C21.8244878,36.7033971 20.1853878,36.9247943 18.4849735,36.9247943 C16.7841816,36.9247943 15.1453837,36.7033971 13.5679755,36.2606782 C11.9904918,35.8176578 10.5180429,35.1968717 9.15002449,34.3973401 C7.78223265,33.5978839 6.53752245,32.6388982 5.41612041,31.5197047 C4.29464286,30.4005112 3.33339796,29.158336 2.53253673,27.7934053 C1.73144898,26.4281731 1.10909388,24.9584216 0.665395918,23.3844521 C0.22184898,21.8101813 0,20.1744196 0,18.4774684 C0,16.7801405 0.22184898,15.1446802 0.665395918,13.5704847 C1.10909388,11.9962138 1.73144898,10.5267637 2.53253673,9.16153157 C3.33339796,7.79652546 4.29464286,6.55435031 5.41612041,5.43523218 C6.53752245,4.3160387 7.78223265,3.35675153 9.15002449,2.55752138 C10.5180429,1.75806517 11.9904918,1.13690224 13.5679755,0.694183299 C15.1453837,0.251464358 16.7841816,0.0301425662 18.4849735,0.0301425662 L18.4849735,0.0301425662 Z',
      )
  }
}

function redrawFullRadar() {
  d3.select('#radar').style('display', 'none')
  d3.select('.all-quadrants-mobile.show-all-quadrants-mobile').style('display', 'flex')
  d3.select('.home-link').remove()
}

module.exports = {
  renderQuadrantTables,
  selectQuadrant,
}
