;(function(window) {
  function post_image(src, container) {
    let elem = document.createElement('img');
    elem.src = 'data:image;base64,' + src;
    elem.classList.add('view-port');
    container.innerHTML = elem.outerHTML;
  }

  window.post_image = post_image;
})(window)