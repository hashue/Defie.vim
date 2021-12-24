import { Denops, buffers, globals, ensureString } from "./deps.ts";

export async function start(denops:Denops, path:String): Promise<void> {
  path = await denops.call("expand", path);

  await denops.cmd(
    "setlocal filetype=defie buftype=nofile modifiable"
  );

  await buffers.set(denops, "base_path", path+ '/');

  let files:Array<String> = [];

  for await (const entry of Deno.readDir(path)) {

    if(!await showHidden(denops) && entry.name.startsWith('.'))
       continue;

    if(entry.isDirectory)
      entry.name+='/';

    files.push(entry.name);
  }

  files = sortAlphabet(files);

  await denops.call("deletebufline","%",1,"$")
  await denops.call("setline", 1, files);
  await denops.cmd("setlocal nomodifiable");
}


//Open file or sub directory
export async function defie_open(denops:Denops,args:unknown): Promise<void> {
  ensureString(args);
  const base_path:String = await buffers.get(denops, "base_path") as String;
  let filename:String = await denops.call("getline",".") as String ;
  let path = await denops.call("fnamemodify", `${base_path}${filename}`, ":p") as String; 


  if (path.endsWith('/')){
    deleteBuf(denops);
    await denops.cmd(`call feedkeys(":\\<C-u>Defie ${path.replace(/\/$/,"")}\\<CR>")`);
  } else {
    await denops.cmd(`call feedkeys(":\\<C-u>edit ${path}\\<CR>")`);
  }
}

//Move parent directory
export async function defie_up(denops:Denops): Promise<void> {

  let path = await buffers.get(denops, "base_path") as String;

  path = await denops.call("fnamemodify",path.replace(/\/$/,""),":p:h:h:gs!\\!/!");

  await denops.cmd(`call feedkeys(":\\<C-u>Defie ${path}\\<CR>")`);
}


async function deleteBuf(denops:Denops): Promise<void> {
  await denops.cmd("setlocal modifiable");
  await denops.call("silent","deletebufline","%",1,"$")
}


async function showHidden(denops:Denops): Promise<Boolean> {
  return (await globals.get(denops,"defie_show_hidden") as Number === 1) ? true : false;
}


type open_direction = "tabnew" | "vsplit";

async function initialize(denops:Denops, direction:open_direction): Promise<void> {
  await denops.cmd(direction);
}

function sortAlphabet(array:Array<String>):Array<String> {
  array = array.sort((a:String,b:String) => {
    a = a.toLowerCase();
    b = b.toLowerCase();
    return (a > b) ? 1 : (b > a) ? -1 : 0;
  });
  return array;
}
