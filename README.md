
<p align='center'>
  <img src="https://i.imgur.com/7svMXLi.png" />
</p>

![npm version](https://img.shields.io/npm/v/@sharks-interactive/simple-components)
![npm downloads](https://img.shields.io/npm/dm/@sharks-interactive/simple-components)

# Simple Components
**Simple Components** is a lightweight vanilla javascript component framework.

## Functionality
- Easily **replicate** individual html components with custom data
- Easy **bulk** rendering of components
- Supports **custom props** for all your components
- **Supports conditional rendering**, for hiding portions of a component based on conditions
- **Supports inline script tags** and modules

## Usage:
```
https://www.jsdelivr.com/package/npm/@sharks-interactive/simple-components
```

## Quick Examples:
#### Rendering individual comps (w/ props & promise)
```js
import { SimpleComps } from 'https://www.jsdelivr.com/package/npm/@sharks-interactive/simple-components';
const sc = new SimpleComps('relative/path/to/components/');

window.onload = sc.render('welcome-msg').then(() => {
	// Called when the comp finishes rendering in case you need to access it
	console.log('Done rendering');
});

/// In another file at
// /relative/path/to/components/welcome-msg.html:
<div style="background-color: {color};"></div>

// In index.html or whatever else file is using this component:
<welcome-msg color="red"></welcome-msg>
```

### Rendering Multiple
```js
// By default calling sc.render('comp-name') renders every element of that type in the DOM, but Simple-Components has a utility function for creating multiple in the DOM for rendering
import { SimpleComps } from 'https://www.jsdelivr.com/package/npm/@sharks-interactive/simple-components';
const sc = new SimpleComps('relative/path/to/components/');

// Create a new object containing a list of objects contaning a list of attributes each component should use
// Populate this via code for search results, tweets or whatever else you need
let dataObj = {
	l: [
		{ attrs: ['propName|propValue', 'resultName|https://dogs.com'] }, // Javascript object for each comp's attrs
		{ attrs: ['propName|propValue', 'resultName|https://cats.com'] }
	]
}

sc.create('result-card', 2 /* Num of comps to create */, myContainer /* Parent obj */, dataObj /* Comp data */);
sc.render('result-card'); // Renders all the comps we just created in the DOM

///
/// In the result-card.html comp file:
///
<div class="search-result">
	<h1>{resultName}</h1>
</div>
```

## Features:
- **.create()** creates multiple comps with specified props in the DOM
- **.render()** renders all of a specific comp
- **``<script>, <style>``** inline script and style tags supported
- **if="false"** conditional rendering of elements
- **{propName}** supports all kinds of custom props, even in your ``<script>``
- **Promise-based** supports a promise for running code when a comp is finished rendering
- **Custom HTML elements** supports the (appearance) of custom HTML elements
- **``<script type="module">``** supports javascript modules

## Options (Required)

| Option | Type | Description |
| ------ | ---- | ----------- |
| folder | string | A string containing the path to your components, relative to the script calling it. |


## How it works:
This component library is a easy way to render html files.
In the background it loads your component files over https, parses props, ifs, and ``<script>`` tags, and then inserts them into the HTML DOM.

**Read the wiki for extra documentation.**
  
Project created and maintained by Sharks Interactive.
  
### Developing:
  - Commit to ``staging`` and pr to ``prod`` for changes

### Code Style:
  - Continious Integration will handle formatting for you
  - Use ESLINT locally to catch errors pre-pr

## Acknowledgements:
**README.MD styling, practices etc, modelled after and taken from the excellent [Toucan-JS](https://github.com/robertcepa/toucan-js)**