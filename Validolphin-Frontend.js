class Validolphin {

    availableKeys = ['validables', 'unexpectedKeyError', 'errorsAtTime', 'missingKeyError'];
    availableValidablesKeys = ['name', 'schema'];
    static types = {
        Email: { name: 'email' },
        Password: { name: 'password' },
        Domain: { name: 'domain' },
        Phone: { name: 'phone' },
    }
    static utils = {
        email_regular_expression: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
        password_regular_expression: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        domain_regular_expression: /^((?!-))(xn--)?[a-z0-9][a-z0-9-_]{0,61}[a-z0-9]{0,1}\.(xn--)?([a-z0-9\-]{1,61}|[a-z0-9-]{1,30}\.[a-z]{2,})$/,
        phone_regular_expression: /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/,
    }

    constructor(configObject) {
        // controllo configObj
        for (const key in configObject) {
            if (!this.availableKeys.includes(key)) {
                throw new Error('Error in configuration object. Unexpected key -> ' + key)
            }
            if (key == 'validables') {
                for (const k of configObject['validables']) {
                    for (const ks in k) {
                        if (!this.availableValidablesKeys.includes(ks)) {
                            throw new Error('Error in configuration object. Unexpected key in a validable object -> ' + key)
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
                            if (value) {
                                // general type check
                                if (configObj.schema[key].type) {
                                    if (
                                        typeof value != configObj.schema[key].type.name.toLowerCase() &&
                                        ('array' == configObj.schema[key].type.name.toLowerCase() && !Array.isArray(value))
                                    ) {
                                        errors.push(`${configObj.typeError ? configObj.typeError : 'Type error: expected ' + configObj.schema[key].type.name + ', received ' + typeof value + ' with the value'} -> ${value}`);
                                    }
                                }
                                // specific type check
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
                                            errors.push('Minimum element count not respected for key -> ' + key);
                                        }
                                    }
                                    if (configObj.schema[key].maxEl) {
                                        if (value.length > configObj.schema[key].maxEl) {
                                            errors.push('Maximum element count not respected for key -> ' + key);
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
                                if (configObj.schema[key].type == Validolphin.types.Email) {
                                    if (Validolphin.utils.email_regular_expression.test(value)) {
                                        if (configObj.schema[key].matchDomain) {
                                            if (value.split('@')[1] != configObj.schema[key].matchDomain) {
                                                errors.push('Email not matching domain -> ' + value);
                                            }
                                        }
                                        if (configObj.schema[key].notAllowedArr) {
                                            if (configObj.schema[key].notAllowedArr.includes(value.split('@')[1])) {
                                                errors.push('Email has a not allowed domain -> ' + value)
                                            }
                                        }
                                    }
                                    else {
                                        errors.push('Element is not a valid email -> ' + value);
                                    }
                                }
                                if (configObj.schema[key].type == Validolphin.types.Password) {
                                    if (!Validolphin.utils.password_regular_expression.test(value)) {
                                        errors.push('The password must have at least 8 charaters, an upper case letter, a number and a special char ()');
                                    }
                                }
                                if (configObj.schema[key].type == Validolphin.types.Domain) {
                                    if (!Validolphin.utils.domain_regular_expression.test(value)) {
                                        errors.push('The domain is not valid -> ' + value);
                                    }
                                }
                                if (configObj.schema[key].type == Validolphin.types.Phone) {
                                    if (!Validolphin.utils.phone_regular_expression.test(value)) {
                                        errors.push('The phone is not valid -> ' + value);
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
            Version: 1.1.0
        `)
    }
}
