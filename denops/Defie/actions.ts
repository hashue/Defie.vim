import { batch, Denops, input, fn, globals } from "./deps.ts";
import { bufInit, walk } from "./util.ts";

export class DefieActions {
  basePath = "";

  //
  // Actions
  //

  async start(denops: Denops, path: string): Promise<void> {
    this.basePath = (await denops.call("expand", path)) + "/";

    walk(denops, this.basePath).then((files) => {
      bufInit(denops, files);
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
}
