function logFactory(logFunction, customPrefix = '') {
    return function (argument, ...additionalArguments) {
        const datePrefix = '[' + (new Date()).toISOString() + ']';
        const prefix = `${customPrefix}${datePrefix}`;

        if (typeof argument === 'string') {
            additionalArguments.unshift(`${prefix} ${argument}`);
        } else {
            additionalArguments.unshift(`${prefix} %o`, argument);
        }

        logFunction.apply(this, additionalArguments);
    };
}

console.log = logFactory(console.log);
console.warn = logFactory(console.warn, '[WARNING]');