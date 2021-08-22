function simpleComps(folder) {
    let _this = this;

    this.render = component => {
        var inputs = document.getElementsByTagName(component);
        var promise = new Promise();

        for (let i = 0; i < inputs.length; i++) {
            fetch(folder + component + '.html').then(res => {
                return res.text();
            })
                .then(data => {
                    var newElement = document.createElement('div');

                    data = parseData(data, inputs.item(i));

                    newElement.innerHTML = data;

                    parseIfs(newElement);

                    inputs.item(i).appendChild(newElement);

                    if (i == inputs.length - 1)
                        promise.resolve();
                });
        }

        return promise;
    }

    parseData = (data, elem) => {
        var customAtts = data.match(/\{(.+?)\}/g);

        if (typeof customAtts == "undefined" || customAtts == null)
            return data;

        for (let i = 0; i < customAtts.length; i++) {
            let _att = customAtts[i].replace('{', '');
            _att = _att.replace('}', '');

            data = data.replace(customAtts[i], elem.getAttribute(_att));
        }

        return data;
    }

    parseIfs = (elm) => {
        for (let g = 0; g < elm.children.length; g++) {
            try {
                for (var i = 0; i < elm.children.item(g).attributes.length; i++)
                    if (elm.children.item(g).attributes[i].value == 'false' || elm.children.item(g).attributes[i].value == "null" && elm.children.item(g).attributes[i].name == "data-if")
                        elm.removeChild(elm.children.item(g));

                if (elm.children.item(g).children.length > 0)
                    parseIfs(elm.children.item(g));

            } catch (error) {}
        }
    }

    function Promise() {
        // start unresolved
        this.resolved = false;
        // init list of callbacks to fire on resolution
        this.callbacks = [];
    }

    Promise.prototype = {
        then: function (callback) {
            if (this.resolved) {
                // if resolved, fire immediately
                callback();
            } else {
                // otherwise, queue up the callback for later
                this.callbacks.push(callback);
            }
        },

        resolve: function () {
            this.resolved = true;
            // fire all callbacks
            this.callbacks.forEach(function (callback) {
                callback();
            });
        }
    };
}
