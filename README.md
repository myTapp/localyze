# localyze
minimalist localization tool for both node.js and browser

supports multifile translation and model diff

```sh
npm i localyze
```

- browser 
```javascript
import Localyze from 'localyze';
```

- node
```javascript
const Localyze = require('localyze');
```

- quick-start
```javascript
new Localyze({
    language: 'pt-br',
    translation: {
        'pt-br': 'pt-br/pt-br.json'
    },
    ready: ({ localyze }) => {
        console.log(localyze`input.invalid`);
    }
});
```
- multifile example
```javascript
new Localyze({
    language: 'pt-br',
    model: 'model.json',
    translation: {
        'pt-br': ['pt-br/login.json', 'pt-br/home.json'],
        'es-esp': ['es-esp/login.json', 'es-esp/home.json']
    },
    ready: ({ localyze }) => {
        console.log(localyze`input.invalid`);
    }
});
```

- add new file to translation: 
```javascript
localyze.addTranslationFile('pt-br', 'pt-br/dashboard.json', (success) => {
    console.log(success);
});
```

- transform output
```javascript
localyze('input.valid', 'lower') // toLowerCase
localyze('input.warning', 'upper') // toUpperCase
localyze('input.error', 'capitalize') // Capitalize
localyze('input.error', 'title') // Capitalize Every Word
```
