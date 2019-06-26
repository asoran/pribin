const exec = require('child_process').exec;

const child = exec('/Applications/YgoproLinks/Ygopro.app/Contents/MacOS/Ygopro',
    (error, stdout, stderr) => {
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        if (error !== null) {
            console.log(`exec error: ${error}`);
        }
});

console.log(child);