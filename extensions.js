

Function.prototype.clone = function(originalObject, circular) {
        // First create an empty object with
        // same prototype of our original source
        var propertyIndex;
        var descriptor;
        var keys;
        var current;
        var nextSource;
        var indexOf;
        var copies = [{
            source: originalObject,
            target: Array.isArray(originalObject) ? [] : Object.create(Object.getPrototypeOf(originalObject))
        }];
        var cloneObject = copies[0].target;
        var sourceReferences = [originalObject];
        var targetReferences = [cloneObject];

        // First in, first out
        while (current = copies.shift())	// jshint ignore:line
        {
            keys = Object.getOwnPropertyNames(current.source);

            for (propertyIndex = 0; propertyIndex < keys.length; propertyIndex++) {
                // Save the source's descriptor
                descriptor = Object.getOwnPropertyDescriptor(current.source, keys[propertyIndex]);

                if (!descriptor.value || typeof descriptor.value !== 'object') {
                    Object.defineProperty(current.target, keys[propertyIndex], descriptor);
                    continue;
                }

                nextSource = descriptor.value;
                descriptor.value = Array.isArray(nextSource) ? [] : Object.create(Object.getPrototypeOf(nextSource));

                if (circular) {
                    indexOf = sourceReferences.indexOf(nextSource);

                    if (indexOf !== -1) {
                        // The source is already referenced, just assign reference
                        descriptor.value = targetReferences[indexOf];
                        Object.defineProperty(current.target, keys[propertyIndex], descriptor);
                        continue;
                    }

                    sourceReferences.push(nextSource);
                    targetReferences.push(descriptor.value);
                }

                Object.defineProperty(current.target, keys[propertyIndex], descriptor);

                copies.push({ source: nextSource, target: descriptor.value });
            }
        }
        return cloneObject;
    };