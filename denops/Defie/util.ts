import { batch, Denops, fn, globals } from "./deps.ts";
//
//Utils
//

export async function bufInit(
  denops: Denops,
  files: Array<string>
): Promise<void> {
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

export async function walk(
  denops: Denops,
  path: string
): Promise<Array<string>> {
  let output: Array<string> = [];
  const hiddenStat = await showHidden(denops);
  for await (const entry of Deno.readDir(path)) {
    if (!hiddenStat && entry.name.startsWith(".")) {
      continue;
    }

    if (entry.isDirectory) entry.name += "/";
    output.push(entry.name);
  }
  sortAlphabet(output);
  return output;
}

function sortAlphabet(array: Array<string>): Array<string> {
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

export async function showHidden(denops: Denops): Promise<boolean> {
  const stat = (await globals.get(denops, "defie_show_hidden")) as number;
  return stat === 1 ? true : false;
}
