import { Denops, ensureString } from "./deps.ts";
import { defie_open, defie_up, start } from "./util.ts";

export async function main(denops: Denops): Promise<void> {
  denops.dispatcher = {
    call_Defie(command: unknown, args: unknown): void {
      ensureString(command, args);

      switch (args) {
        case "open":
          defie_open(denops);
          break;
        case "up":
          defie_up(denops);
          break;
        default:
          start(denops, args);
      }
    },
  };
}
