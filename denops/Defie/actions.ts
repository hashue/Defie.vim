import { batch, Denops, input, fn, globals } from "./deps.ts";

export class DefieActions {
  basePath = "";

  //
  // Actions
  //

  async start(denops: Denops, path: string): Promise<void> {
    this.basePath = (await denops.call("expand", path)) + "/";

    await this.showHidden(denops).then((isShowHidden) => {
      this.walk(this.basePath, isShowHidden).then((files) => {
        this.bufInit(denops, files);
      });
    });
  }

  async open(denops: Denops, direct: string): Promise<void> {
    let path = await this.fullPath(denops, await denops.call("getline", "."));
    path = await denops.call("fnameescape", path);

    let cmd: string = "edit";

    if (path.endsWith("/")) cmd = "Defie";
    if (direct === "tab") cmd = "tabedit";
    if (direct === "vsplit") cmd = "vnew";

    this.excuteCmd(denops, cmd, path.replace(/\/$/, "")).then(() => {
      denops.cmd("setlocal modifiable buftype= ");
    });
  }

  async up(denops: Denops): Promise<void> {
    let path = this.basePath;

    path = await denops.call(
      "fnamemodify",
      path.replace(/\/$/, ""),
      ":p:h:h:gs!\\!/!"
    );

    this.excuteCmd(denops, "Defie", path);
  }

  async toggleShowHidden(denops: Denops): Promise<void> {
    if (await this.showHidden(denops)) {
      await globals.set(denops, "defie_show_hidden", 0);
    } else {
      await globals.set(denops, "defie_show_hidden", 1);
    }
    this.excuteCmd(denops, "Defie", this.basePath);
  }

  async mkdir(denops: Denops): Promise<void> {
    let name = (await input(denops, { prompt: "directory name: " })) as string;
    Deno.mkdirSync(name);
    this.excuteCmd(denops, "Defie", this.basePath);
  }

  async remove(denops: Denops): Promise<void> {
    await this.fullPath(denops, await denops.call("getline", ".")).then(
      (name: string) => {
        Deno.removeSync(name);
      }
    );
    this.excuteCmd(denops, "Defie", this.basePath);
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

  async walk(path: string, ignoreHidden: boolean): Promise<Array<string>> {
    let output: Array<string> = [];
    for await (const entry of Deno.readDir(path)) {
      if (!ignoreHidden && entry.name.startsWith(".")) {
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

      return a < b ? -1 : 1;
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

  async excuteCmd(denops: Denops, cmd: string, arg: string): Promise<void> {
    await denops.cmd(`${cmd} ${arg}`);
  }

  async showHidden(denops: Denops): Promise<boolean> {
    return ((await globals.get(denops, "defie_show_hidden")) as number) === 1
      ? true
      : false;
  }
}
