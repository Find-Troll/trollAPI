const spawn = require('child_process').spawn;


const foo = async()=>{
	const pythonProcess = await spawn('python3', ["./test.py", '행복한패배']);
	console.log(pythonProcess);
}

foo();
