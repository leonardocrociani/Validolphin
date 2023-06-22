class Valigator {

    availableKeys = ['validables', 'unexpectedKeyError', 'errorsAtTime'];
    availableValidablesKeys = ['name', 'schema'];

    constructor(configObject) {
        // controllo configObj
        for (const key in configObject) {
            if (!this.availableKeys.includes(key)) {
                return { valid: false, error: 'Error in configuration object. Unexpected key -> ' + key }
            }
            if (key == 'validables') {
                for (const k of configObject['validables']) {
                    for (const ks in k) {
                        if (!this.availableValidablesKeys.includes(ks)) {
                            return { valid: false, error: 'Error in configuration object. Unexpected key in a validable object -> ' + key }
                        }
                    }
                }
            }
        }

        for (const configObj of configObject.validables) {
            // registrazione funzioni e loro contenuto
            this[configObj.name] = toValid => {
                try {
                    const errors = [];
                    for (const key in toValid) {
                        if (!Object.keys(configObj.schema).includes(key)) {
                            return { valid: false, error: `${configObj.unexpectedKeyError ? configObj.unexpectedKeyError : 'Unexpected key'} -> ${key}` }
                        }
                        else {
                            const value = toValid[key];
                            if (configObj.schema[key].type) {
                                if (
                                    typeof value != configObj.schema[key].type.name.toLowerCase() &&
                                    ('array' == configObj.schema[key].type.name.toLowerCase() && !Array.isArray(value))
                                ) {
                                    errors.push(`${configObj.typeError ? configObj.typeError : 'Type error: expected ' + configObj.schema[key].type.name + ', received ' + typeof value + ' with the value'} -> ${value}`);
                                }
                            }
                            if (configObj.schema[key].type == String) {
                                if (configObj.schema[key].minLen) {
                                    if (value.length < configObj.schema[key].minLen) {
                                        errors.push('Minimum length not respected for the key -> ' + key);
                                    }
                                }
                                if (configObj.schema[key].maxLen) {
                                    if (value.length > configObj.schema[key].maxLen) {
                                        errors.push('Maximum length not respected for the key -> ' + key);
                                    }
                                }
                            }
                            if (configObj.schema[key].type == Number) {
                                if (configObj.schema[key].minVal) {
                                    if (value < configObj.schema[key].minVal) {
                                        errors.push('Minimum value not respected for key -> ' + key);
                                    }
                                }
                                if (configObj.schema[key].maxVal) {
                                    if (value > configObj.schema[key].maxVal) {
                                        errors.push('Minimum value not respected for key -> ' + key);
                                    }
                                }
                            }
                            if (configObj.schema[key].type == Array) {
                                if (configObj.schema[key].elCount) {
                                    if (value.length != configObj.schema[key].elCount) {
                                        errors.push('Element count not respected for key -> ' + key);
                                    }
                                }
                                if (configObj.schema[key].homogen) {
                                    var type = '';
                                    for (var i = 0; i < value.length; i++) {
                                        if (i == 0) {
                                            type = typeof value[i]
                                        }
                                        else {
                                            if (type != typeof value[i]) {
                                                errors.push('Element not matching homogeneous rule -> ' + value[i]);
                                            }
                                        }
                                    }
                                }
                            }
                            if ((value == null || value == undefined) && configObj.schema[key].nullable != true) {
                                errors.push('Not nullable value, find null -> ', value);
                            }
                        }
                    }
                    if (errors.length > 0) {
                        return { valid: false, error: errors.splice(0, (configObj.errorsAtTime ? configObj.errorsAtTime : 3)).join(' |===| ').trimEnd() }
                    }
                    return { valid: true }
                } catch (err) {
                    return { valid: false, error: err }
                }
            }
        }
    }

    static printGator() {
        console.log("  __   __   ______     __         __     ______     ______     ______   ______     ______    ")
        console.log(" /\\ \\ / /  /\\  __ \\   /\\ \\       /\\ \\   /\\  ___\\   /\\  __ \\   /\\__  _\\ /\\  __ \\   /\\  == \\   ")
        console.log(" \\ \\ \\'/   \\ \\  __ \\  \\ \\ \\____  \\ \\ \\  \\ \\ \\__ \\  \\ \\  __ \\  \\/_/\\ \\/ \\ \\ \\/\\ \\  \\ \\  __<   ")
        console.log("  \\ \\__|    \\ \\_\\ \\_\\  \\ \\_____\\  \\ \\_\\  \\ \\_____\\  \\ \\_\\ \\_\\    \\ \\_\\  \\ \\_____\\  \\ \\_\\ \\_\\ ")
        console.log("   \\/_/      \\/_/\\/_/   \\/_____/   \\/_/   \\/_____/   \\/_/\\/_/     \\/_/   \\/_____/   \\/_/ /_/ ")
    }
}

module.exports = Valigator;
