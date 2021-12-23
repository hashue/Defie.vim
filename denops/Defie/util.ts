import { Denops, buffers } from "./deps.ts";

export async function start(denops:Denops, path:String): Promise<void> {
  path = await denops.call("expand", path);

  await buffers.set(denops, "base_path", path+ '/');

  await denops.cmd(
    "setlocal filetype=defie buftype=nofile modifiable"
  );

  let files:Array<String> = [];

  for await (const entry of Deno.readDir(path)) {

    if(entry.isDirectory)
      entry.name+='/';

    files.push(entry.name);
  }

  await denops.call("setline", 1, files);
  await denops.cmd("setlocal nomodifiable");
}


//Open file or sub directory
export async function defie_open(denops:Denops): Promise<void> {
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

async function deleteBuf(denops:Denops): Promise<void> {
  await denops.cmd("setlocal modifiable");
  await denops.call("deletebufline","%",1,"$")
  await denops.cmd("setlocal nomodifiable");
}
