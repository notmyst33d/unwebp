const { watch } = require('fs/promises')
const { exec } = require('child_process')
async function watchDir(directory) {
    for await (const event of watch(directory)) {
        if (event.eventType == 'change' && event.filename.endsWith('.webp')) {
            console.log('Reencoding ' + event.filename + ' to PNG')
            exec('ffmpeg -y -i ' + directory + '/' + event.filename + ' ' + directory + '/' + event.filename.replace('.webp', '.png'), { }, function (error, stdout, stderr) {
                if (error) console.log('Reencoding failed with exit code ' + error.code)
            })
        }
    }
}
watchDir('.')
for (const directory of process.argv.slice(2))
    watchDir(directory)
console.log('Waiting for .webp files')
