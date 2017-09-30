(function(window) {
  const h = window.innerHeight * 0.3;
  const w = window.innerHeight * 0.5;

  const x_axis_len = w - 50;
  const y_axis_len = h - 50;

  let svg_targt = d3.select('#base-waypoint-map');



  /**
   * 
   * @param {[]} a
   * @param {[]} b
   * @return {[]} [a[i] b[i]]
   */
  function zip(a, b) {
    return a.map(function(elem, index) {
      return [Number(elem), Number(b[index])];
    })
  } 

  function draw() {
    let _x = window.current_base_waypoint.x;
    let _y = window.current_base_waypoint.y;

    let line = d3.svg.line();

    let svg = svg_targt.append('svg')
      .attr({width: w, height: h})
      .append('g')
      .attr('transform', 'translate(50, 30)')

    function redraw() {
      svg.select('path').attr('d', line);
    }
      
    let _x_y = zip(_x, _y);
    console.log('xy1', _x_y[0]);
    let $data = svg.append('path')
      .datum(_x_y)
      .attr('class', 'line data')
      .attr('d', line)
      .call(redraw);
  }
  
  window.map = {
    draw: draw
  }

})(window)