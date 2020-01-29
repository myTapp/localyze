const Localyze = require('../src/lib.js');

let l = new Localyze({
    language: 'pt-br',
    translation: {
        'pt-br': [require('./pt-br.json'), require('./pt-br/home.json')]
    },
    model: require('./model.json')
});

console.log(l.localyze`Testing strings`);
console.log(l.localyze`admin.reboot`);
console.log(l.localyze(['admin.reboot', 'Testing more!']));