import { Denops, ensureString } from "./deps.ts";

export async function main(denops: Denops): Promise<void> {

  denops.dispatcher = {
    call_Defie(command:unknown, args:unknown): void {
      ensureString(command,args);
    }
  };
}


