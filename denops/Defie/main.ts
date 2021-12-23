import { Denops, ensureString } from "./deps.ts";
import { defie_open, start } from "./util.ts";

export async function main(denops: Denops): Promise<void> {
  denops.dispatcher = {
    call_Defie(command: unknown, args: unknown): void {
      ensureString(command, args);

      console.log(args);
      switch (args) {
        case "open":
          defie_open(denops);
          break;
        default:
          start(denops, args);
      }
    },
  };
}
