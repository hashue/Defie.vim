import { buffers, Denops, batch, globals } from "./deps.ts";
import { DefieUtil } from "./util.ts";

export async function start(denops: Denops, path: string): Promise<void> {
  const util = new DefieUtil(denops);

  path = await denops.call("expand", path);
  await buffers.set(denops, "base_path", path + "/");


  let files: Array<string> = [];

  await util.entriesGetter(path, await showHidden(denops), files);

  await batch(denops, async (denops:Denops) =>{
    await denops.call("bufadd","Defie");
    await denops.cmd("setlocal filetype=defie buftype=nofile modifiable nobuflisted");
    await denops.call("deletebufline", "%", 1, "$");
    await denops.call("setline", 1, files);
    await denops.cmd("setlocal nomodifiable");
  });
}


//Open file or sub directory
export async function defie_open(denops: Denops, direct:string): Promise<void> {
  let path = await makeFullPath(denops,await denops.call("getline","."))
  let cmd:string = "edit";

  if (path.endsWith("/")) {
    cmd = "Defie";
  }

  if(direct === "tab") cmd = "tabedit"
  if(direct === "vsplit") cmd = "vnew"

  callVimFeedKeys(denops, cmd, path.replace(/\/$/,""));
  await denops.cmd("setlocal modifiable");
}

//Move parent directory
export async function defie_up(denops: Denops): Promise<void> {
  let path = await buffers.get(denops, "base_path") as string;

  path = await denops.call(
    "fnamemodify",
    path.replace(/\/$/, ""),
    ":p:h:h:gs!\\!/!",
  );

  callVimFeedKeys(denops, "Defie", path)
}


async function showHidden(denops: Denops): Promise<boolean> {
  if (await globals.get(denops, "defie_show_hidden") === 1){
    return true;
  }else{
    return false;
  }
}

async function makeFullPath(denops: Denops,filename:string): Promise<string> {
  const base =  await buffers.get(denops, "base_path") as string;
  return await denops.call("fnamemodify",`${base}${filename}`,":p");
}

async function callVimFeedKeys(denops:Denops, cmd:string, arg:string): Promise<void> {
  await denops.cmd(`call feedkeys(":\\<C-u>${cmd} ${arg}\\<CR>")`);
}
