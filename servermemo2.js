import { serveAPI } from "https://js.sabae.cc/wsutil.js";
import { Base64URL } from "https://code4fukui.github.io/Base64URL/Base64URL.js";
import * as sec from "https://code4fukui.github.io/sec.js/sec.js";
import { getEnv } from "https://js.sabae.cc/getEnv.js";

const spubkey = await getEnv("PUBKEY");
const pubkey = Base64URL.decode(spubkey);
const prikey = Base64URL.decode(await getEnv("PRIKEY"));

await Deno.mkdir("static/data", { recursive: true });

serveAPI("/api/", async (param, req, path, conninfo) => {
  if (path.startsWith("/api/")) {
    const n = path.indexOf("/", 5);
    const spubkey2 = path.substring(5, n);
    if (spubkey2 != spubkey) return;
    if (req.method == "POST") {
      const fn = path.substring(n + 1);
      const sharekey = sec.sharekey(prikey, param.userpubkey);
      const data = sec.decrypt(sharekey, param.data);
      const path2 = "static/data/" + Base64URL.encode(param.userpubkey);
      try {
        await Deno.mkdir(path2, { recursive: true });
      } catch (e) {
      }
      await Deno.writeFile(path2 + "/" + fn, data);
      return "ok";
    }
  }
});
