class Validolphin {

    availableKeys = ['validables', 'unexpectedKeyError', 'errorsAtTime', 'missingKeyError'];
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
                    const required = [];
                    for (const key in configObj.schema) {
                        if (configObj.schema[key].nullable != true) {
                            required.push(key);
                        }
                    }
                    for (const req of required) {
                        if (!Object.keys(toValid).includes(req)) errors.push(`${configObj.missingKeyError ? configObj.missingKeyError : 'Missing required key'} -> ${req}`)
                    }
                    for (const key in toValid) {
                        if (!Object.keys(configObj.schema).includes(key)) {
                            return { valid: false, error: `${configObj.unexpectedKeyError ? configObj.unexpectedKeyError : 'Unexpected key'} -> ${key}` }
                        }
                        else {
                            const value = toValid[key];
                            if ((value == null || value == undefined) && configObj.schema[key].nullable != true) {
                                errors.push('Not nullable value, find null -> ', value);
                                continue
                            }
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
                                if (configObj.schema[key].minEl) {
                                    if (value.length < configObj.schema[key].minEl) {
                                        errors.push('Element minimum element count not respected for key -> ' + key);
                                    }
                                }
                                if (configObj.schema[key].maxEl) {
                                    if (value.length > configObj.schema[key].maxEl) {
                                        errors.push('Element maximum element count not respected for key -> ' + key);
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

    static printDolph() {
        console.log(`
            _    _____    __    ________  ____  __    ____  __  _______   __
            | |  / /   |  / /   /  _/ __ \\/ __ \\/ /   / __ \\/ / / /  _/ | / /
            | | / / /| | / /    / // / / / / / / /   / /_/ / /_/ // //  |/ / 
            | |/ / ___ |/ /____/ // /_/ / /_/ / /___/ ____/ __  // // /|  /  
            |___/_/  |_/_____/___/_____/\\____/_____/_/   /_/ /_/___/_/ |_/   
            Version: 1.0.4
        `)
    }
}

module.exports = Validolphin;
