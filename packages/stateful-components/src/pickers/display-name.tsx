import React from "react";

const childWithDisplayName = (
  children: React.ReactNode,
  displayName: string
): React.ReactNode => {
  let chosenOne;
  React.Children.forEach(children, child => {
    if (child.type && child.type.displayName === displayName) {
      chosenOne = child;
    }
  });
  return chosenOne;
};

export default childWithDisplayName;
