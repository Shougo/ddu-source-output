import {
  BaseSource,
  Context,
  Item,
} from "https://deno.land/x/ddu_vim@v2.8.4/types.ts";
import { Denops, fn } from "https://deno.land/x/ddu_vim@v2.8.4/deps.ts";

type Params = {
  command: string;
};

export class Source extends BaseSource<Params> {
  override kind = "word";

  private output = "";

  override async onInit(args: {
    denops: Denops;
    sourceParams: Params;
  }): Promise<void> {
    this.output = await fn.execute(args.denops, args.sourceParams.command);
  }

  override gather(args: {
    denops: Denops;
    context: Context;
    sourceParams: Params;
  }): ReadableStream<Item<ActionData>[]> {
    const output = this.output;

    return new ReadableStream({
      async start(controller) {
        const items = output.split(/\n/).slice(1).map((line, i) => {
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
