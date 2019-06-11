class Localize {
    constructor(options) {
        let default_options = {
            language: 'en',
            translation: {},
            global: false,
            model: null
        };
        this.options = Object.assign(default_options, options);

        if (this.options.global === true) {
            window.localize = this.localize;
            window.localize = window.localize.bind(this);
        }

        if (this.options.model && typeof this.options.model === 'string') {
            this._getTranslation(this.options, 'model');
        }

        this.checkTranslations();
    }

    checkTranslations() {
        for (let t in this.options.translation) {
            let translation = typeof this.options.translation[t];
            if (typeof translation === 'string') {
                this._getTranslation(this.options.translation, t);
            }
        }
    }

    _getTranslation(obj, key) {
        this._get(obj[key], (res) => {
            try {
                res = JSON.parse(res);
                obj[key] = res;
                console.log(`[l10n] ${key} file loaded`);
                if (this.options.model) {
                    this.checkInconsistencies(obj, key);
                }
            } catch (err) { console.warn(err); }
        })
    }

    checkInconsistencies(obj, key) {
        let nfound = [];
        for (let m in this.options.model) {
            let found = false;
            for (let o in obj[key]) {
                if (m === o) {
                    found = true;
                }
            }

            if (!found) {
                nfound.push(m);
                console.warn(`[${key.toUpperCase()}] Key "${m}" not found`)
            }
        }
    }

    localize(str) {
        try {
            let local_str = ('' + str).split('.');
            let actual = this.options.translation[this.options.language];
            for (let t = 0; t < local_str.length; t++) {
                actual = actual[local_str[t]]
            }
            return actual;
        }
        catch (err) {
            return str[0];
        }
    }

    getAvailableLanguages() {
        let langs = [];
        for (let l in this.options.translation) {
            langs.push(l);
        }
        return langs;
    }

    getLanguage() {
        return this.options.language;
    }

    setLanguage(lang) {
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

export default Localize;