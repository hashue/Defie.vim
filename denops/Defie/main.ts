import { Denops, ensureString } from "./deps.ts";
import { defie_open, defie_up, start } from "./actions.ts";

export async function main(denops: Denops): Promise<void> {
  denops.dispatcher = {
    call_Defie(args: unknown): void {
      console.log(args);
      ensureString(args);

      switch (args) {
        case "open":
          defie_open(denops,args);
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
