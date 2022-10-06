const { watch } = require('fs/promises')
const { exec } = require('child_process')

console.log('unwebp')

async function watchDir(directory) {
    for await (const event of watch(directory)) {
        if (event.eventType == 'change') {
            console.log('Reencoding ' + event.filename + ' to PNG')
            exec('ffmpeg -i ' + directory + '/' + event.filename + ' ' + directory + '/' + event.filename.replace('.webp', '.png'), { }, function (error, stdout, stderr) {
                if (error) {
                    console.log('Reencoding failed with exit code ' + error.code)
                    return
                }
            })
        }
    }
}

async function main() {
    const tasks = []

    tasks.push(watchDir('.'))

    for (const directory of process.argv.slice(2))
        tasks.push(watchDir(directory))

    await Promise.all(tasks)
}

main()
