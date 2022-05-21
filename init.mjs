
import nunjucks from "nunjucks";
import markdown from "nunjucks-markdown";
import { marked } from "marked";

export function configureNunjucks(app) {
    const nunjucksEnv = nunjucks.configure("views", {
      autoescape: true,
      express: app,
    });
  
    nunjucksEnv.addFilter("json", function (value, spaces) {
      if (value instanceof nunjucks.runtime.SafeString) {
        value = value.toString();
      }
      const jsonString = JSON.stringify(value, null, spaces).replace(
        /</g,
        "\\u003c"
      );
      return nunjucks.runtime.markSafe(jsonString);
    });
    nunjucksEnv.addFilter("slug", function (value, spaces) {
      const slugify = (input) => {
        return input
          .toString()
          .toLowerCase()
          .replace(/\s+/g, "-") // Replace spaces with -
          .replace(/[^\w\-]+/g, "") // Remove all non-word chars
          .replace(/\-\-+/g, "-") // Replace multiple - with single -
          .replace(/^-+/, "") // Trim - from start of text
          .replace(/-+$/, ""); // Trim - from end of text
      };
      if (value instanceof nunjucks.runtime.SafeString) {
        value = value.toString();
      }
      const slug = slugify(value);
      return nunjucks.runtime.markSafe(slug);
    });
  
    nunjucksEnv.addFilter("date", function (value, spaces) {
      if (value instanceof nunjucks.runtime.SafeString) {
        value = value.toString();
      }
      const dateValue = new Date(value);
      return nunjucks.runtime.markSafe(dateValue.toLocaleDateString("fr"));
    });
    markdown.register(nunjucksEnv, marked);
}