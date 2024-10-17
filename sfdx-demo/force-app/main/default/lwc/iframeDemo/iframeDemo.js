import { LightningElement } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';

import pymjs from '@salesforce/resourceUrl/pym';

export default class IframeDemo extends LightningElement {
    height = '100px';
    referrerPolicy = 'no-referrer';
    sandbox = 'allow-scripts allow-same-origin allow-popups allow-forms';
    // url = 'https://techdicer.com/';
    url = 'https://app.sf-explorer.com';
    width = '100%';

    handleSendMessage() {
        this.template.querySelector("iframe").contentWindow.postMessage("message to child ", "*");
    }


    connectedCallback() {
       
        /*window.addEventListener("message", (event) => {
            // verify origin
            //if (event.origin !== "https://forcetrails-dev-ed--c.vf.force.com") {
            console.log("data received in LWC", event.data);
            //}
        }, false);*/
        Promise.all([
            loadScript(this, pymjs),
        ]).then(() => {
            // initialize the library using a reference to the container element obtained from the DOM
            console.log('success in loading pymjs');
            console.log(window.pym)
            var pymParent = new pym.Parent('example', 'http://localhost:8080/test/pym_child.html', {}, this.template.querySelector("span"));
            //console.log(openCTI, window)
            pymParent.onMessage('child-click', function(data) {
               console.log("lwc", data)
           });
            
        })
        .catch((error) =>{
            console.log('error====='+error);
        });

    }
}