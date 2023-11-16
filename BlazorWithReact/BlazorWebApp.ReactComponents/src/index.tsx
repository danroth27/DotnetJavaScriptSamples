
// import react and react-dom
import * as React from 'react';
import * as ReactDOM from 'react-dom';

class MyReactComponent extends React.Component {
    render() {
        return <p>hello from react </p>;
    }
}

customElements.define('my-react-component', class extends HTMLElement {
    connectedCallback() {
        const mountPoint = document.createElement('div');
        this.attachShadow({ mode: 'open' }).appendChild(mountPoint);
        ReactDOM.render(<MyReactComponent />, mountPoint);
    }
});