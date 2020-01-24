# localyze
minimalist localization tool for both node.js and browser, supports multifile translation and model diff

```javascript
new Localyze({
        language: 'pt-br',
        model: 'model.json',
        translation: {
            'pt-br': ['pt-br/index.json', 'pt-br/home.json']
        },
        ready: (localyze) => {
            
        }
});
```
