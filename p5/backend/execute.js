const { spawn } = require('child_process');
const ls = spawn('mpirun', ['-np', '4', 'bin/mpi.run', 'image.jpeg', '2.5']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});