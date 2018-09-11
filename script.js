(function() {
  console.log('hello world');

  class SampleButton extends HTMLElement {

    // after the "component mounts"
    connectedCallback() {
      this.addEventListener('click', this._onClick);
    };

    _onClick(event) {
      alert('i am clicked');
    };
  };

  window.customElements.define('sample-button', SampleButton);
})();
