import { Denops } from "./deps.ts";
import { DefieActions } from "./actions.ts";

type ArgType = {
  path: string;
  action: string;
  direction: string;
};

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
          actions.up(denops);
          break;
        case "toggleShowHidden":
          actions.toggleShowHidden(denops);
          break;
        case "mkdir":
          actions.mkdir(denops);
          break;
        default:
          actions.start(denops, validated_args.path);
      }
    },
  };
}
