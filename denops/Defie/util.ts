import { Denops, buffers, globals, ensureString } from "./deps.ts";

export async function start(denops:Denops, path:string): Promise<void> {
  path = await denops.call("expand", path);

  await denops.cmd(
    "setlocal filetype=defie buftype=nofile modifiable"
  );

  await buffers.set(denops, "base_path", path+ '/');

  let files:Array<string> = [];

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
export async function defie_open(denops:Denops): Promise<void> {
  const base_path:string = await buffers.get(denops, "base_path") as string;
  let filename:string = await denops.call("getline",".") as string ;
  let path = await denops.call("fnamemodify", `${base_path}${filename}`, ":p") as string; 


  if (path.endsWith('/')){
    deleteBuf(denops);
    await denops.cmd(`call feedkeys(":\\<C-u>Defie ${path.replace(/\/$/,"")}\\<CR>")`);
  } else {
    await denops.cmd(`call feedkeys(":\\<C-u>edit ${path}\\<CR>")`);
  }
}

//Move parent directory
export async function defie_up(denops:Denops): Promise<void> {

  let path = await buffers.get(denops, "base_path") as string;

  path = await denops.call("fnamemodify",path.replace(/\/$/,""),":p:h:h:gs!\\!/!");

  await denops.cmd(`call feedkeys(":\\<C-u>Defie ${path}\\<CR>")`);
}


async function deleteBuf(denops:Denops): Promise<void> {
  await denops.cmd("setlocal modifiable");
  await denops.call("deletebufline","%",1,"$")
}


async function showHidden(denops:Denops): Promise<boolean> {
  return (await globals.get(denops,"defie_show_hidden") as number === 1) ? true : false;
}

function sortAlphabet(array:Array<string>):Array<string> {
  array = array.sort((a:string,b:string) => {
    a = a.toLowerCase();
    b = b.toLowerCase();
    return (a > b) ? 1 : (b > a) ? -1 : 0;
  });
  return array;
}
