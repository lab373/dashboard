(function(window) {
  // See dbw_mkz_msgs for steering cmd rad range
  const MAX_STEER = 8.2;

  function normalize_and_shift_steer(steer) {
    return steer/MAX_STEER + 0.5; 
  }

  const h = window.innerHeight * 0.3;
  const w = window.innerWidth * 0.5;

  let x_axis_len = w - 50;
  let y_axis_len = h - 50;

  let time = 0;
  let num = 300;

  let data = [0];
  let brake = [0];
  let steer = [0];

  let deltas = [0];

  let latestData = [0];
  let latestBrake = [0];
  let latestSteer = [0];

  let latestDeltas = [0];

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

  let $brake = svg.append('path')
    .attr('class', 'line brake');

  let $steer = svg.append('path')
    .attr('class', 'line steer');

  let $rects = svg.selectAll('rect')
    .data(d3.range(num))
    .enter()
      .append('rect')
      .attr('width', x_axis_len / num)
      .attr('x', (d, i) => i * x_axis_len / num);

  let legend = svg.append('g')
    .attr('transform', `translate(20, 20)`)
    .selectAll('g')
    .data([['Value', '#fff'], ['Brake', '#0ff'], ['Steer', '#ff0']])
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

    data[time] = current_throttle;
    // brake is provided as negative value
    brake[time] = -current_brake;
    steer[time] = normalize_and_shift_steer(current_steer);

    deltas[time] = data[time] - data[time - 1];

    if (time <= num) {
      latestData = data.slice(-num);
      latestBrake = brake.slice(-num);
      latestSteer = steer.slice(-num);
      latestDeltas = deltas.slice(-num);

    }
    else {
      latestData.shift();
      latestBrake.shift();
      latestSteer.shift();
  
      latestDeltas.shift();
      latestData.push(data[time]);
      latestBrake.push(brake[time]);
      latestSteer.push(steer[time]);

      latestDeltas.push(deltas[time]);
    }
  }

  function update() {
    x.domain([time - num, time]);

    $xAxis
      .call(xAxis);

    $data
      .datum(latestData)
      .attr('d', line);

    $brake
      .datum(latestBrake)
      .attr('d', line);

    $steer
      .datum(latestSteer)
      .attr('d', line);

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