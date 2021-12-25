import { buffers, Denops, batch, globals } from "./deps.ts";
import { DefieUtil } from "./util.ts";

export async function start(denops: Denops, path: string): Promise<void> {
  const util = new DefieUtil(denops);

  path = await denops.call("expand", path);
  await buffers.set(denops, "base_path", path + "/");

  await denops.cmd("setlocal filetype=defie buftype=nofile modifiable");

  let files: Array<string> = [];

  await util.entriesGetter(path, showHidden(denops), files);

  await batch(denops, async (denops:Denops) =>{
    await denops.call("deletebufline", "%", 1, "$");
    await denops.call("setline", 1, files);
    await denops.cmd("setlocal nomodifiable");
  });
}



//Open file or sub directory
export async function defie_open(denops: Denops): Promise<void> {
  let filename = await denops.call("getline", ".") as string;
  let path = await denops.call(
    "fnamemodify",
    `${await fetchBasePath(denops)}${filename}`,
    ":p",
  ) as string;

  if (path.endsWith("/")) {
    deleteBuf(denops);
    callVimFeedKeys(denops, "Defie", path.replace(/\/$/, ""));
  } else {
    callVimFeedKeys(denops, "edit", path);
  }
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

async function deleteBuf(denops: Denops): Promise<void> {
  await denops.cmd("setlocal modifiable");
  await denops.call("deletebufline", "%", 1, "$");
}

async function showHidden(denops: Denops): Promise<boolean> {
  return (await globals.get(denops, "defie_show_hidden") as number === 1)
    ? true
    : false;
}

async function fetchBasePath(denops: Denops): Promise<string> {
  return await buffers.get(denops, "base_path") as string;
}

async function callVimFeedKeys(denops:Denops, cmd:string, arg:string): Promise<void> {
  await denops.cmd(`call feedkeys(":\\<C-u>${cmd} ${arg}\\<CR>")`);
}
