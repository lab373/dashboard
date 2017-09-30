// https://codepen.io/browles/pen/mPMBjw
// https://codepen.io/anon/pen/boWedg
// https://stackoverflow.com/questions/11932767/zoomable-google-finance-style-time-series-graph-in-d3-or-rickshaw
// Spline fitting
// Use cardinal
// https://bl.ocks.org/mbostock/4342190
(function(window) {
  // Fitting solution
  const h = window.innerHeight * 0.3;
  const w = window.innerWidth * 0.5;

  let x_axis_len = w - 50;
  let y_axis_len = h - 50;

  let time = 0;
  let num = 300;

  // let noise = new SimplexNoise();
  let seed = 50 + 100 * Math.random();
  let data = [seed];
  // let averages_50 = [0];
  // let averages_25 = [0];
  let deltas = [seed];

  let latestData = [seed];
  // let latestAverages_50 = [0];
  // let latestAverages_25 = [0];
  let latestDeltas = [seed];

  let x = d3.scale.linear().range([0, x_axis_len]);
  let y = d3.scale.linear().range([y_axis_len, 0]);

  // Why negative innerTickSize?
  let xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom')
    .innerTickSize(-y_axis_len)
    .outerTickSize(0)
    .tickPadding(10);

  let yAxis = d3.svg.axis()
    .scale(y)
    .orient('left')
    .innerTickSize(-x_axis_len)
    .outerTickSize(0)
    .tickPadding(10);

  let line = d3.svg.line()
    .x((d, i) => x(i + time - num))
    .y(d => y(d));
    // Sample usage of interpolation
    //  .interpolate('cardinal')

  let svg_target = d3.select('#carla-telemetry');    
  let svg = svg_target.append('svg')
    .attr({width: w, height: h})
    .append('g')
    .attr('transform', 'translate(50, 20)');

  let $xAxis = svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', `translate(0, ${y_axis_len})`)
    .call(xAxis);

  let $yAxis = svg.append('g')
    .attr('class', 'y axis')
    .call(yAxis);

  let $data = svg.append('path')
    .attr('class', 'line data');

  // let $averages_50 = svg.append('path')
  //   .attr('class', 'line average-50');

  // let $averages_25 = svg.append('path')
  //   .attr('class', 'line average-25');

  let $rects = svg.selectAll('rect')
    .data(d3.range(num))
    .enter()
      .append('rect')
      .attr('width', x_axis_len / num)
      .attr('x', (d, i) => i * x_axis_len / num);

  let legend = svg.append('g')
    .attr('transform', `translate(20, 20)`)
    .selectAll('g')
    .data([['Value', '#fff'], ['Trailing Average - 50', '#0ff'], ['Trailing Average - 25', '#ff0']])
    .enter()
      .append('g');

    legend
      .append('circle')
      .attr('fill', d => d[1])
      .attr('r', 5)
      .attr('cx', 0)
      .attr('cy', (d, i) => i * 15);

    legend
      .append('text')
      .text(d => d[0])
      .attr('transform', (d, i) => `translate(10, ${i * 15 + 4})`);

  function tick() {
    time++;
    // data[time] = data[time - 1] + noise.noise2D(seed, time / 2);
    // data[time] = Math.max(data[time], 0);

    data[time] = current_throttle;

    // if (time <= 50) {
    //   let a = 0;
    //   for (let j = 0; j < time; j++) {
    //     a += data[time - j];
    //   }
    //   a /= 50;
    //   averages_50[time] = a;
    // }
    // else {
    //   let a = averages_50[time - 1] * 50 - data[time - 50];
    //   a += data[time];
    //   a /= 50;
    //   averages_50[time] = a;
    // }

    // if (time <= 25) {
    //   let a = 0;
    //   for (let j = 0; j < time; j++) {
    //     a += data[time - j];
    //   }
    //   a /= 25;
    //   averages_25[time] = a;
    // }
    // else {
    //   let a = averages_25[time - 1] * 25 - data[time - 25];
    //   a += data[time];
    //   a /= 25;
    //   averages_25[time] = a;
    // }

    deltas[time] = data[time] - data[time - 1];

    if (time <= num) {
      latestData = data.slice(-num);
      // latestAverages_50 = averages_50.slice(-num);
      // latestAverages_25 = averages_25.slice(-num);
      latestDeltas = deltas.slice(-num);
    }
    else {
      latestData.shift();
      // latestAverages_50.shift();
      // latestAverages_25.shift();
      latestDeltas.shift();
      latestData.push(data[time]);
      // latestAverages_50.push(averages_50[time]);
      // latestAverages_25.push(averages_25[time]);
      latestDeltas.push(deltas[time]);
    }
  }

  function update() {
    x.domain([time - num, time]);
    // let yDom = d3.extent(latestData);
    // yDom[0] = Math.max(yDom[0] - 1, 0);
    // yDom[1] += 1;
    // y.domain(yDom);

    $xAxis
      .call(xAxis);

    // $yAxis
    //   .call(yAxis);

    // TODO: figure out how to do clean?
    $data
      .datum(latestData)
      .attr('d', line);

    // $averages_50
    //   .datum(latestAverages_50)
    //   .attr('d', line);

    // $averages_25
    //   .datum(latestAverages_25)
    //   .attr('d', line);

    // $rects
    //   .attr('height', (_, i) => Math.abs(latestDeltas[i] * h / 10))
    //   .attr('fill', (_, i) => latestDeltas[i] < 0 ? 'red' : 'green')
    //   .attr('y', (_, i) => h - Math.abs(latestDeltas[i] * h / 10) - 42);
    $rects
      .attr('height', (_, i) => Math.abs(latestData[i]))
      .attr('fill', (_, i) => 'red')
      .attr('y', (_, i) => h - Math.abs(latestData[i] * h/2) - 40);
  }

  for (let i = 0; i < num + 50; i++) {
    tick();
  }

  update();

  setInterval(() => {
    tick();
    update();
  }, 60);

})(window);