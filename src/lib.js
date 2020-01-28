class Localyze {
    constructor(options) {
        this.options = Object.assign(this.default_options, options);
        this.loaded = {};

        this.options.global === true && this.bindGlobals();
        this.options.model && typeof this.options.model === 'string' && this._getTranslation(this.options, 'model');
        this.localyze = this.localyze.bind(this);
        this.checkTranslations();
        return this;
    }

    get default_options() {
        return {
            language: 'en',
            translation: {},
            global: false,
            model: null,
            check_model: true
        }
    }

    bindGlobals() {
        try {
            if (window) {
                window.localyze = this.localyze;
                window.localyze = window.localyze.bind(this);
            }
            if (global) {
                global.localyze = this.localyze;
                global.localyze = global.localyze.bind(this);
            }
        } catch (err) { }
    }

    checkTranslations() {
        for (let t in this.options.translation) {
            let translation = this.options.translation[t];
            if (typeof translation === 'string') {
                this._getTranslation(this.options.translation, t);
            }
            else {
                if (!translation.length) {
                    console.log(`[l10n] ${t} file loaded`);
                    if (this.options.model && this.options.check_model) {
                        this.checkInconsistencies(this.options.translation, t);
                    }
                }
                else {
                    this.getGroupedTranslation(translation, t);
                }
            }
        }
    }

    getGroupedTranslation(group, key) {
        if (!this.options.translation[key]) this.options.translation[key] = {};
        let count = 0;

        for (let g of group) {
            if (!this.loaded[g]) {
                this._getFile(g, (res, err) => {
                    if (res) {
                        this.options.translation[key] = Object.assign(this.options.translation[key], res);
                        this.loaded[g] = true;
                        count++;
                        if (count === group.length) {
                            if (this.options.model && key !== 'model') {
                                this.checkInconsistencies(this.options.translation, key);
                            }
                            this.checkIfReady(this.options.translation);
                        }
                    }
                })
            }
        }
    }

    addTranslationFile(key, data, cb) {
        if (typeof data === 'string') {
            if (!this.loaded[data]) {
                this._getFile(data, (res, err) => {
                    if (res) {
                        this.options.translation[key] = Object.assign(this.options.translation[key], res);
                        this.loaded[data] = true;
                        if (this.options.model && key !== 'model') {
                            this.checkInconsistencies(this.options.translation, key);
                        }

                        if (cb) {
                            try { cb(true) }
                            catch (err) {
                                console.warn(err);
                                if (cb) cb(false, err);
                            }
                        }
                    }
                })
            }
        }
        else {
            try {
                this.options.translation[key] = Object.assign(this.options.translation[key], data);
                if (cb) cb(true);
            } catch (err) {
                console.warn(err);
                if (cb) cb(false, err);
            }
        }
    }

    _getTranslation(obj, key) {
        this._getFile(obj[key], (res, err) => {
            if (res) {
                obj[key] = res;
                console.log(`[l10n] ${key} file loaded`);
                if (this.options.model && key !== 'model') {
                    this.checkInconsistencies(obj, key);
                }
                this.checkIfReady(obj);
            }
            else {
                console.log(`[l10n] Error loading ${key}`);
            }
        });
    }

    _getFile(path, cb) {
        this._get(path, (res) => {
            try {
                res = JSON.parse(res);
                cb(res, null);
            } catch (err) {
                console.warn(err, path, res);
                try {
                    cb(null, err);
                } catch (err) { }
            }
        })
    }

    checkIfReady(translations) {
        for (let t in translations) {
            if (!translations[t] || typeof translations[t] === 'string') return false;
        }

        this.callReady();
    }

    callReady() {
        if (this.options.ready) {
            try {
                this.options.ready(this);
            } catch (err) { }
        }
    }

    checkInconsistencies(obj, key) {
        let nfound = [];
        for (let m in this.options.model) {
            let found = false;
            for (let o in obj[key]) {
                if (m == o) {
                    found = true;
                }
            }

            if (!found) {
                nfound.push(m);
            }
        }
        console.warn(`[MODEL-CHECK] Key(s) "${nfound.join('", "')}" missing in ${key.toUpperCase()}`)
    }

    localyze(str, transform) {
        try {
            let actual = this.options.translation[this.options.language];
            let local_str = Array.isArray(str) ? str : ('' + str).split('.');
            let translation = [];
            for (let t = 0; t < local_str.length; t++) {
                let word = local_str[t].split('.');
                let translated = actual;
                for (let i = 0; i < word.length; i++) {
                    translated = translated[word[i]];
                }
                translation.push(translated);
            }
            actual = translation.join(' ');
            if (transform) return this._checkTransform(actual, transform);
            return actual;
        }
        catch (err) {
            return str[0];
        }
    }

    _checkTransform(str, t) {
        if (t === 'lower') return str.toLowerCase();
        if (t === 'upper') return str.toUpperCase();
        if (t === 'capitalize') return this._capitalizeFirstLetter(str);
        if (t === 'capitalize-all') return this._capitalizeAllLetters(str);
    }

    _capitalizeFirstLetter(str) {
        str = str.toLowerCase();
        return str.replace(/(^|\s)\S/, v => v.toUpperCase());
    }

    _capitalizeAllLetters(str) {
        return str.replace(/(^|\s)\S/g, v => v.toUpperCase());
    }

    get availableLanguages() {
        return Object.keys(this.options.translation);
    }

    get language() {
        return this.options.language;
    }

    set language(lang) {
        this.options.language = lang;
    }

    loadLanguage(lang, value) {
        this.options.translation[lang] = value;
        if (typeof value === 'string') {
            this._getTranslation(this.options.translation, lang);
        }
    }

    set(key, value) {
        this.options[key] = value;
    }

    _get(url, cb) {
        var newXHR = new XMLHttpRequest();
        newXHR.addEventListener('load', function () {
            cb(this.response);
        });
        newXHR.open('GET', url);
        newXHR.send();
    }
}

export default Localyze;