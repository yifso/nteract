import * as React from "react";
import styled from "styled-components";

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

interface NavSectionProps {
  children: React.ReactNode;
}
export const NavSection = (props: NavSectionProps) => (
  <NavSectionUl>
    {React.Children.map(props.children, child => {
      if (child === null) {
        return null;
      }
      return <NavSectionLi className="nav-item">{child}</NavSectionLi>;
    })}
  </NavSectionUl>
);

type NavProps = NavSectionProps;
export const Nav = (props: NavProps) => (
  <div className="nteract-nav">
    <NavUl>
      {React.Children.map(props.children, child => {
        return <NavLi>{child}</NavLi>;
      })}
    </NavUl>
  </div>
);

export default Nav;
