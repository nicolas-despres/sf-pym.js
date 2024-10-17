SF Pym.js
======

Fork of the Pym.js library for Salesforce (LWC) compatibility.

## Origin of the problem:
Pym.js use a dom id to instantiate a child iframe:
```
this.el = document.getElementById(id);
```
However
- It's not recommended to manipulate DOM elements based on id, as the framework replaces custom id to a globally unique id in the page.
- Even if we retrieve the global id, lwc use [shadow doms](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM) which dom manipulation like querySelector more difficult

## Proposed solution


This fork propose to add a new argument to the Parent function, to directly give the dom element given by Salesforce with `this.template.querySelector`
```
 var pymParent = new pym.Parent('example', 'http://localhost:8080/test/pym_child.html', {}, this.template.querySelector("span"));
```

Everything else work the same.


## Examples

Look into the folder [./sfdx-demo/force-app](./sfdx-demo/force-app/main/default/) for an example on how to use it.


