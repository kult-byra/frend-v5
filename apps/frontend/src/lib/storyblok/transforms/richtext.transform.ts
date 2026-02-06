import "server-only";

// ---------- TipTap Types ----------

type TipTapMark = {
  type: string;
  attrs?: Record<string, unknown>;
};

type TipTapNode = {
  type: string;
  text?: string;
  marks?: TipTapMark[];
  content?: TipTapNode[];
  attrs?: Record<string, unknown>;
};

export type TipTapDoc = {
  type: "doc";
  content: TipTapNode[];
};

// ---------- Portable Text Types ----------

export type PTSpan = {
  _type: "span";
  _key: string;
  text: string;
  marks: string[];
};

export type PTMarkDef = {
  _type: string;
  _key: string;
  [key: string]: unknown;
};

export type PTBlock = {
  _type: "block";
  _key: string;
  style: string;
  markDefs: PTMarkDef[];
  children: PTSpan[];
  listItem?: string;
  level?: number;
};

// ---------- Key Generation ----------

let keyCounter = 0;

export function generateKey(): string {
  return `k${Date.now().toString(36)}${(keyCounter++).toString(36)}`;
}

export function resetKeyCounter() {
  keyCounter = 0;
}

// ---------- Public API ----------

/** Convert a TipTap document to Portable Text blocks */
export function tipTapToPortableText(doc: TipTapDoc | null | undefined): PTBlock[] {
  if (!doc?.content) return [];

  const blocks: PTBlock[] = [];

  for (const node of doc.content) {
    switch (node.type) {
      case "paragraph":
        blocks.push(convertParagraph(node));
        break;
      case "heading":
        blocks.push(convertHeading(node));
        break;
      case "bullet_list":
        blocks.push(...convertList(node, "bullet"));
        break;
      case "ordered_list":
        blocks.push(...convertList(node, "number"));
        break;
      case "hard_break":
        break;
      default:
        console.warn(`[richtext] Unknown TipTap node type: ${node.type}`);
        break;
    }
  }

  return blocks;
}

/** Convert a plain text string to a single Portable Text block */
export function plainTextToPortableText(text: string, style = "normal"): PTBlock[] {
  if (!text?.trim()) return [];

  return [
    {
      _type: "block",
      _key: generateKey(),
      style,
      markDefs: [],
      children: [
        {
          _type: "span",
          _key: generateKey(),
          text: text.trim(),
          marks: [],
        },
      ],
    },
  ];
}

// ---------- Node Converters ----------

function convertParagraph(node: TipTapNode): PTBlock {
  const { spans, markDefs } = convertTextContent(node.content ?? []);
  return {
    _type: "block",
    _key: generateKey(),
    style: "normal",
    markDefs,
    children: spans.length > 0 ? spans : emptySpan(),
  };
}

function convertHeading(node: TipTapNode): PTBlock {
  const level = (node.attrs?.level as number) ?? 2;
  const style = `h${Math.min(Math.max(level, 2), 4)}`;
  const { spans, markDefs } = convertTextContent(node.content ?? []);
  return {
    _type: "block",
    _key: generateKey(),
    style,
    markDefs,
    children: spans.length > 0 ? spans : emptySpan(),
  };
}

function convertList(node: TipTapNode, listType: "bullet" | "number"): PTBlock[] {
  const blocks: PTBlock[] = [];

  for (const listItem of node.content ?? []) {
    if (listItem.type !== "list_item") continue;

    for (const child of listItem.content ?? []) {
      if (child.type === "paragraph") {
        const { spans, markDefs } = convertTextContent(child.content ?? []);
        blocks.push({
          _type: "block",
          _key: generateKey(),
          style: "normal",
          listItem: listType,
          level: 1,
          markDefs,
          children: spans.length > 0 ? spans : emptySpan(),
        });
      } else if (child.type === "bullet_list" || child.type === "ordered_list") {
        const nestedType = child.type === "bullet_list" ? "bullet" : "number";
        const nestedBlocks = convertList(child, nestedType);
        for (const block of nestedBlocks) {
          block.level = (block.level ?? 1) + 1;
        }
        blocks.push(...nestedBlocks);
      }
    }
  }

  return blocks;
}

// ---------- Text / Mark Converters ----------

function convertTextContent(content: TipTapNode[]): {
  spans: PTSpan[];
  markDefs: PTMarkDef[];
} {
  const spans: PTSpan[] = [];
  const markDefs: PTMarkDef[] = [];

  for (const node of content) {
    if (node.type === "text") {
      const { span, defs } = convertTextNode(node);
      spans.push(span);
      markDefs.push(...defs);
    } else if (node.type === "hard_break") {
      const lastSpan = spans[spans.length - 1];
      if (lastSpan) {
        lastSpan.text += "\n";
      } else {
        spans.push({ _type: "span", _key: generateKey(), text: "\n", marks: [] });
      }
    }
  }

  return { spans, markDefs };
}

function convertTextNode(node: TipTapNode): {
  span: PTSpan;
  defs: PTMarkDef[];
} {
  const marks: string[] = [];
  const defs: PTMarkDef[] = [];

  for (const mark of node.marks ?? []) {
    switch (mark.type) {
      case "bold":
        marks.push("strong");
        break;
      case "italic":
        marks.push("em");
        break;
      case "underline":
        // No underline in Sanity PT — map to em as fallback
        marks.push("em");
        break;
      case "link": {
        const key = generateKey();
        marks.push(key);
        defs.push({
          _type: "link",
          _key: key,
          href: (mark.attrs?.href as string) ?? "",
        });
        break;
      }
      case "styled":
      case "textStyle":
        // Storyblok styling artifacts — skip
        break;
      default:
        console.warn(`[richtext] Unknown TipTap mark type: ${mark.type}`);
        break;
    }
  }

  return {
    span: {
      _type: "span",
      _key: generateKey(),
      text: node.text ?? "",
      marks,
    },
    defs,
  };
}

// ---------- Helpers ----------

function emptySpan(): PTSpan[] {
  return [{ _type: "span", _key: generateKey(), text: "", marks: [] }];
}
