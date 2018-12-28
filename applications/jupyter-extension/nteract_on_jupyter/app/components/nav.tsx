import * as React from "react";
import styled from "styled-components";
import { NotebookMenu } from "@nteract/connected-components";
import { ContentRef } from "@nteract/core";

const NavUl = styled.ul`
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
  margin: 0 auto;
  width: 100%;
`;

const NavLi = styled.li`
  display: flex;
  box-sizing: border-box;
  padding: 0px 0px;

  /* 
   * When we have a nav section that ends up on the right, 
   * reverse the padding order 
   */
  :not(:first-child):last-child > :global(ul > li) {
    margin: 0px 0px 0px var(--nt-spacing-xl);
  } 
`;

const NavSectionUl = styled.ul`
  margin: 0 auto;
  padding: 0px 0px;
  display: flex;
  justify-content: space-between;
`;

const NavSectionLi = styled.li`
  display: flex;
  padding: 0px 0px;
  margin: 0px var(--nt-spacing-xl) 0px 0px;
`;

type NavSectionProps = {
  children: React.ReactChildren
};

export class NavSection extends React.Component<NavSectionProps, null> {
  render() {
    return (
      <NavSectionUl>
        {React.Children.map(this.props.children, child => {
          if (child === null) {
            return null;
          }
          return <NavSectionLi className="nav-item">{child}</NavSectionLi>;
        })}
      </NavSectionUl>
    );
  }
}

type NavProps = {
  children: React.ReactChildren,
  contentRef: ContentRef
};

export class Nav extends React.Component<NavProps, null> {
  render() {
    return (
      <div>
        <div className="nteract-nav">
          <NavUl>
            {React.Children.map(this.props.children, child => {
              return <NavLi>{child}</NavLi>;
            })}
          </NavUl>
        </div>
        <div>
          <NotebookMenu contentRef={this.props.contentRef} />
        </div>
      </div>
    );
  }
}

export default Nav;
