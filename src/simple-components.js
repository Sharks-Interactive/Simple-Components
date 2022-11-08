/* eslint-disable max-len */
/**
 * Creates a new simpleComps instance
 * @param {string} folder - Path to the folder containing comp files
 */
export function SimpleComps(folder) {
  /**
   * Renders the specified comp
   * @param {string} component - The name of the comp to render
   * @param {boolean} inject - If true the component will directly be rendered onto the page instead of inside its component element
   * @return {Promise} Callacks called when comp is done being rendered
   */
  this.render = (component, inject = false, ignore = false) => {
    const inputs = document.getElementsByTagName(component);
    const promise = new Promise();

    fetch(folder + component + '.html?comp=true')
        .then((res) => {
          return res.text();
        })
        .then((componentFile) => {
          const componentData = componentFile;
          let deletedElms = 0;

          for (let i = 0; i < inputs.length + deletedElms; i++) {
            if (componentData == undefined) {
              promise.resolve();
              return promise;
            } // Error

            let data = componentData;

            const newElement = document.createElement('div');
            const newScript = document.createElement('script'); // Add script tag (If we need it)

            if (data.includes('script')) {
              const script = data.match(/\<script(.*?)>(.+)\<\/script>/gs)[0];
              newScript.innerHTML = parseData(script.replace(
                  /(<script(.*?)>|<\/script>)/gs,
                  '',
              ), inputs.item(i - deletedElms).parentElement); // Remove script tags and prase custom data for script

              data = data.replace(/\<script(.*?)>(.+)\<\/script>/gs, ''); // Remove code from innerHTML
              try {
                newScript.type = script
                    .match(/type="(.*?)"/gs)[0]
                    .replace(/type="|"/gs, '');
              } catch {} // If it has one, set the scripts type
            }

            data = parseData(data, inputs.item(i - deletedElms), ignore); // Dont parse data until after scripts are executed so we dont execute 3rd party scripts

            let parent = inputs.item(i - deletedElms).parentElement;

            if (!inject) newElement.innerHTML = data;
            else parent.appendChild(new DOMParser().parseFromString(data, 'text/html').body.firstChild);

            parseIfs(newElement);

            if (!inject) inputs.item(i - deletedElms).appendChild(newElement);
            else {
              parent.removeChild(inputs.item(i - deletedElms));
              deletedElms++;
            }

            /* IMPORTANT: If your seeing errors on this line it means that you have an error in your components code! */
            if (newScript != null) newElement.appendChild(newScript); // Add script to element

            if (i == (inputs.length + deletedElms) - 1) promise.resolve();
          }
        });

    return promise;
  };

  /**
   * Creates the specified comps without rendering them
   * @param {string} component - The type of the comps to create
   * @param {int} number - The number of this comp to render
   * @param {HTMLElement} parent - The parent to create the comps under
   * @param {object} attributes - JSON stringified object with a list of lists with equivalent attribute arrays named attrs for the duplicates in the format of ATTR_NAME | ATTR_VALUE
   */
  this.create = (
      component,
      number = 1,
      parent = document.body,
      attributes = null,
  ) => {
    for (let i = 0; i < number; i++) {
      const createdElement = document.createElement(component);
      parent.appendChild(createdElement);

      if (attributes == null) continue;

      try {
        for (let x = 0; x < Object.keys(attributes[i]).length; x++) {
          createdElement.setAttribute(
              Object.keys(attributes[i])[x],
              Object.values(attributes[i])[x],
          );
        }
      } catch (e) {}
    }
  };

  /**
   * Parses custom data (eg: variables) in a component file
   * @param {string} data - Raw HTML of a component in string format
   * @param {HTMLElement} elem - Custom html element which we are rendering
   * @return {string} The parsed version of the input data
   */
  const parseData = (data, elem, ignore) => {
    // Get a list of all {specialData} in the given component data
    const customAtts = data.match(/\{(.+?)\}/g);

    if (typeof customAtts == 'undefined' || customAtts == null) return data;

    for (let i = 0; i < customAtts.length; i++) {
      // Remove brackets from custom data/attributes
      const _att = customAtts[i].replace(/[\{\}]+/g, '');
      if (elem.getAttribute(_att) == undefined) {
        console.warn(`SKIPPING ${_att}`);
        if (ignore) data = data.replace(customAtts[i], '');
        continue;
      } // No attr of this type exists on this comp - skip it

      // Get value of attribute of same name on component element
      data = data.replace(customAtts[i], elem.getAttribute(_att));
    }

    return data;
  };

  /**
   * Parses if attributes in a component
   * @param {HTMLDivElement} elm - The HTML element to parse ifs on
   */
  const parseIfs = (elm) => {
    for (let g = 0; g < elm.children.length; g++) {
      try {
        for (let i = 0; i < elm.children.item(g).attributes.length; i++) {
          if (
            elm.children.item(g).attributes[i].value == 'false' &&
              elm.children.item(g).attributes[i].name == 'data-if'
          ) {
            elm.removeChild(elm.children.item(g));
          }
          if (
            elm.children.item(g).attributes[i].value == 'true' &&
            elm.children.item(g).attributes[i].name == 'data-not'
          ) {
            elm.removeChild(elm.children.item(g));
          }
        }

        if (elm.children.item(g).children.length > 0) {
          parseIfs(elm.children.item(g));
        }
      } catch (error) {}
    }
  };

  /**
   * Creates a promise
   */
  function Promise() {
    this.resolved = false;
    this.callbacks = []; // List of callbacks to fire on resolution
  }

  Promise.prototype = {
    then: function(callback) {
      if (this.resolved) callback();
      else this.callbacks.push(callback); // Queue up callback for later
    },

    resolve: function() {
      this.resolved = true;
      // Fire all callbacks
      this.callbacks.forEach(function(callback) {
        callback();
      });
    },
  };
}
