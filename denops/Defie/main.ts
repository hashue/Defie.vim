import { Denops } from "./deps.ts";
//import { defie_up, defieOpen, start } from "./actions.ts";
import { DefieActions } from "./actions.ts";
import { ArgType } from "./types.ts";

export async function main(denops: Denops): Promise<void> {
  const actions = new DefieActions();
  denops.dispatcher = {
    call_Defie(args: unknown): void {
      const validated_args = args as ArgType;

      switch (validated_args.action) {
        case "open":
          actions.open(denops, validated_args.direction);
          break;
        case "up":
          //defie_up(denops);
          break;
        default:
          actions.start(denops, validated_args.path);
      }
    },
  };
}
