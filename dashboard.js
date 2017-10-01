;(function(window) {
  function post_image(src, container) {
    let elem = document.createElement('img');
    elem.src = 'data:image;base64,' + src;
    elem.classList.add('view-port');
    container.innerHTML = elem.outerHTML;
  }

  function update_pose(pose) {
    if (!pose) {
      console.warn('Empty Pose!');
      return;
    }
    document.getElementById('pose-x').innerHTML = 'X: ' + pose[0];
    document.getElementById('pose-y').innerHTML = 'Y: ' + pose[1];
    document.getElementById('pose-z').innerHTML = 'Z: ' + pose[2];
    document.getElementById('pose-yaw').innerHTML = 'Yaw: ' + pose[3];
  }

  function update_velocity(velocity) {
    if (!velocity) {
      console.warn('Empty Velocity!');
      return;
    }
    document.getElementById('linear-velocity').innerHTML = 'Linear: ' + velocity[0];
    document.getElementById('angular-velocity').innerHTML = 'Angular: ' + velocity[1];
  }

  window.post_image = post_image;
  window.update_pose = update_pose;
  window.update_velocity = update_velocity;
})(window)