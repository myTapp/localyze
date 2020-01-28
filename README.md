# localyze
minimalist localization tool for both node.js and browser

supports multifile translation and model diff

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
        console.log(localyze('input.valid', 'lower')); // toLowerCase
        console.log(localyze('input.warning', 'upper')); // toUpperCase
        console.log(localyze('input.error', 'capitalize')); // Capitalize
        console.log(localyze('input.error', 'capitalize-all')); // Capitalize Every Word
    }
});
```

- Add new file to translation: 
```javascript
localyze.addTranslationFile('pt-br', 'pt-br/dashboard.json', (success) => {
    console.log(success);
});
```