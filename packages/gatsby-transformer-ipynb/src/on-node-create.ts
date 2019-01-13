import NotebookRender from "@nteract/notebook-render";
import crypto from "crypto";
import React from "react";
import ReactDOMServer from "react-dom/server";

export type Node = {
  extension: string;
  absolutePath: string;
  id: string;
  json: { [key: string]: any };
  html: string;
  children: any[];
  content: string;
  parent: string;
  fileAbsolutePath: string;
  metadata: { [key: string]: any };
  internal: {
    content?: string;
    contentDigest?: string;
    type?: string;
  };
};

module.exports = async function onCreateNode(
  {
    node,
    loadNodeContent,
    boundActionCreators
  }: {
    node: Node;
    loadNodeContent: (node: Node) => string;
    boundActionCreators: {
      createNode: Function;
      createParentChildLink: Function;
    };
  },
  pluginOptions: object // eslint-disable-line no-unused-vars
) {
  const { createNode, createParentChildLink } = boundActionCreators;

  // Filter out non-ipynb content by file extension and checkpoint notebooks
  if (
    node.extension !== `ipynb` ||
    String(node.absolutePath).includes(`.ipynb_checkpoints`)
  ) {
    return;
  }
  // see: http://jupyter.readthedocs.io/en/latest/reference/mimetype.html
  // if (node.internal.mediaType !== `application/x-ipynb+json`) {
  //   return
  // }

  const content: string = await loadNodeContent(node);

  const jupyterNode: Partial<Node> = {
    id: `${node.id} >>> JupyterNotebook`,
    children: [],
    parent: node.id,
    internal: {
      content,
      type: `JupyterNotebook`
    }
  };

  jupyterNode.json = JSON.parse(content);

  jupyterNode.metadata = jupyterNode.json!.metadata;

  // render statically html with @nteract/notebook-render element
  const reactComponent = React.createElement(
    NotebookRender as any,
    {
      notebook: jupyterNode.json
    },
    null
  );
  jupyterNode.html = ReactDOMServer.renderToStaticMarkup(reactComponent);

  // Add path to the file path
  if (node.internal.type === `File`) {
    jupyterNode.fileAbsolutePath = node.absolutePath;
  }

  jupyterNode.internal!.contentDigest = crypto
    .createHash(`md5`)
    .update(JSON.stringify(jupyterNode))
    .digest(`hex`);
  createNode(jupyterNode);
  createParentChildLink({
    parent: node,
    child: jupyterNode
  });
};
