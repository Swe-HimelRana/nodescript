const { promisify } = require('util');
const { resolve } = require('path');
const fs = require('fs');
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

async function getFiles(dir) {
  const subdirs = await readdir(dir);
  const files = await Promise.all(subdirs.map(async (subdir) => {
    const res = resolve(dir, subdir);
    return (await stat(res)).isDirectory() ? getFiles(res) : res;
  }));
  return files.reduce((a, f) => a.concat(f), []);
}

arguments = process.argv.slice(2)

search_str = arguments[0]
replace_str = arguments[1]

function rename_file(oldName, newName){
    fs.rename(oldName, newName, function(err){
        console.log("Renamed")
    })
}


getFiles(__dirname)
  .then(files => {
    // Search 
    for(index in files){
        single_file = files[index]
        if(single_file.includes(search_str)){
            console.log("Found: " + search_str + " : " + single_file)
            new_name = single_file.replace(search_str, replace_str)

            rename_file(single_file, new_name)

        }
       // console.log("File", files[index])
    }
    //console.log(files)
    // newfiles_array.push(files)
    // console.log(arguments)
    // console.log("new Files array", newfiles_array)

  })
  .catch(e => console.error(e));