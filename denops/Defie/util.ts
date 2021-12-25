import { buffers, Denops, ensureString, globals } from "./deps.ts";

export class DefieUtil {
  constructor(public denops: Denops) {
    this.denops = denops;
  }

  async entriesGetter(
    path: string,
    showHidden: boolean,
    output: Array<string>,
  ): Promise<Array<string>> {
    for await (const entry of Deno.readDir(path)) {
      if (!showHidden && entry.name.startsWith(".")) {
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
      return (a > b) ? 1 : (b > a) ? -1 : 0;
    });
    return array;
  }
}
