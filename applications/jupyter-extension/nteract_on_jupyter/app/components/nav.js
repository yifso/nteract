/* @flow strict */
import * as React from "react";
import { NotebookMenu } from "@nteract/connected-components";
import { StickyHeader } from "@nteract/presentational-components"
import type { ContentRef } from "@nteract/core";

type NavSectionProps = {
  children: React.Node
};

export class NavSection extends React.Component<NavSectionProps, null> {
  render() {
    return (
      <ul>
        {React.Children.map(this.props.children, child => {
          if (child === null) {
            return null;
          }
          return <li className="nav-item">{child}</li>;
        })}
        <style jsx>{`
          ul {
            margin: 0 auto;
            padding: 0px 0px;
            display: flex;
            justify-content: space-between;
          }
          li {
            display: flex;
            padding: 0px 0px;
            margin: 0px var(--nt-spacing-xl) 0px 0px;
          }
        `}</style>
      </ul>
    );
  }
}

type NavProps = {
  children: React.ChildrenArray<React.Element<*>>,
  contentRef: ContentRef
};

export class Nav extends React.Component<NavProps, null> {
  render() {
    return (
      <StickyHeader className="nteract-nav">
        <ul>
          {React.Children.map(this.props.children, child => {
            return <li className="top-nav-item">{child}</li>;
          })}
        </ul>
        <NotebookMenu contentRef={this.props.contentRef} />

        <style jsx>{`
          /** When we have a nav section that ends up on the right, reverse the padding order **/
          .top-nav-item:not(:first-child):last-child > :global(ul > li) {
            margin: 0px 0px 0px var(--nt-spacing-xl);
          }

          ul {
            display: flex;
            justify-content: space-between;
            padding: 0px 0px;
            margin: 0 auto;
          }
          header > ul {
          }
          li {
            display: flex;
            box-sizing: border-box;
            padding: 0px 0px;
          }
        `}</style>
      </StickyHeader>
    );
  }
}

export default Nav;
