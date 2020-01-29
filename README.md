# localyze

minimalist localization tool for both node.js and browser. Supports multi-file translation and model diff.

## Installation

```sh
npm i --save localyze
```

## Usage

```javascript
new Localyze({
    language: 'pt-br',
    translation: {
        'pt-br': 'pt-br/pt-br.json'
    },
    ready: ({ localyze }) => {
        console.log(localyze`admin.reboot`);
    }
});
```

`pt-br/pt-br.json ⇣`

```json
{
    "admin": {
        "reboot": "Reiniciar"
    }
}
```

#### Multi-file example

```javascript
new Localyze({
    language: 'pt-br',
    model: 'model.json',
    translation: {
        'pt-br': ['pt-br/login.json', 'pt-br/home.json'],
        'es-esp': ['es-esp/login.json', 'es-esp/home.json']
    },
    ready: ({ localyze }) => {
        console.log(localyze`admin.reboot`);
    }
});
```

#### Model diff

TODO

#### Add new file to translation

```javascript
localyze.addTranslationFile('pt-br', 'pt-br/dashboard.json', (success) => {
    console.log(success);
});
```

#### Transform output
```javascript
localyze('input.valid', 'lower') // toLowerCase
localyze('input.warning', 'upper') // toUpperCase
localyze('input.error', 'capitalize') // Capitalize
localyze('input.error', 'title') // Capitalize Every Word
```

## License
[ISC](LICENSE.md) © myTapp software