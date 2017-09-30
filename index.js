;(function(window) {
  // let dbw = document.getElementById('dbw');
  let lpf = document.getElementById('lpf');
  let lc = document.getElementById('launch-control');

  // let p_term = document.getElementById('p-term');
  // let i_term = document.getElementById('i-term');
  // let d_term = document.getElementById('d-term');
  // let accel_limit = document.getElementById('accel-limit');
  // .checked boolean
  function collect_dashboard_input() {
  }
  document.getElementById('send-downlink').addEventListener('click', function(evt) {
    let lpf_state = Number(document.getElementById('lpf').checked).toString();
    let lc_state = Number(document.getElementById('launch-control').checked).toString();

    COMM.emit('downlink', { 'lpf':  lpf_state, 'lc': lc_state});
  });
})(window);