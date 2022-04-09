import { Denops, input, globals, Path } from "./deps.ts";
import { bufInit, walk, showHidden } from "./util.ts";

export class DefieActions {
  basePath = "";

  //
  // Actions
  //

  async start(denops: Denops, path: string): Promise<void> {
    this.basePath = `${await denops.call("expand", path)}/`;

    walk(denops, this.basePath).then((files: Array<string>) => {
      bufInit(denops, files);
    });
  }

  async open(denops: Denops, direct: string): Promise<void> {
    let path = Path.join(this.basePath, await denops.call("getline", "."));

    path = await denops.call("fnameescape", path);

    let cmd: string = "edit";

    if (path.endsWith("/")) cmd = "Defie";
    if (direct === "tab") cmd = "tabedit";
    if (direct === "vsplit") cmd = "vnew";

    await denops.cmd(`${cmd} ${path.replace(/\/$/, "")}`).then(() => {
      denops.cmd("setlocal modifiable buftype= ");
    });
  }

  async up(denops: Denops): Promise<void> {
    await denops.cmd(`Defie ${Path.dirname(this.basePath)}`);
  }

  async toggleShowHidden(denops: Denops): Promise<void> {
    if (await showHidden(denops)) {
      await globals.set(denops, "defie_show_hidden", 0);
    } else {
      await globals.set(denops, "defie_show_hidden", 1);
    }
    await denops.cmd(`Defie ${this.basePath}`);
  }

  async mkdir(denops: Denops): Promise<void> {
    let name = (await input(denops, { prompt: "directory name: " })) as string;
    Deno.mkdirSync(Path.join(this.basePath, name));
    await denops.cmd(`Defie ${this.basePath}`);
  }

  async createFile(denops: Denops): Promise<void> {
    let name = (await input(denops, { prompt: "file name: " })) as string;
    Deno.create(Path.join(this.basePath, name));
    await denops.cmd(`Defie ${this.basePath}`);
  }

  async remove(denops: Denops): Promise<void> {
    await denops.call("getline", ".").then((name: string) => {
      input(denops, { prompt: "are you sure ?(y/n) : " }).then((res) => {
        if (res === "y")
          Deno.removeSync(Path.join(this.basePath, name), { recursive: true });
        denops.cmd(`Defie ${this.basePath}`);
      });
    });
  }
}
