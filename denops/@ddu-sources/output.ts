import {
  type Context,
  type Item,
} from "jsr:@shougo/ddu-vim@~6.1.0/types";
import {
  BaseSource,
} from "jsr:@shougo/ddu-vim@~6.1.0/source";

import { type ActionData } from "jsr:@shougo/ddu-kind-word@~0.4.0";

import type { Denops } from "jsr:@denops/core@~7.0.0";
import * as fn from "jsr:@denops/std@~7.1.0/function";

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
