import {
  BaseSource,
  Context,
  Item,
} from "https://deno.land/x/ddu_vim@v3.9.0/types.ts";
import { Denops, fn } from "https://deno.land/x/ddu_vim@v3.9.0/deps.ts";
import { ActionData } from "https://deno.land/x/ddu_kind_word@v0.2.1/word.ts";

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
