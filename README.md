# responsiveiframe

A simplified NPR Visuals fork of [NPR Tech's responsiveiframe](http://npr.github.com/responsiveiframe/). Requires jQuery on both the parent and child pages.

Released under the MIT open source license. See `LICENSE` for details.

## What is it?

A library that allows iframes to be embedded in a way that allows them to resize responsively within their parent and bypasses the usual cross-domain issues.

The typical use-case for this is embedding small custom bits of code (charts, maps, etc.) inside a CMS without override CSS or JavaScript conflicts.

See an example of this in action on [NPR.org](http://www.npr.org/2014/03/25/293870089/maze-of-college-costs-and-aid-programs-trap-some-families).

## Examples

Make your browser window wider or narrower to see test responsiveness in these examples:

* [Simple](examples/simple/)
* [Dynamic](examples/dynamic/)
* [D3 line graph](examples/graphic/)
* [Multiple D3 line graphs](examples/multiple/)

## Usage

### On the parent page

* Include `parent.js`.
* Call `$('div').responsiveIframe({ src: 'child.html' });`, selecting your container div and passing the path to your child page as `src`. 
* You can optionally pass in a regex to filter incoming message domains: `$('iframe').responsiveIframe({ xdomain: '*\.npr\.org' });`.

For example:

```
<div id="graphic"></div>
<script type="text/javascript" src="js/parent.js"></script>
<script type="text/javascript">
    embed_graphic = window.responsiveIframe({
        src: 'child.html',
        id: 'graphic'
    });
    embed_graphic.setup();
</script>
```

### On the child (embedded) page

* Include `child.js`.
* Invoke `setupResponsiveChild();`.
* If the contents of your iframe are dynamic you will want to pass in a rendering function, like this: `setupResponsiveChild({ renderCallback: myFunc });` This function will be called once on load and then again anytime the window is resized.
* You can optionally pass in a number of milliseconds to enable automaticaly updating the height at that rate (in addition to on load and resize events). Like this `setupResponsiveChild({ polling: 500 });`.

#### Basic example

```
<script type="text/javascript" src="js/child.js"></script>
<script type="text/javascript">	
    $(window).load(function() {
        setupResponsiveChild();
    });	
</script>
```

#### Call a function when the window resizes

This might be useful in cases where sections of your child page need to be redrawn based on the new width. (For example, a graphic generated by D3 or Raphael, which would not stretch or reflow on their own.)

```
<script type="text/javascript" src="js/child.js"></script>
<script type="text/javascript">	
    function drawBox(width) {
        // do something (like re-rendering a graphic based on the new width)
    }

    $(window).load(function() {
        setupResponsiveChild({
            renderCallback: drawBox
        });
    });	
</script>
```

#### Manual resize events

If you have dynamic content and need finer control over resize events, you can invoke `sendHeightToParent()` in the child window at any time to force the iframe to update its size.

For example, say you have a button on the page, and when that button is clicked, something on the page changes which could affect the page's height:

```
<script type="text/javascript" src="js/child.js"></script>
<script type="text/javascript">	
    function onButtonClicked() {
        // do something
        sendHeightToParent();
    }
    $('button').on('click', onButtonClicked);

    $(window).load(function() {
        setupResponsiveChild();
    });	
</script>
```

## Assumptions / requirements

If you're pasting the iframe embed code into a CMS or blogging software, make sure that it allows you to embed HTML and JavaScript. Some CMSes (such as WordPress) may strip it out.

The parent and child pages do not necessarily need to be on the same domain. (You can restrict this with xdomain.)

### Browsers

This has been tested in:

* Internet Explorer 9 and 10 (Windows 7)
* Chrome 32 (Mac 10.9)
* Firefox 26 (Mac 10.9)
* Safari 7 (Mac 10.9)
* iOS 7 Safari
* Android 4.4 Chrome

Internet Explorer versions earlier than **9** are not supported.


## How it works

The `parent.js` library and a small bit of javascript are injected onto the parent page. This
code writes an iframe to the page in a container of your choice. The request for the iframe's contents includes querystring parameters for the `initialWidth` and `childId` of the child page. The `initialWidth` allows the child to know its size immediately on load. (In iOS the child frame can not determine its own width accurately.) The `childId` allows multiple children to be embedded on the same page, each with its own communication to the parent.

The child page includes `child.js` and its own javascript. It invokes the `setupResponsiveIframe` function, which initializes cross-iframe communication to the parent, renders the any dynamic contents and then sends the computed height of the child to the parent via [postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window.postMessage). Upon receiving this message the parent resizes the containing iframe, thus ensuring the contents of the child are always visible.

The parent page also registers for resize events. Any time one is received, the parent sends the new container width to each child via `postMessage`. The child rerenders its content and sends back the new height.


## Credits

Rewritten by [@nprapps](http://github.com/nprapps).

Originally built by [@NPR](http://github.com/npr/).

Based on an original prototype by [Ioseb Dzmanashvili](https://github.com/ioseb). 
