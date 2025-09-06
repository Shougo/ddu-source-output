import type { Context, Item } from "@shougo/ddu-vim/types";
import { BaseSource } from "@shougo/ddu-vim/source";

import type { ActionData } from "@shougo/ddu-kind-word";

import type { Denops } from "@denops/std";
import * as fn from "@denops/std/function";

type Params = {
  command: string;
};

export class Source extends BaseSource<Params> {
  override kind = "word";

  #output = "";

  override async onInit(args: {
    denops: Denops;
    sourceParams: Params;
  }): Promise<void> {
    this.#output = await fn.execute(args.denops, args.sourceParams.command);
  }

  override gather(_args: {
    denops: Denops;
    context: Context;
    sourceParams: Params;
  }): ReadableStream<Item<ActionData>[]> {
    const output = this.#output;

    return new ReadableStream({
      start(controller) {
        const items = output.split(/\n/).slice(1).map((line, _) => {
          return {
            word: line,
            action: {
              text: line,
            },
          };
        });

        controller.enqueue(items);

        controller.close();
      },
    });
  }

  override params(): Params {
    return {
      command: "",
    };
  }
}
