import { Denops } from "./deps.ts";

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
}
