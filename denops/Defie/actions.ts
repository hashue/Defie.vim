import { batch, Denops, fn } from "./deps.ts";

export class DefieActions {
  basePath = "";

  //
  // Actions
  //
  async start(denops: Denops, path: string): Promise<void> {
    this.basePath = (await denops.call("expand", path)) + "/";

    await this.walk(this.basePath).then((files) => {
      this.bufInit(denops, files);
    });
  }
  async open(denops: Denops, direct: string): Promise<void> {
    let path = await this.fullPath(denops, await denops.call("getline", "."));
    let cmd: string = "edit";

    if (path.endsWith("/")) cmd = "Defie";
    if (direct === "tab") cmd = "tabedit";
    if (direct === "vsplit") cmd = "vnew";

    this.vimFeedKeys(denops, cmd, path.replace(/\/$/, ""));
    await denops.cmd("setlocal modifiable buftype= ");
  }

  //
  //Utils
  //
  async bufInit(denops: Denops, files: Array<string>): Promise<void> {
    const bufnr = await fn.bufadd(denops, "Defie");
    await batch(denops, async (denops: Denops) => {
      await denops.cmd(`buffer ${bufnr}`);
      await denops.cmd(
        "setlocal filetype=defie buftype=nofile modifiable nobuflisted"
      );
      await denops.call("deletebufline", "%", 1, "$");
      await denops.call("setline", 1, files);
      await denops.cmd("setlocal nomodifiable");
    });
  }

  async walk(path: string): Promise<Array<string>> {
    let output: Array<string> = [];
    for await (const entry of Deno.readDir(path)) {
      if (entry.name.startsWith(".")) {
        continue;
      }

      if (entry.isDirectory) entry.name += "/";
      output.push(entry.name);
    }
    this.sortAlphabet(output);
    return output;
  }

  sortAlphabet(array: Array<string>): Array<string> {
    array = array.sort((a: string, b: string) => {
      a = a.toLowerCase();
      b = b.toLowerCase();
      if (a.endsWith("/") && !b.endsWith("/")) {
        return -1;
      } else if (!a.endsWith("/") && b.endsWith("/")) {
        return 1;
      }

      if (a < b) {
        return -1;
      } else if (a > b) {
        return 1;
      }
    });
    return array;
  }
  async fullPath(denops: Denops, filename: string): Promise<string> {
    return await denops.call(
      "fnamemodify",
      `${this.basePath}${filename}`,
      ":p"
    );
  }

  async vimFeedKeys(denops: Denops, cmd: string, arg: string): Promise<void> {
    await denops.cmd(`${cmd} ${arg}`);
  }
}

//Open file or sub directory
//export async function defieOpen(denops: Denops, direct: string): Promise<void> {
//  let path = await fullPath(denops, await denops.call("getline", "."));
//  let cmd: string = "edit";
//
//  if (path.endsWith("/")) cmd = "Defie";
//  if (direct === "tab") cmd = "tabedit";
//  if (direct === "vsplit") cmd = "vnew";
//
//  vimFeedKeys(denops, cmd, path.replace(/\/$/, ""));
//  await denops.cmd("setlocal modifiable buftype= ");
//}
//
////Move parent directory
//export async function defie_up(denops: Denops): Promise<void> {
//  let path = (await buffers.get(denops, "base_path")) as string;
//
//  path = await denops.call(
//    "fnamemodify",
//    path.replace(/\/$/, ""),
//    ":p:h:h:gs!\\!/!"
//  );
//
//  vimFeedKeys(denops, "Defie", path);
//}
//
//async function fullPath(denops: Denops, filename: string): Promise<string> {
//  const base = (await buffers.get(denops, "base_path")) as string;
//  return await denops.call("fnamemodify", `${base}${filename}`, ":p");
//}
