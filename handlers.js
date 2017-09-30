(function(window) {
  let ros_server_port = '4567';
  let socket = io.connect('http://' + document.domain + ':' + ros_server_port);

  window.current_steer = 0;
  window.current_brake = 0;
  window.current_throttle = 0;
  window.current_base_waypoint = { x: [], y: [], linear: [], angular: []};
  window.current_dbw_status = false;
  window.current_image = [];
  window.current_pose = '';
  window.current_velocity = '';
  window.current_image_zoomed = '';

  function on_steer_cmd(data) {
    console.log('Steering: ', data);
    current_steer = Number(data.steering_angle);
  }

  function on_throttle_cmd(data){
    // data.throttle
    console.log('Throtte: ', data);
    current_throttle = Number(data.throttle);
  }

  function on_brake_cmd(data) {
    // data.brake
    console.log('Brake: ', data);
    current_brake = Number(data.brake);
  }

  function on_base_waypoints(data) {
    console.log('Found base waypoints!', data);
    let _x = [],
        _y = [],
        _linear = []
        _angular = []
    data.base_waypoints.split(' ').forEach(function(element, index) {
      index -= 1;
      index % 4 === 0 && _x.push(element);
      index % 4 === 1 && _y.push(element);
      index % 4 === 2 && _linear.push(element);
      index % 4 === 3 && _angular.push(element);
    }, this);
    
    // Remove trailing 
    _x.length = _x.length - 1;
    current_base_waypoint.x = _x;
    current_base_waypoint.y = _y;
    current_base_waypoint.linear = _linear;
    current_base_waypoint.angular = _angular;
    // map.draw();
  }

  function on_dbw_status(data) {
    window.current_dbw_status = data.dbw_status === 'True' ? true : false;
  }

  function on_image(data) {
    window.current_image = data.image;
    // console.log('image base64', data.image);
    post_image(data.image, document.getElementById('carla-view'));
  }

  function on_current_pose(data) {
    window.current_pose = data.current_pose.split(' ');
    console.log('Current pose', window._current_pose); 
    update_pose(window._current_pose);
  }

  function on_current_velocity(data) {
    let _current_velocity = data.current_velocity.split(' ');
    console.log('Current Velocity', _current_velocity);
  }

  // It seems image zoomed is not working
  function on_image_zoomed(data) {
    window.current_image_zoomed = data.image_zoomed;
    post_image(data.image_zoomed, document.getElementById('carla-zoomed-view'));
  }

  function on_disconnect() {
    console.warn('End connection!');
    socket.off('steer', on_steer_cmd);
    socket.off('throttle', on_throttle_cmd);
    socket.off('brake', on_brake_cmd)
    socket.off('base_waypoints', on_base_waypoints);
    socket.off('dbw_status', on_dbw_status);
    socket.off('image', on_image);
    socket.off('current_pose', on_current_pose);
    socket.off('current_velocity', on_current_velocity);
    socket.off('image_zoomed', on_image_zoomed);
  }


  function on_connect() {
    console.log('Listening to ' +  document.domain + ':' + ros_server_port);
  }

  socket.on('connect', on_connect);
  socket.on('disconnect', on_disconnect);
  socket.on('steer', on_steer_cmd);
  socket.on('throttle', on_throttle_cmd);
  socket.on('brake', on_brake_cmd)
  socket.on('base_waypoints', on_base_waypoints);
  socket.on('dbw_status', on_dbw_status);
  socket.on('image', on_image);
  socket.on('current_pose', on_current_pose);
  socket.on('current_velocity', on_current_velocity);
  socket.on('image_zoomed', on_image_zoomed);

  function emit(key, data) {
    socket.emit(key, data);
  }
  
  window.COMM = {
    emit: emit
  }
})(window);