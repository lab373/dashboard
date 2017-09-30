;(function(window) {
  function post_image(src, container) {
    let elem = document.createElement('img');
    elem.src = 'data:image;base64,' + src;
    elem.classList.add('view-port');
    container.innerHTML = elem.outerHTML;
  }

  function update_pose(pose) {
    document.getElementById('pose-x').innerHTML = 'X: ' + pose[0];
    document.getElementById('pose-y').innerHTML = 'Y: ' + pose[1];
    document.getElementById('pose-z').innerHTML = 'Z: ' + pose[2];
  }

  function update_velocity(velocity) {
    document.getElementById('linear-velocity').innerHTML = 'Linear: ' + velocity[0];
    document.getElementById('angular-velocity').innerHTML = 'Angular: ' + velocity[1];
  }

  window.post_image = post_image;
  window.update_pose = update_pose;
})(window)